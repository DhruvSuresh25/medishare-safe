import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Package, Clock, CheckCircle, XCircle, Truck, Calendar, IndianRupee } from 'lucide-react';
import { format } from 'date-fns';

export default function MyDonations() {
  const { user, loading: authLoading } = useAuth();
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchDonations();
    }
  }, [user]);

  const fetchDonations = async () => {
    const { data, error } = await supabase
      .from('medicines')
      .select('*, medicine_images(*)')
      .eq('donor_id', user!.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setDonations(data);
    }
    setLoading(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending Review</Badge>;
      case 'verified':
        return <Badge className="bg-success text-success-foreground"><CheckCircle className="h-3 w-3 mr-1" />Verified</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      case 'claimed':
        return <Badge className="bg-primary"><Package className="h-3 w-3 mr-1" />Claimed</Badge>;
      case 'picked_up':
        return <Badge className="bg-accent text-accent-foreground"><Truck className="h-3 w-3 mr-1" />Picked Up</Badge>;
      case 'delivered':
        return <Badge className="bg-success text-success-foreground"><CheckCircle className="h-3 w-3 mr-1" />Delivered</Badge>;
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
          <h1 className="font-display text-3xl font-bold">My Donations</h1>
          <p className="text-muted-foreground">Track all your medicine donations</p>
        </div>

        {donations.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No donations yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {donations.map((donation) => (
              <Card key={donation.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    {donation.medicine_images?.[0]?.image_url && (
                      <div className="md:w-48 h-32 md:h-auto flex-shrink-0">
                        <img
                          src={donation.medicine_images[0].image_url}
                          alt={donation.drug_name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Details */}
                    <div className="flex-1 p-4">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
                        <div>
                          <h3 className="font-display font-semibold text-lg">{donation.drug_name}</h3>
                          {donation.generic_name && (
                            <p className="text-sm text-muted-foreground">{donation.generic_name}</p>
                          )}
                        </div>
                        {getStatusBadge(donation.status)}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        {donation.manufacturer && (
                          <div>
                            <p className="text-muted-foreground">Manufacturer</p>
                            <p className="font-medium">{donation.manufacturer}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-muted-foreground">Quantity</p>
                          <p className="font-medium">{donation.quantity} {donation.unit}</p>
                        </div>
                        {donation.expiry_date && (
                          <div>
                            <p className="text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" /> Expiry
                            </p>
                            <p className="font-medium">{format(new Date(donation.expiry_date), 'MMM yyyy')}</p>
                          </div>
                        )}
                        {donation.mrp && (
                          <div>
                            <p className="text-muted-foreground flex items-center gap-1">
                              <IndianRupee className="h-3 w-3" /> MRP
                            </p>
                            <p className="font-medium">₹{donation.mrp}</p>
                          </div>
                        )}
                      </div>

                      {donation.rejection_reason && (
                        <div className="mt-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                          <p className="text-sm text-destructive font-medium">Rejection Reason:</p>
                          <p className="text-sm text-muted-foreground">{donation.rejection_reason}</p>
                        </div>
                      )}

                      <p className="text-xs text-muted-foreground mt-3">
                        Submitted on {format(new Date(donation.created_at), 'PPP')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}