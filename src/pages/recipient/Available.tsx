import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Package, Calendar, IndianRupee, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function AvailableMedicines() {
  const { user, roles, loading: authLoading } = useAuth();
  const [medicines, setMedicines] = useState<any[]>([]);
  const [recipient, setRecipient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

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
    // Fetch recipient
    const { data: recipientData } = await supabase
      .from('recipients')
      .select('*')
      .eq('user_id', user!.id)
      .single();

    setRecipient(recipientData);

    // Fetch available medicines
    const { data, error } = await supabase
      .from('medicines')
      .select('*, medicine_images(*)')
      .eq('status', 'verified')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setMedicines(data);
    }
    setLoading(false);
  };

  const handleClaim = async (medicineId: string, quantity: number) => {
    if (!recipient?.is_verified) {
      toast({
        variant: 'destructive',
        title: 'Not verified',
        description: 'Your organization must be verified to claim medicines.',
      });
      return;
    }

    setClaiming(medicineId);

    try {
      const { error } = await supabase.from('claims').insert({
        medicine_id: medicineId,
        recipient_id: recipient.id,
        quantity_claimed: quantity,
        status: 'pending',
      });

      if (error) throw error;

      // Update medicine status
      await supabase
        .from('medicines')
        .update({ status: 'claimed' })
        .eq('id', medicineId);

      toast({
        title: 'Medicine claimed!',
        description: 'Your claim has been submitted successfully.',
      });

      // Refresh list
      fetchData();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    } finally {
      setClaiming(null);
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
          <h1 className="font-display text-3xl font-bold">Available Medicines</h1>
          <p className="text-muted-foreground">{medicines.length} verified medicines available for claim</p>
        </div>

        {medicines.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-lg font-medium">No medicines available</p>
              <p className="text-muted-foreground">Check back later for new donations.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {medicines.map((medicine) => (
              <Card key={medicine.id} className="overflow-hidden">
                {medicine.medicine_images?.[0]?.image_url && (
                  <div className="h-40">
                    <img
                      src={medicine.medicine_images[0].image_url}
                      alt={medicine.drug_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardContent className="pt-4">
                  <h3 className="font-display font-semibold text-lg mb-1">{medicine.drug_name}</h3>
                  {medicine.generic_name && (
                    <p className="text-sm text-muted-foreground mb-3">{medicine.generic_name}</p>
                  )}

                  <div className="space-y-2 mb-4">
                    {medicine.manufacturer && (
                      <Badge variant="outline">{medicine.manufacturer}</Badge>
                    )}
                    <div className="flex gap-3 text-sm">
                      <span className="flex items-center gap-1">
                        <Package className="h-3 w-3" />
                        Qty: {medicine.quantity}
                      </span>
                      {medicine.expiry_date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(medicine.expiry_date), 'MMM yyyy')}
                        </span>
                      )}
                    </div>
                    {medicine.mrp && (
                      <p className="flex items-center gap-1 text-sm">
                        <IndianRupee className="h-3 w-3" />
                        MRP: ₹{medicine.mrp}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge className="bg-success text-success-foreground">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  </div>

                  <Button
                    className="w-full mt-4"
                    onClick={() => handleClaim(medicine.id, medicine.quantity)}
                    disabled={claiming === medicine.id || !recipient?.is_verified}
                  >
                    {claiming === medicine.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Claim Medicine'
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}