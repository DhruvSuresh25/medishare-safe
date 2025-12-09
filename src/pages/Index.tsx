import { Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Heart,
  Pill,
  ShieldCheck,
  Truck,
  Users,
  ArrowRight,
  Camera,
  CheckCircle,
  Package,
  Recycle,
  Building2,
  Award,
} from 'lucide-react';

export default function Index() {
  const stats = [
    { value: '50K+', label: 'Medicines Donated' },
    { value: '10K+', label: 'Lives Impacted' },
    { value: '500+', label: 'Partner Organizations' },
    { value: '₹2Cr+', label: 'Medicines Saved from Waste' },
  ];

  const howItWorks = [
    {
      step: 1,
      icon: <Camera className="h-8 w-8" />,
      title: 'Scan & Upload',
      description: 'Take a photo of your unused medicine. Our AI extracts all details automatically.',
    },
    {
      step: 2,
      icon: <ShieldCheck className="h-8 w-8" />,
      title: 'Expert Verification',
      description: 'Licensed pharmacists verify the medicine for safety and eligibility.',
    },
    {
      step: 3,
      icon: <Truck className="h-8 w-8" />,
      title: 'Scheduled Pickup',
      description: 'We arrange a convenient pickup from your location.',
    },
    {
      step: 4,
      icon: <Heart className="h-8 w-8" />,
      title: 'Reach Those in Need',
      description: 'Verified medicines reach registered NGOs, clinics, and pharmacies.',
    },
  ];

  const features = [
    {
      icon: <Pill className="h-6 w-6 text-primary" />,
      title: 'AI-Powered OCR',
      description: 'Instant medicine label scanning with intelligent data extraction.',
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-primary" />,
      title: 'Pharmacist Verified',
      description: 'Every donation is reviewed by licensed professionals.',
    },
    {
      icon: <Recycle className="h-6 w-6 text-primary" />,
      title: 'Eco-Friendly Disposal',
      description: 'Expired medicines are safely disposed through certified partners.',
    },
    {
      icon: <Building2 className="h-6 w-6 text-primary" />,
      title: 'Verified Recipients',
      description: 'Only licensed organizations receive donated medicines.',
    },
    {
      icon: <Package className="h-6 w-6 text-primary" />,
      title: 'Complete Tracking',
      description: 'Track your donation from submission to delivery.',
    },
    {
      icon: <Award className="h-6 w-6 text-primary" />,
      title: 'Donation Receipts',
      description: 'Get official receipts for your charitable contributions.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="gradient-hero py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 animate-fade-in">
              <Heart className="h-3 w-3 mr-1 fill-accent text-accent" />
              Saving Lives, Reducing Waste
            </Badge>
            
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-slide-up">
              Give Your Unused Medicines a{' '}
              <span className="text-primary">Second Life</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Connect surplus medicines with those who need them most. 
              Safe, verified, and completely free.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Button size="lg" asChild className="text-lg px-8">
                <Link to="/auth?mode=signup">
                  Start Donating
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8">
                <Link to="/how-it-works">
                  Learn How It Works
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="font-display text-3xl md:text-4xl font-bold mb-1">
                  {stat.value}
                </div>
                <div className="text-primary-foreground/80 text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              How MediShare Works
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A simple, safe process to donate your unused medicines
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((item, index) => (
              <Card 
                key={index} 
                className="relative overflow-hidden group hover:shadow-elevated transition-shadow duration-300"
              >
                <CardHeader>
                  <div className="flex items-center gap-4 mb-2">
                    <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground">
                      {item.icon}
                    </div>
                    <span className="font-display text-5xl font-bold text-muted/30 group-hover:text-primary/20 transition-colors">
                      {item.step}
                    </span>
                  </div>
                  <CardTitle className="font-display">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {item.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Built for Safety & Trust
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Every feature designed to ensure safe, verified medicine donations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-card transition-shadow duration-300">
                <CardHeader className="pb-2">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="font-display text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* User Types */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Join the MediShare Community
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Whether you want to donate, verify, or receive — there's a place for you
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-2 hover:border-primary/50 transition-colors duration-300">
              <CardHeader>
                <div className="h-14 w-14 rounded-2xl gradient-accent flex items-center justify-center mb-4">
                  <Heart className="h-7 w-7 text-accent-foreground" />
                </div>
                <CardTitle className="font-display text-xl">Donors</CardTitle>
                <CardDescription>
                  Have unused medicines at home? Donate them safely to help others.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Free pickup from your location
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Get donation receipts
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Track your impact
                  </li>
                </ul>
                <Button asChild className="w-full">
                  <Link to="/auth?mode=signup">Start Donating</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors duration-300">
              <CardHeader>
                <div className="h-14 w-14 rounded-2xl gradient-primary flex items-center justify-center mb-4">
                  <ShieldCheck className="h-7 w-7 text-primary-foreground" />
                </div>
                <CardTitle className="font-display text-xl">Pharmacists</CardTitle>
                <CardDescription>
                  Licensed pharmacist? Help verify donated medicines for safety.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Contribute your expertise
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Flexible verification hours
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Make a meaningful impact
                  </li>
                </ul>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/auth?mode=signup&role=pharmacist">Become a Verifier</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors duration-300">
              <CardHeader>
                <div className="h-14 w-14 rounded-2xl bg-success flex items-center justify-center mb-4">
                  <Building2 className="h-7 w-7 text-success-foreground" />
                </div>
                <CardTitle className="font-display text-xl">Organizations</CardTitle>
                <CardDescription>
                  NGO, clinic, or pharmacy? Register to receive verified medicines.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Access verified medicines
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-success" />
                    No cost to your organization
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Help your community
                  </li>
                </ul>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/auth?mode=signup&role=recipient">Register Organization</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 gradient-primary">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <Users className="h-16 w-16 mx-auto mb-6 text-primary-foreground/80" />
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Make a Difference?
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8">
              Join thousands of donors who are helping reduce medicine waste 
              and save lives across India.
            </p>
            <Button size="lg" variant="secondary" asChild className="text-lg px-8">
              <Link to="/auth?mode=signup">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}