
import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast as sonnerToast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { authSchema, type AuthFormValues } from '@/lib/schemas/auth';
import { AuthForm } from '@/components/auth/AuthForm';

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
    form.reset();
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
    <div className="w-full min-h-screen relative">
      <div className="absolute inset-0">
        <img
          src="/lovable-uploads/fa0e47b1-a91c-4377-b5e0-17b5a55dfff8.png"
          alt="Epic landscape with mountains and lightning"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-sm space-y-6">
          <img src="/lovable-uploads/f6efc86e-49db-45d0-90c4-b8e5fc3a8144.png" alt="Ragnarok Fit Logo" className="mx-auto h-80 w-auto" />
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold text-white">{activeTab === 'signin' ? 'Welcome back' : 'Forge your legend.'}</h1>
            <p className="text-muted-foreground">
              {activeTab === 'signin' ? "Enter your email below to login to your account" : "Track every lift, every run. Only challenge creates change."}
            </p>
          </div>
          
          <FormProvider {...form}>
            <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="signin" className="pt-6">
                <AuthForm
                  onSubmit={handleSignIn}
                  loading={loading}
                  submitButtonText="Sign In"
                  loadingButtonText="Signing In..."
                />
              </TabsContent>
              <TabsContent value="signup" className="pt-6">
                <AuthForm
                  onSubmit={handleSignUp}
                  loading={loading}
                  submitButtonText="Sign Up"
                  loadingButtonText="Signing Up..."
                />
              </TabsContent>
            </Tabs>
          </FormProvider>

        </div>
      </div>
    </div>
  );
};

export default AuthPage;
