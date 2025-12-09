import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Users, Building2, Package, Truck, TrendingUp, ArrowRight } from 'lucide-react';

export default function AdminDashboard() {
  const { user, roles, loading: authLoading } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingRecipients: 0,
    pendingMedicines: 0,
    activePicups: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
    if (!authLoading && user && !roles.includes('admin')) {
      navigate('/donor');
    }
  }, [user, roles, authLoading, navigate]);

  useEffect(() => {
    if (user && roles.includes('admin')) {
      fetchStats();
    }
  }, [user, roles]);

  const fetchStats = async () => {
    const [users, recipients, medicines, pickups] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact' }),
      supabase.from('recipients').select('id', { count: 'exact' }).eq('is_verified', false),
      supabase.from('medicines').select('id', { count: 'exact' }).eq('status', 'pending'),
      supabase.from('pickup_requests').select('id', { count: 'exact' }).in('status', ['scheduled', 'confirmed', 'in_transit']),
    ]);

    setStats({
      totalUsers: users.data?.length || 0,
      pendingRecipients: recipients.data?.length || 0,
      pendingMedicines: medicines.data?.length || 0,
      activePicups: pickups.data?.length || 0,
    });

    setLoading(false);
  };

  if (authLoading || loading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage the MediShare platform</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Total Users
              </CardDescription>
              <CardTitle className="text-3xl font-display">{stats.totalUsers}</CardTitle>
            </CardHeader>
          </Card>
          <Card className={stats.pendingRecipients > 0 ? 'border-warning' : ''}>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Pending Recipients
              </CardDescription>
              <CardTitle className="text-3xl font-display text-warning">{stats.pendingRecipients}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Pending Medicines
              </CardDescription>
              <CardTitle className="text-3xl font-display">{stats.pendingMedicines}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Active Pickups
              </CardDescription>
              <CardTitle className="text-3xl font-display text-primary">{stats.activePicups}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="hover:shadow-card transition-shadow cursor-pointer" onClick={() => navigate('/admin/users')}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Manage Users</h3>
                  <p className="text-sm text-muted-foreground">View and manage user accounts</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-card transition-shadow cursor-pointer" onClick={() => navigate('/admin/recipients')}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${stats.pendingRecipients > 0 ? 'bg-warning' : 'bg-muted'}`}>
                  <Building2 className={`h-6 w-6 ${stats.pendingRecipients > 0 ? 'text-warning-foreground' : 'text-muted-foreground'}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Verify Recipients</h3>
                  <p className="text-sm text-muted-foreground">
                    {stats.pendingRecipients > 0 
                      ? `${stats.pendingRecipients} pending approval` 
                      : 'All caught up'}
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-card transition-shadow cursor-pointer" onClick={() => navigate('/admin/medicines')}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl gradient-accent flex items-center justify-center">
                  <Package className="h-6 w-6 text-accent-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">All Medicines</h3>
                  <p className="text-sm text-muted-foreground">View all donations</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Platform Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <p>Analytics and charts will be displayed here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}