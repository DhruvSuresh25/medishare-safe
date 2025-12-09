import { Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Camera, 
  Sparkles, 
  ClipboardCheck, 
  Truck, 
  Heart, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowRight
} from 'lucide-react';

export default function HowItWorks() {
  const eligibleMedicines = [
    'Sealed, unopened medicines',
    'OTC (Over-the-Counter) medicines',
    'Medicines with at least 3 months until expiry',
    'Original manufacturer packaging',
    'Clearly readable labels',
  ];

  const ineligibleMedicines = [
    'Opened or used medicines',
    'Expired medicines',
    'Controlled substances (Schedule X)',
    'Prescription-only medicines (Schedule H/H1)',
    'Damaged or water-exposed packaging',
    'Refrigerated medicines (cold chain)',
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="gradient-hero py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            How MediShare Works
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A simple, safe, and verified process to ensure your donated medicines reach those who need them most.
          </p>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-shrink-0">
                <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center">
                  <Camera className="h-8 w-8 text-primary-foreground" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">Step 1</span>
                  <h3 className="font-display text-2xl font-bold">Scan & Upload</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Take clear photos of your medicine packaging, including the label with drug name, expiry date, and batch number. 
                  Our AI-powered OCR technology automatically extracts all the important details.
                </p>
                <Card className="bg-muted/50">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <Sparkles className="h-5 w-5 text-accent mt-0.5" />
                      <div>
                        <p className="font-medium">AI-Powered Extraction</p>
                        <p className="text-sm text-muted-foreground">
                          Drug name, manufacturer, expiry date, batch number, and MRP are automatically detected.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-shrink-0">
                <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center">
                  <ClipboardCheck className="h-8 w-8 text-primary-foreground" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">Step 2</span>
                  <h3 className="font-display text-2xl font-bold">Expert Verification</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Licensed pharmacists review each submission to ensure safety and eligibility. 
                  They verify the medicine details, check for any concerns, and approve it for donation.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="bg-success/10 border-success/20">
                    <CardContent className="pt-4">
                      <p className="font-medium text-success flex items-center gap-2">
                        <Shield className="h-4 w-4" /> Safety First
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Every medicine is checked for proper storage, packaging integrity, and expiry.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-primary/10 border-primary/20">
                    <CardContent className="pt-4">
                      <p className="font-medium text-primary flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" /> Licensed Experts
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Only qualified pharmacists with valid licenses can verify donations.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-shrink-0">
                <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center">
                  <Truck className="h-8 w-8 text-primary-foreground" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">Step 3</span>
                  <h3 className="font-display text-2xl font-bold">Scheduled Pickup</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Once verified, schedule a convenient pickup time. Our collection partners will pick up the medicines 
                  from your doorstep with complete chain-of-custody tracking.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Free doorstep pickup
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Flexible time slots
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-success" />
                    QR code tracking for transparency
                  </li>
                </ul>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-shrink-0">
                <div className="h-16 w-16 rounded-2xl gradient-accent flex items-center justify-center">
                  <Heart className="h-8 w-8 text-accent-foreground" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-sm font-medium text-accent bg-accent/10 px-3 py-1 rounded-full">Step 4</span>
                  <h3 className="font-display text-2xl font-bold">Reach Those in Need</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Verified medicines are matched with registered recipient organizations — NGOs, clinics, and pharmacies 
                  serving underprivileged communities. You'll receive a donation receipt and can track your impact.
                </p>
                <Card className="border-accent/20 bg-accent/5">
                  <CardContent className="pt-4">
                    <p className="font-medium">Your Impact Matters</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Track how many lives your donations have touched through your donor dashboard.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl font-bold text-center mb-12">
            What Can Be Donated?
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-success/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-success">
                  <CheckCircle className="h-5 w-5" />
                  Eligible Medicines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {eligibleMedicines.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-destructive/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <XCircle className="h-5 w-5" />
                  Not Eligible
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {ineligibleMedicines.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <XCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="max-w-4xl mx-auto mt-8 border-warning/30 bg-warning/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-warning flex-shrink-0" />
                <div>
                  <p className="font-medium">Important Safety Note</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Prescription medicines (Schedule H/H1) and controlled substances cannot be donated through this platform 
                    due to regulatory requirements. These will be safely disposed through certified biomedical waste partners.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-bold mb-4">Ready to Donate?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Your unused medicines can save lives. Start your donation journey today.
          </p>
          <Button size="lg" asChild>
            <Link to="/auth?mode=signup">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}