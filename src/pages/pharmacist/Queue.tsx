import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Package, Calendar, ArrowRight, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function VerificationQueue() {
  const { user, roles, loading: authLoading } = useAuth();
  const [medicines, setMedicines] = useState<any[]>([]);
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
      fetchPendingMedicines();
    }
  }, [user, roles]);

  const fetchPendingMedicines = async () => {
    const { data, error } = await supabase
      .from('medicines')
      .select('*, medicine_images(*)')
      .eq('status', 'pending')
      .order('created_at', { ascending: true });

    if (!error && data) {
      setMedicines(data);
    }
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
          <h1 className="font-display text-3xl font-bold">Verification Queue</h1>
          <p className="text-muted-foreground">{medicines.length} medicines pending review</p>
        </div>

        {medicines.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-success opacity-50" />
              <p className="text-lg font-medium">All caught up!</p>
              <p className="text-muted-foreground">No pending verifications at the moment.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {medicines.map((medicine) => (
              <Card key={medicine.id} className="overflow-hidden hover:shadow-card transition-shadow">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    {medicine.medicine_images?.[0]?.image_url && (
                      <div className="md:w-48 h-32 md:h-auto flex-shrink-0">
                        <img
                          src={medicine.medicine_images[0].image_url}
                          alt={medicine.drug_name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Details */}
                    <div className="flex-1 p-4">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                        <div>
                          <h3 className="font-display font-semibold text-lg">{medicine.drug_name}</h3>
                          {medicine.generic_name && (
                            <p className="text-sm text-muted-foreground">{medicine.generic_name}</p>
                          )}
                          <div className="flex flex-wrap gap-2 mt-2">
                            {medicine.manufacturer && (
                              <Badge variant="outline">{medicine.manufacturer}</Badge>
                            )}
                            <Badge variant="secondary">Qty: {medicine.quantity}</Badge>
                            {medicine.expiry_date && (
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Exp: {format(new Date(medicine.expiry_date), 'MMM yyyy')}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button asChild>
                          <Link to={`/pharmacist/verify/${medicine.id}`}>
                            Review
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          {medicine.is_sealed ? (
                            <CheckCircle className="h-3 w-3 text-success" />
                          ) : (
                            <Package className="h-3 w-3 text-warning" />
                          )}
                          {medicine.is_sealed ? 'Sealed' : 'Opened'}
                        </span>
                        <span>•</span>
                        <span>Submitted {format(new Date(medicine.created_at), 'PP')}</span>
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