
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mountain, Swords, Hammer, Target } from "lucide-react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mountain className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">RAGNAROK FIT</h1>
          </div>
          <Button asChild variant="outline">
            <Link to="/auth">Login</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                RAGNAROK FIT
              </h1>
              <p className="text-xl text-muted-foreground">
                Become the man your ancestors would toast in Valhalla.
              </p>
              <p className="text-lg text-muted-foreground">
                The Norse-inspired fitness app that builds men – one Hero's Call at a time.
              </p>
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link to="/auth">START YOUR JOURNEY</Link>
              </Button>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-80 h-80 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center">
                  <div className="space-y-4 text-center">
                    <Mountain className="h-20 w-20 text-primary mx-auto" />
                    <p className="text-sm text-muted-foreground">
                      Transform through<br />
                      disciplined action
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Ragnarok Fit Different */}
      <section className="py-20 px-4 bg-card">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-16">
            WHAT MAKES RAGNAROK FIT DIFFERENT
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-background border-primary/20">
              <CardContent className="p-8 text-center space-y-4">
                <Swords className="h-12 w-12 text-primary mx-auto" />
                <h3 className="text-xl font-bold">The Hero's Call</h3>
                <p className="text-muted-foreground">
                  Daily mythic workout challenges calibrated to your level. Ritual, not routine.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-background border-primary/20">
              <CardContent className="p-8 text-center space-y-4">
                <Hammer className="h-12 w-12 text-primary mx-auto" />
                <h3 className="text-xl font-bold">Forging System</h3>
                <p className="text-muted-foreground">
                  Earn titles worthy of legend through consistent effort.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-background border-primary/20">
              <CardContent className="p-8 text-center space-y-4">
                <Target className="h-12 w-12 text-primary mx-auto" />
                <h3 className="text-xl font-bold">Capability Paths</h3>
                <p className="text-muted-foreground">
                  Build real world fitness – gain endurance, survival skills, and resilience.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Deep Dive */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-16">
            {/* The Hero's Call Feature */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center border-2 border-primary/20">
                    <Swords className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-3xl font-bold">THE HERO'S CALL</h3>
                </div>
                <p className="text-lg text-muted-foreground">
                  Daily workout challenges to build strength and discipline.
                </p>
                <p className="text-muted-foreground">
                  Each day brings a new mythic challenge, calibrated to push your limits while respecting your current capabilities. No mindless repetition – every workout is a ritual of transformation.
                </p>
              </div>
              <div className="bg-card border border-primary/20 rounded-lg p-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Swords className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Today's Challenge:</span>
                  </div>
                  <h4 className="text-xl font-bold">Warrior's Foundation</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Push-ups</span>
                      <span className="text-primary">3 × 8-12</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Squats</span>
                      <span className="text-primary">3 × 10-15</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Plank Hold</span>
                      <span className="text-primary">3 × 30s</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Forging System Feature */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="bg-card border border-primary/20 rounded-lg p-8 order-2 md:order-1">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Hammer className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Your Forge Progress:</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground">
                        ✓
                      </div>
                      <span className="text-primary">Novice Warrior</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/50 rounded-full flex items-center justify-center text-xs">
                        2/5
                      </div>
                      <span>Stalwart Guardian</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-xs">
                        0/10
                      </div>
                      <span className="text-muted-foreground">Legendary Hero</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-6 order-1 md:order-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center border-2 border-primary/20">
                    <Hammer className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-3xl font-bold">FORGING SYSTEM</h3>
                </div>
                <p className="text-lg text-muted-foreground">
                  Earn titles worthy of legend through consistent effort.
                </p>
                <p className="text-muted-foreground">
                  Your dedication is forged into legendary titles. Each completed challenge brings you closer to earning names that would echo through the halls of Valhalla.
                </p>
              </div>
            </div>

            {/* Capability Paths Feature */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center border-2 border-primary/20">
                    <Target className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-3xl font-bold">CAPABILITY PATHS</h3>
                </div>
                <p className="text-lg text-muted-foreground">
                  Master strength, survival, endurance, and agility.
                </p>
                <p className="text-muted-foreground">
                  Four distinct paths of mastery await. Choose your focus and progress through increasingly challenging benchmarks that build real-world capabilities worthy of ancient warriors.
                </p>
              </div>
              <div className="bg-card border border-primary/20 rounded-lg p-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto">
                      <span className="text-primary font-bold">💪</span>
                    </div>
                    <p className="text-sm font-semibold">Strength</p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto">
                      <span className="text-primary font-bold">🏃</span>
                    </div>
                    <p className="text-sm font-semibold">Endurance</p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto">
                      <span className="text-primary font-bold">🌿</span>
                    </div>
                    <p className="text-sm font-semibold">Survival</p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto">
                      <span className="text-primary font-bold">⚡</span>
                    </div>
                    <p className="text-sm font-semibold">Agility</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-card">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-16">
            REAL GROWTH LOOKS LIKE THIS
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-background">
              <CardContent className="p-6 space-y-4">
                <p className="text-lg font-semibold">"I NOW WIELD THE STRENGTH"</p>
                <p className="text-muted-foreground text-sm">
                  "The Hero's Call transformed my approach to fitness. Every workout feels like stepping into legend."
                </p>
                <p className="text-xs text-muted-foreground">- Erik, Novice Warrior</p>
              </CardContent>
            </Card>
            
            <Card className="bg-background">
              <CardContent className="p-6 space-y-4">
                <p className="text-lg font-semibold">"I'M ENDURANCE-STALWART LIKE"</p>
                <p className="text-muted-foreground text-sm">
                  "The capability paths gave me clear goals. I've never been stronger or more disciplined."
                </p>
                <p className="text-xs text-muted-foreground">- Magnus, Stalwart Guardian</p>
              </CardContent>
            </Card>
            
            <Card className="bg-background">
              <CardContent className="p-6 space-y-4">
                <p className="text-lg font-semibold">"I'M DISCIPLINED"</p>
                <p className="text-muted-foreground text-sm">
                  "This isn't just fitness – it's a way of life. The forging system keeps me motivated daily."
                </p>
                <p className="text-xs text-muted-foreground">- Bjorn, Legendary Hero</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-2xl text-center space-y-8">
          <h2 className="text-4xl font-bold">
            BEGIN YOUR LEGENDARY TRANSFORMATION
          </h2>
          <p className="text-xl text-muted-foreground">
            Your ancestors await. Will you answer the call?
          </p>
          <Button asChild size="lg" className="text-lg px-12 py-6">
            <Link to="/auth">START YOUR JOURNEY</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="container mx-auto text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Mountain className="h-5 w-5 text-primary" />
            <span className="font-bold">RAGNAROK FIT</span>
          </div>
          <p className="text-sm">
            Forge your legend. Build your strength. Answer the Hero's Call.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
