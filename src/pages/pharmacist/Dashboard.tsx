import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ClipboardCheck, CheckCircle, XCircle, Clock, ArrowRight } from 'lucide-react';

export default function PharmacistDashboard() {
  const { user, roles, loading: authLoading } = useAuth();
  const [stats, setStats] = useState({ pending: 0, verified: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
    if (!authLoading && user && !roles.includes('pharmacist')) {
      navigate('/donor');
    }
  }, [user, roles, authLoading, navigate]);

  useEffect(() => {
    if (user && roles.includes('pharmacist')) {
      fetchStats();
    }
  }, [user, roles]);

  const fetchStats = async () => {
    const { data: pending } = await supabase
      .from('medicines')
      .select('id', { count: 'exact' })
      .eq('status', 'pending');

    const { data: verified } = await supabase
      .from('verifications')
      .select('id', { count: 'exact' })
      .eq('pharmacist_id', user!.id)
      .eq('status', 'approved');

    const { data: rejected } = await supabase
      .from('verifications')
      .select('id', { count: 'exact' })
      .eq('pharmacist_id', user!.id)
      .eq('status', 'rejected');

    setStats({
      pending: pending?.length || 0,
      verified: verified?.length || 0,
      rejected: rejected?.length || 0,
    });

    setLoading(false);
  };

  if (authLoading || loading) {
    return (
      <DashboardLayout role="pharmacist">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="pharmacist">
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold">Pharmacist Dashboard</h1>
          <p className="text-muted-foreground">Review and verify medicine donations</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Pending Review
              </CardDescription>
              <CardTitle className="text-3xl font-display text-warning">{stats.pending}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Verified by You
              </CardDescription>
              <CardTitle className="text-3xl font-display text-success">{stats.verified}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                Rejected by You
              </CardDescription>
              <CardTitle className="text-3xl font-display text-destructive">{stats.rejected}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Quick Action */}
        <Card className="hover:shadow-card transition-shadow cursor-pointer" onClick={() => navigate('/pharmacist/queue')}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-xl gradient-primary flex items-center justify-center">
                <ClipboardCheck className="h-7 w-7 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">Verification Queue</h3>
                <p className="text-muted-foreground">
                  {stats.pending > 0 
                    ? `${stats.pending} medicines waiting for your review`
                    : 'No pending verifications'}
                </p>
              </div>
              <Button>
                Start Reviewing
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">Verification Guidelines</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Verify the medicine is sealed and in original packaging</li>
              <li>• Check that expiry date is at least 3 months in the future</li>
              <li>• Ensure the label is clearly readable</li>
              <li>• Reject controlled substances (Schedule H/H1/X)</li>
              <li>• Flag prescription medicines for proper handling</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}