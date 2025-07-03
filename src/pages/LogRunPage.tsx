
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useRunningPR } from "@/hooks/useRunningPR";

const formSchema = z.object({
  distance: z.number().gt(0, { message: "Distance must be greater than 0" }),
  duration: z.number().gt(0, { message: "Duration must be greater than 0" }),
  runType: z.string().min(2, {
    message: "Run type must be at least 2 characters.",
  }),
  date: z.date(),
  notes: z.string().optional(),
  elevation: z.number().optional(),
  avgHr: z.number().optional(),
})

const LogRunPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { checkAndSaveRunningPR } = useRunningPR();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      distance: 1,
      duration: 600,
      runType: 'Easy Run',
      date: new Date(),
    },
  })

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase.from('runs').insert({
        distance: values.distance,
        duration: values.duration,
        run_type: values.runType,
        date: values.date.toISOString(),
        notes: values.notes || null,
        elevation: values.elevation || null,
        avg_hr: values.avgHr || null,
      }).select().single();

      if (error) throw error;
      return data;
    },
    onSuccess: async (data) => {
      // Check for running PR
      await checkAndSaveRunningPR({
        distance: data.distance,
        duration: data.duration
      });
      
      toast({
        title: "Run logged successfully!",
        description: "Your run has been added to your history.",
      });
      navigate('/run');
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }

  return (
    <div className="container mx-auto max-w-2xl">
      <h1 className="text-3xl font-bold mb-4">Log a Run</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="distance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Distance (km)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="1" {...field} />
                </FormControl>
                <FormDescription>
                  How far did you run?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (seconds)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="600" {...field} />
                </FormControl>
                <FormDescription>
                  How long did you run for?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="runType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Run Type</FormLabel>
                <FormControl>
                  <Input placeholder="Easy Run" {...field} />
                </FormControl>
                <FormDescription>
                  What type of run was it?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} value={field.value?.toISOString().split('T')[0]} onChange={(e) => field.onChange(new Date(e.target.value))} />
                </FormControl>
                <FormDescription>
                  When did you run?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Felt great!" {...field} />
                </FormControl>
                <FormDescription>
                  Any notes about the run?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="elevation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Elevation (meters)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="100" {...field} />
                </FormControl>
                <FormDescription>
                  How much elevation gain was there?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="avgHr"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Average HR (bpm)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="150" {...field} />
                </FormControl>
                <FormDescription>
                  What was your average heart rate?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default LogRunPage;
