
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast as sonnerToast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const authSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type AuthFormValues = z.infer<typeof authSchema>;

const AuthPage = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');

  useEffect(() => {
    if (session) {
      navigate('/', { replace: true });
    }
  }, [session, navigate]);

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  const onTabChange = (value: string) => {
    form.clearErrors();
    setActiveTab(value);
  }

  const handleSignIn = async (values: AuthFormValues) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
    if (error) {
      sonnerToast.error('Sign In Failed', { description: error.message });
    } else {
      sonnerToast.success('Signed in successfully!');
      navigate('/');
    }
    setLoading(false);
  };

  const handleSignUp = async (values: AuthFormValues) => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) {
      sonnerToast.error('Sign Up Failed', { description: error.message });
    } else {
      sonnerToast.info('Check your email for the confirmation link.');
      // Reset form for good measure
      form.reset();
    }
    setLoading(false);
  };

  if (session) {
    return null; // Don't render anything if user is logged in (will be redirected)
  }

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-sm space-y-6">
          <img src="/lovable-uploads/f6efc86e-49db-45d0-90c4-b8e5fc3a8144.png" alt="Ragnarok Fit Logo" className="mx-auto h-28 w-auto" />
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">{activeTab === 'signin' ? 'Welcome back' : 'Create an account'}</h1>
            <p className="text-muted-foreground">
              {activeTab === 'signin' ? "Enter your email below to login to your account" : "Enter your details to create an account"}
            </p>
          </div>
          
          <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin" className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSignIn)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
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
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="signup" className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSignUp)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
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
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Signing Up...' : 'Sign Up'}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>

        </div>
      </div>
      <div className="hidden bg-muted lg:block relative">
        <img
          src="https://images.unsplash.com/photo-1581009137052-c032ded73957?auto=format&fit=crop&q=80&w=1974"
          alt="Woman lifting weights in a gym"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="relative z-10 flex h-full items-end bg-gradient-to-t from-black/80 to-transparent p-10">
            <div className="text-white max-w-md">
                <h2 className="text-4xl font-bold">Track. Analyze. Improve.</h2>
                <p className="mt-4 text-lg text-gray-200">Your ultimate fitness companion. All your workout and running data in one place.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
