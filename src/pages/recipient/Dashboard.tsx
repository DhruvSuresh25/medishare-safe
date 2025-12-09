import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Package, FileText, Building2, ArrowRight, AlertCircle } from 'lucide-react';

export default function RecipientDashboard() {
  const { user, roles, loading: authLoading } = useAuth();
  const [recipient, setRecipient] = useState<any>(null);
  const [stats, setStats] = useState({ available: 0, claimed: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
    if (!authLoading && user && !roles.includes('recipient')) {
      navigate('/donor');
    }
  }, [user, roles, authLoading, navigate]);

  useEffect(() => {
    if (user && roles.includes('recipient')) {
      fetchData();
    }
  }, [user, roles]);

  const fetchData = async () => {
    // Fetch recipient org
    const { data: recipientData } = await supabase
      .from('recipients')
      .select('*')
      .eq('user_id', user!.id)
      .single();

    if (recipientData) {
      setRecipient(recipientData);

      // Fetch available medicines
      const { data: available } = await supabase
        .from('medicines')
        .select('id', { count: 'exact' })
        .eq('status', 'verified');

      // Fetch claims
      const { data: claims } = await supabase
        .from('claims')
        .select('id', { count: 'exact' })
        .eq('recipient_id', recipientData.id);

      setStats({
        available: available?.length || 0,
        claimed: claims?.length || 0,
      });
    }

    setLoading(false);
  };

  if (authLoading || loading) {
    return (
      <DashboardLayout role="recipient">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!recipient) {
    return (
      <DashboardLayout role="recipient">
        <div className="max-w-xl mx-auto text-center py-12">
          <Building2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="font-display text-2xl font-bold mb-2">Register Your Organization</h2>
          <p className="text-muted-foreground mb-6">
            To access donated medicines, please register your organization details.
          </p>
          <Button asChild size="lg">
            <Link to="/recipient/organization">Register Organization</Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  if (!recipient.is_verified) {
    return (
      <DashboardLayout role="recipient">
        <Card className="max-w-xl mx-auto">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-warning" />
            <h2 className="font-display text-xl font-bold mb-2">Verification Pending</h2>
            <p className="text-muted-foreground mb-4">
              Your organization registration is under review. You'll be notified once verified.
            </p>
            <Badge variant="secondary">Pending Approval</Badge>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="recipient">
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold">Welcome, {recipient.organization_name}</h1>
          <p className="text-muted-foreground">Browse and claim verified medicines for your organization</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Available Medicines
              </CardDescription>
              <CardTitle className="text-3xl font-display text-primary">{stats.available}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Your Claims
              </CardDescription>
              <CardTitle className="text-3xl font-display">{stats.claimed}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="hover:shadow-card transition-shadow cursor-pointer" onClick={() => navigate('/recipient/available')}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center">
                  <Package className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Browse Medicines</h3>
                  <p className="text-sm text-muted-foreground">View and claim available donations</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-card transition-shadow cursor-pointer" onClick={() => navigate('/recipient/claims')}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl gradient-accent flex items-center justify-center">
                  <FileText className="h-6 w-6 text-accent-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">My Claims</h3>
                  <p className="text-sm text-muted-foreground">Track your claimed medicines</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Organization Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Organization Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Organization Type</p>
                <p className="font-medium capitalize">{recipient.organization_type}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">License Number</p>
                <p className="font-medium">{recipient.license_number || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Contact Person</p>
                <p className="font-medium">{recipient.contact_person}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Contact Phone</p>
                <p className="font-medium">{recipient.contact_phone}</p>
              </div>
            </div>
            <Button variant="outline" className="mt-4" asChild>
              <Link to="/recipient/organization">Edit Organization</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}