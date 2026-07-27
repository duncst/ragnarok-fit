import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { resetPasswordSchema, type ResetPasswordFormValues } from '@/lib/schemas/passwordReset';
import { Shield, ArrowLeft } from 'lucide-react';

type LinkStatus = 'verifying' | 'ready' | 'invalid';

export const ResetPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [linkStatus, setLinkStatus] = useState<LinkStatus>('verifying');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    let isMounted = true;
    const markReady = () => { if (isMounted) setLinkStatus('ready'); };

    // Supabase's client library reads the recovery proof directly off the
    // full URL on its own (it can arrive as a `#access_token=...` fragment,
    // which React Router's useSearchParams can never see, or as a `?code=`/
    // `?token_hash=` query param depending on flow). Once it establishes the
    // session, it fires a PASSWORD_RECOVERY auth event — that's the reliable
    // signal to use instead of manually re-parsing the URL ourselves.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        markReady();
      }
    });

    // That processing can finish before this component even mounts, so also
    // check for an already-established session as a fallback.
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        if (session) {
          markReady();
          return;
        }

        // Fallback for a custom email template that links straight to this
        // page with a token_hash query param instead of going through
        // Supabase's hosted /verify redirect.
        const tokenHash = searchParams.get('token_hash');
        const type = searchParams.get('type');
        if (tokenHash && type === 'recovery') {
          return supabase.auth.verifyOtp({ token_hash: tokenHash, type: 'recovery' }).then(({ error }) => {
            if (!error) markReady();
          });
        }
      })
      .catch((error) => {
        console.error('Error checking for a recovery session:', error);
      });

    // Independent of whether the checks above ever resolve (e.g. a network
    // issue hangs the getSession() call itself), don't leave the user
    // staring at "Verifying..." forever — give it a window, then fail closed.
    const timeoutId = setTimeout(() => {
      if (isMounted) {
        setLinkStatus((current) => (current === 'verifying' ? 'invalid' : current));
      }
    }, 4000);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (linkStatus === 'invalid') {
      toast.error('Invalid or expired reset link. Please request a new one.');
      navigate('/auth');
    }
  }, [linkStatus, navigate]);

  const handleResetPassword = async (values: ResetPasswordFormValues) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: values.password,
      });

      if (error) throw error;

      toast.success('Password updated successfully! You can now sign in with your new password.');
      navigate('/auth');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToAuth = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="p-3 bg-primary/10 rounded-full">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Reset Your Password</h1>
          <p className="text-muted-foreground">
            Enter your new password below to complete the reset process.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>New Password</CardTitle>
            <CardDescription>
              Choose a strong password with at least 6 characters.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {linkStatus === 'verifying' ? (
              <div className="flex flex-col items-center gap-3 py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                <p className="text-sm text-muted-foreground">Verifying your reset link...</p>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleResetPassword)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Enter new password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Confirm new password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Updating Password...' : 'Update Password'}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBackToAuth}
                    className="w-full"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Sign In
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
