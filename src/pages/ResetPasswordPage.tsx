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

export const ResetPasswordPage = () => {
  const [loading, setLoading] = useState(false);
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
    // Check if we have the necessary tokens in the URL
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    const type = searchParams.get('type');
    const tokenHash = searchParams.get('token_hash');
    const token = searchParams.get('token');
    
    console.log('Reset password page loaded');
    console.log('URL params:', { 
      accessToken: !!accessToken, 
      refreshToken: !!refreshToken, 
      type, 
      tokenHash: !!tokenHash, 
      token: !!token 
    });
    console.log('All search params:', Object.fromEntries(searchParams.entries()));
    console.log('Full URL:', window.location.href);
    
    // Handle different URL formats from Supabase
    if (type === 'recovery') {
      if (accessToken && refreshToken) {
        // New format with tokens in URL
        console.log('Setting session with tokens from URL');
        supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        }).then(({ error }) => {
          if (error) {
            console.error('Session setup error:', error);
            toast.error('Invalid or expired reset link. Please request a new one.');
            navigate('/auth');
          } else {
            console.log('Session setup successful');
          }
        });
      } else if (tokenHash) {
        // Verify the token hash
        console.log('Verifying token hash');
        supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: 'recovery'
        }).then(({ error }) => {
          if (error) {
            console.error('Token verification error:', error);
            toast.error('Invalid or expired reset link. Please request a new one.');
            navigate('/auth');
          } else {
            console.log('Token verification successful');
          }
        });
      } else {
        console.error('Invalid reset link - missing required parameters');
        toast.error('Invalid or expired reset link. Please request a new one.');
        navigate('/auth');
      }
    } else {
      console.error('Invalid reset link - wrong type or missing type');
      toast.error('Invalid or expired reset link. Please request a new one.');
      navigate('/auth');
    }
  }, [searchParams, navigate]);

  const handleResetPassword = async (values: ResetPasswordFormValues) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: values.password,
      });

      if (error) throw error;

      toast.success('Password updated successfully! You can now sign in with your new password.');
      navigate('/auth');
    } catch (error: any) {
      console.error('Password update error:', error);
      toast.error(error.message || 'Failed to update password. Please try again.');
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};