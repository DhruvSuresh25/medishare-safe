import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, FileText, Clock, CheckCircle, Truck } from 'lucide-react';
import { format } from 'date-fns';

export default function MyClaims() {
  const { user, roles, loading: authLoading } = useAuth();
  const [claims, setClaims] = useState<any[]>([]);
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
      fetchClaims();
    }
  }, [user, roles]);

  const fetchClaims = async () => {
    // First get recipient
    const { data: recipient } = await supabase
      .from('recipients')
      .select('id')
      .eq('user_id', user!.id)
      .single();

    if (recipient) {
      const { data, error } = await supabase
        .from('claims')
        .select('*, medicines(drug_name, generic_name, manufacturer, quantity, medicine_images(image_url))')
        .eq('recipient_id', recipient.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setClaims(data);
      }
    }
    setLoading(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge className="bg-success text-success-foreground"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'in_transit':
        return <Badge className="bg-accent text-accent-foreground"><Truck className="h-3 w-3 mr-1" />In Transit</Badge>;
      case 'delivered':
        return <Badge className="bg-success text-success-foreground"><CheckCircle className="h-3 w-3 mr-1" />Delivered</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
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

  return (
    <DashboardLayout role="recipient">
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold">My Claims</h1>
          <p className="text-muted-foreground">Track your claimed medicines</p>
        </div>

        {claims.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-lg font-medium">No claims yet</p>
              <p className="text-muted-foreground">Browse available medicines to make your first claim.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {claims.map((claim) => (
              <Card key={claim.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    {claim.medicines?.medicine_images?.[0]?.image_url && (
                      <div className="w-full md:w-24 h-24 flex-shrink-0">
                        <img
                          src={claim.medicines.medicine_images[0].image_url}
                          alt={claim.medicines.drug_name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="font-semibold">{claim.medicines?.drug_name}</h3>
                          {claim.medicines?.generic_name && (
                            <p className="text-sm text-muted-foreground">{claim.medicines.generic_name}</p>
                          )}
                        </div>
                        {getStatusBadge(claim.status)}
                      </div>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>Qty: {claim.quantity_claimed}</span>
                        <span>•</span>
                        <span>Claimed {format(new Date(claim.created_at), 'PP')}</span>
                      </div>
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