
import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast as sonnerToast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mountain, Swords, Hammer, Target, Shield, Flame, Users, Crown } from "lucide-react";
import { authSchema, type AuthFormValues } from '@/lib/schemas/auth';
import { AuthForm } from '@/components/auth/AuthForm';

const LandingPage = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('signup');

  useEffect(() => {
    if (session) {
      navigate('/home', { replace: true });
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
      sonnerToast.success('Welcome to the Forge');
      navigate('/home');
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
      form.reset();
    }
    setLoading(false);
  };

  if (session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mountain className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">RAGNAROK FIT</h1>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setActiveTab('signin')}
            className="md:hidden"
          >
            Enter
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-card">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 text-center md:text-left">
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                RAGNAROK<br />FIT
              </h1>
              <p className="text-2xl md:text-3xl text-primary font-semibold">
                Become the Man Your Ancestors Would Toast in Valhalla
              </p>
              <p className="text-xl text-muted-foreground uppercase tracking-wide">
                Discipline. Capability. Brotherhood.
              </p>
              <Button size="lg" className="text-lg px-12 py-6 bg-primary hover:bg-primary/90">
                REQUEST AN INVITATION
              </Button>
            </div>
            
            {/* Auth Form */}
            <div className="flex justify-center">
              <Card className="w-full max-w-sm bg-card/80 backdrop-blur border-primary/30">
                <CardContent className="p-6">
                  <div className="space-y-4 text-center mb-6">
                    <h2 className="text-xl font-bold">Enter the Forge</h2>
                    <p className="text-muted-foreground text-sm">
                      For the committed only
                    </p>
                  </div>
                  
                  <FormProvider {...form}>
                    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="signup">Join</TabsTrigger>
                        <TabsTrigger value="signin">Enter</TabsTrigger>
                      </TabsList>
                      <TabsContent value="signup" className="pt-4">
                        <AuthForm
                          onSubmit={handleSignUp}
                          loading={loading}
                          submitButtonText="Request Entry"
                          loadingButtonText="Processing..."
                        />
                      </TabsContent>
                      <TabsContent value="signin" className="pt-4">
                        <AuthForm
                          onSubmit={handleSignIn}
                          loading={loading}
                          submitButtonText="Enter the Forge"
                          loadingButtonText="Entering..."
                        />
                      </TabsContent>
                    </Tabs>
                  </FormProvider>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Hero's Call Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center space-y-8 mb-16">
            <div className="flex items-center justify-center gap-3">
              <Swords className="h-8 w-8 text-primary" />
              <h2 className="text-4xl font-bold">ANSWER THE HERO'S CALL</h2>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Each morning, you will face a mythic challenge — a daily workout inspired by Norse legends and scaled to your level. Easy, Medium, or Hard — the call demands your effort, not perfection.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/20 border-primary/30">
              <CardContent className="p-8">
                <blockquote className="text-2xl font-bold text-center mb-6 italic">
                  "You don't need motivation. You need the ritual."
                </blockquote>
                <p className="text-center text-muted-foreground">
                  Daily consistency builds not just muscle, but mental steel.
                </p>
              </CardContent>
            </Card>
            
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Today's Challenge Sample</h3>
              <Card className="bg-card border-primary/20">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <h4 className="text-xl font-bold text-primary">Berserker's Foundation</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Battle Push-ups</span>
                        <span className="text-primary">3 × 10-15</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Viking Squats</span>
                        <span className="text-primary">3 × 15-20</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shield Hold</span>
                        <span className="text-primary">3 × 45s</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Button variant="outline" className="w-full">
                See a Sample Challenge
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* The Forge Section */}
      <section className="py-20 px-4 bg-card">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center space-y-8 mb-16">
            <div className="flex items-center justify-center gap-3">
              <Hammer className="h-8 w-8 text-primary" />
              <h2 className="text-4xl font-bold">FORGED BY ACTION</h2>
            </div>
            <p className="text-xl text-muted-foreground">
              Every week you complete 5 workouts, you earn a "Forging Week." These stack to unlock titles that reflect your discipline:
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-background border-primary/20">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold">1</span>
                    </div>
                    <span className="font-semibold">Sparked</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/40 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold">3</span>
                    </div>
                    <span className="font-semibold">Initiate of Iron</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/60 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold">12</span>
                    </div>
                    <span className="font-semibold">Iron Soul</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/80 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold">26</span>
                    </div>
                    <span className="font-semibold">Unbroken</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <Crown className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <span className="font-semibold text-primary">The Eternal Ember</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6 flex flex-col justify-center">
              <blockquote className="text-xl font-bold italic text-center">
                "You are not earning points. You are becoming someone new."
              </blockquote>
              <Button variant="outline" className="w-full">
                View the Full Title Ladder
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Capability Paths Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center space-y-8 mb-16">
            <div className="flex items-center justify-center gap-3">
              <Target className="h-8 w-8 text-primary" />
              <h2 className="text-4xl font-bold">BECOME USEFUL</h2>
            </div>
            <p className="text-xl text-muted-foreground">
              Fitness is just the beginning. Ragnarok Fit helps you earn real-world skills:
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Card className="bg-background border-primary/20 text-center">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto">
                  <span className="text-primary font-bold text-xl">💪</span>
                </div>
                <h3 className="font-bold">Strength</h3>
                <p className="text-sm text-muted-foreground">lift, carry, push, endure</p>
              </CardContent>
            </Card>

            <Card className="bg-background border-primary/20 text-center">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto">
                  <span className="text-primary font-bold text-xl">🔥</span>
                </div>
                <h3 className="font-bold">Survival</h3>
                <p className="text-sm text-muted-foreground">fire-starting, knot-tying, shelter-building</p>
              </CardContent>
            </Card>

            <Card className="bg-background border-primary/20 text-center">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto">
                  <span className="text-primary font-bold text-xl">🏃</span>
                </div>
                <h3 className="font-bold">Endurance</h3>
                <p className="text-sm text-muted-foreground">run, ruck, persist</p>
              </CardContent>
            </Card>

            <Card className="bg-background border-primary/20 text-center">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto">
                  <span className="text-primary font-bold text-xl">🤸</span>
                </div>
                <h3 className="font-bold">Mobility</h3>
                <p className="text-sm text-muted-foreground">control, balance, range</p>
              </CardContent>
            </Card>

            <Card className="bg-background border-primary/20 text-center md:col-span-2 lg:col-span-1">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto">
                  <span className="text-primary font-bold text-xl">🏙️</span>
                </div>
                <h3 className="font-bold">Urban Readiness</h3>
                <p className="text-sm text-muted-foreground">first aid, fix, navigate</p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center space-y-6">
            <p className="text-lg font-semibold">Badges are not handed out. They are forged.</p>
            <Button variant="outline" size="lg">
              Explore Capability Paths
            </Button>
          </div>
        </div>
      </section>

      {/* Invite-Only Brotherhood Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-card to-background">
        <div className="container mx-auto max-w-4xl text-center space-y-12">
          <div className="space-y-8">
            <div className="flex items-center justify-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              <h2 className="text-4xl font-bold">NOT FOR EVERYONE</h2>
            </div>
            <h3 className="text-2xl font-semibold text-primary">Invite-Only Brotherhood</h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ragnarok Fit is not for the curious. It's for the committed. Only members can invite others.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 my-12">
            <Card className="bg-background border-primary/20">
              <CardContent className="p-6 text-center">
                <p className="font-semibold">No ads</p>
              </CardContent>
            </Card>
            <Card className="bg-background border-primary/20">
              <CardContent className="p-6 text-center">
                <p className="font-semibold">No algorithms</p>
              </CardContent>
            </Card>
            <Card className="bg-background border-primary/20">
              <CardContent className="p-6 text-center">
                <p className="font-semibold">No influencers</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <p className="text-lg text-muted-foreground">
              Just men, showing up for themselves and each other.
            </p>
            <blockquote className="text-2xl font-bold italic">
              "You don't join the Forge. You're called to it."
            </blockquote>
            <Button size="lg" className="text-lg px-12 py-6">
              REQUEST AN INVITATION
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="container mx-auto text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Mountain className="h-5 w-5 text-primary" />
            <span className="font-bold">RAGNAROK FIT</span>
          </div>
          <p className="text-sm uppercase tracking-wide">
            Discipline. Capability. Brotherhood.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
