import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Package, Clock, CheckCircle, XCircle, Truck, Plus, ArrowRight } from 'lucide-react';

export default function DonorDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState({ total: 0, pending: 0, verified: 0, rejected: 0 });
  const [recentDonations, setRecentDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    // Fetch stats
    const { data: medicines } = await supabase
      .from('medicines')
      .select('status')
      .eq('donor_id', user!.id);

    if (medicines) {
      setStats({
        total: medicines.length,
        pending: medicines.filter(m => m.status === 'pending').length,
        verified: medicines.filter(m => m.status === 'verified').length,
        rejected: medicines.filter(m => m.status === 'rejected').length,
      });
    }

    // Fetch recent donations
    const { data: recent } = await supabase
      .from('medicines')
      .select('*')
      .eq('donor_id', user!.id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (recent) {
      setRecentDonations(recent);
    }

    setLoading(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'verified':
        return <Badge className="bg-success text-success-foreground"><CheckCircle className="h-3 w-3 mr-1" />Verified</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      case 'claimed':
        return <Badge className="bg-primary"><Package className="h-3 w-3 mr-1" />Claimed</Badge>;
      case 'picked_up':
        return <Badge className="bg-accent text-accent-foreground"><Truck className="h-3 w-3 mr-1" />Picked Up</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (authLoading || loading) {
    return (
      <DashboardLayout role="donor">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="donor">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold">Welcome back!</h1>
            <p className="text-muted-foreground">Track your donations and make a difference</p>
          </div>
          <Button asChild size="lg">
            <Link to="/donor/donate">
              <Plus className="mr-2 h-5 w-5" />
              Donate Medicine
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Donations</CardDescription>
              <CardTitle className="text-3xl font-display">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Pending Review</CardDescription>
              <CardTitle className="text-3xl font-display text-warning">{stats.pending}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Verified</CardDescription>
              <CardTitle className="text-3xl font-display text-success">{stats.verified}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Rejected</CardDescription>
              <CardTitle className="text-3xl font-display text-destructive">{stats.rejected}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="hover:shadow-card transition-shadow cursor-pointer" onClick={() => navigate('/donor/donate')}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center">
                  <Package className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Donate Medicine</h3>
                  <p className="text-sm text-muted-foreground">Scan and submit a new donation</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-card transition-shadow cursor-pointer" onClick={() => navigate('/donor/pickups')}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl gradient-accent flex items-center justify-center">
                  <Truck className="h-6 w-6 text-accent-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Schedule Pickup</h3>
                  <p className="text-sm text-muted-foreground">Arrange collection of your donations</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Donations */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Donations</CardTitle>
              <CardDescription>Your latest medicine submissions</CardDescription>
            </div>
            <Button variant="ghost" asChild>
              <Link to="/donor/donations">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentDonations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No donations yet</p>
                <Button asChild className="mt-4">
                  <Link to="/donor/donate">Make Your First Donation</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentDonations.map((donation) => (
                  <div key={donation.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">{donation.drug_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {donation.manufacturer} • Qty: {donation.quantity}
                      </p>
                    </div>
                    {getStatusBadge(donation.status)}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}