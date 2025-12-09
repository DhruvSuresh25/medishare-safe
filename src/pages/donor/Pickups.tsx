import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Truck, Calendar, MapPin, Phone } from 'lucide-react';
import { format } from 'date-fns';

export default function DonorPickups() {
  const { user, loading: authLoading } = useAuth();
  const [pickups, setPickups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchPickups();
    }
  }, [user]);

  const fetchPickups = async () => {
    const { data, error } = await supabase
      .from('pickup_requests')
      .select('*, medicines(drug_name, quantity)')
      .eq('donor_id', user!.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPickups(data);
    }
    setLoading(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="secondary">Scheduled</Badge>;
      case 'confirmed':
        return <Badge className="bg-primary">Confirmed</Badge>;
      case 'in_transit':
        return <Badge className="bg-accent text-accent-foreground">In Transit</Badge>;
      case 'completed':
        return <Badge className="bg-success text-success-foreground">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
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
        <div>
          <h1 className="font-display text-3xl font-bold">Pickup Requests</h1>
          <p className="text-muted-foreground">Track your scheduled medicine pickups</p>
        </div>

        {pickups.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Truck className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No pickup requests yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Once your donations are verified, you can schedule a pickup.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {pickups.map((pickup) => (
              <Card key={pickup.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">Pickup #{pickup.id.slice(0, 8)}</CardTitle>
                      <CardDescription>
                        {pickup.medicines?.drug_name} • Qty: {pickup.medicines?.quantity}
                      </CardDescription>
                    </div>
                    {getStatusBadge(pickup.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                    <div>
                      <p className="text-sm">{pickup.pickup_address}</p>
                      <p className="text-sm text-muted-foreground">
                        {pickup.pickup_city}, {pickup.pickup_state} - {pickup.pickup_pincode}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm">{pickup.contact_name}</p>
                      <p className="text-sm text-muted-foreground">{pickup.contact_phone}</p>
                    </div>
                  </div>

                  {pickup.preferred_date && (
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm">
                        {format(new Date(pickup.preferred_date), 'PPP')}
                        {pickup.preferred_time_slot && ` • ${pickup.preferred_time_slot}`}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}