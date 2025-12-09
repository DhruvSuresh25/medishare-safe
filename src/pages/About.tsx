import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Target, Eye, Users, Leaf, Shield } from 'lucide-react';

export default function About() {
  const values = [
    {
      icon: <Heart className="h-6 w-6" />,
      title: 'Compassion',
      description: 'Every medicine we save represents hope for someone in need.',
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Safety First',
      description: 'Rigorous verification ensures only safe medicines reach recipients.',
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Community',
      description: 'Building bridges between donors, pharmacists, and those in need.',
    },
    {
      icon: <Leaf className="h-6 w-6" />,
      title: 'Sustainability',
      description: 'Reducing pharmaceutical waste for a healthier planet.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="gradient-hero py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            About MediShare
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're on a mission to ensure no medicine goes to waste while people struggle to afford essential healthcare.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-2 border-primary/20">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-primary-foreground" />
                </div>
                <h2 className="font-display text-2xl font-bold mb-3">Our Mission</h2>
                <p className="text-muted-foreground">
                  To create a safe, transparent platform that connects surplus medicines with those who need them most, 
                  ensuring no life-saving medication goes to waste while someone struggles without access to essential healthcare.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-accent/20">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-xl gradient-accent flex items-center justify-center mb-4">
                  <Eye className="h-6 w-6 text-accent-foreground" />
                </div>
                <h2 className="font-display text-2xl font-bold mb-3">Our Vision</h2>
                <p className="text-muted-foreground">
                  A world where every person has access to the medicines they need, and pharmaceutical waste 
                  is minimized through community-driven redistribution and responsible disposal.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl font-bold mb-6">The Problem We're Solving</h2>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="p-6 bg-card rounded-xl shadow-card">
                <div className="text-4xl font-display font-bold text-destructive mb-2">₹15,000 Cr</div>
                <p className="text-sm text-muted-foreground">Worth of medicines wasted annually in India</p>
              </div>
              <div className="p-6 bg-card rounded-xl shadow-card">
                <div className="text-4xl font-display font-bold text-warning mb-2">63%</div>
                <p className="text-sm text-muted-foreground">Of Indians pay for healthcare out of pocket</p>
              </div>
              <div className="p-6 bg-card rounded-xl shadow-card">
                <div className="text-4xl font-display font-bold text-primary mb-2">55M</div>
                <p className="text-sm text-muted-foreground">People pushed into poverty by medical expenses</p>
              </div>
            </div>
            <p className="text-muted-foreground">
              While millions of unused medicines expire in home cabinets, millions more struggle to afford essential treatments. 
              MediShare bridges this gap with a safe, verified redistribution system.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {values.map((value, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 text-primary">
                    {value.icon}
                  </div>
                  <h3 className="font-display text-lg font-bold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Safety & Compliance */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-3xl font-bold text-center mb-8">Safety & Compliance</h2>
            <Card>
              <CardContent className="pt-6 space-y-4">
                <p className="text-muted-foreground">
                  MediShare operates with the highest standards of safety and regulatory compliance:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>All donations are verified by licensed pharmacists before distribution</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Controlled substances and prescription-only medicines are safely disposed</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Recipients are verified organizations with proper licenses</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Complete chain-of-custody tracking for every medicine</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Partnership with certified biomedical waste disposal facilities</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}