
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import type { AuthFormValues } from '@/lib/schemas/auth';

interface AuthFormProps {
  onSubmit: (values: AuthFormValues) => void;
  loading: boolean;
  submitButtonText: string;
  loadingButtonText: string;
}

export const AuthForm = ({ onSubmit, loading, submitButtonText, loadingButtonText }: AuthFormProps) => {
  const form = useFormContext<AuthFormValues>();

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Email</FormLabel>
            <FormControl>
              <Input placeholder="m@example.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Password</FormLabel>
            <FormControl>
              <Input type="password" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? loadingButtonText : submitButtonText}
      </Button>
    </form>
  );
};
