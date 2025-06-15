
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast as sonnerToast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const formSchema = z.object({
  weight: z.coerce.number().positive().optional().nullable(),
  vo2_max: z.coerce.number().positive().optional().nullable(),
}).refine(data => data.weight || data.vo2_max, {
  message: "At least one field must be filled",
  path: ["weight"], // you can pick any field to display the error
});

const LogBodyMetricsPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      weight: null,
      vo2_max: null,
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      if (!user) throw new Error('You must be logged in.');
      
      const { error } = await supabase.from('body_metrics').insert({
        user_id: user.id,
        weight: values.weight,
        vo2_max: values.vo2_max,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      sonnerToast.success('Body metrics logged successfully!');
      queryClient.invalidateQueries({ queryKey: ['body_metrics', user?.id] });
      navigate('/');
    },
    onError: (error) => {
      sonnerToast.error('Failed to log body metrics', {
        description: (error as Error).message,
      });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutation.mutate(values);
  };

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Log Body Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (kg)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" placeholder="e.g. 75.5" {...field} onChange={e => field.onChange(e.target.value === '' ? null : e.target.value)} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vo2_max"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>VO2 Max</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" placeholder="e.g. 45.2" {...field} onChange={e => field.onChange(e.target.value === '' ? null : e.target.value)} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={mutation.isPending}>
                {mutation.isPending ? 'Logging...' : 'Log Metrics'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LogBodyMetricsPage;
