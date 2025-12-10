import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Search, Package, Calendar, IndianRupee, ShoppingCart } from 'lucide-react';
import { format } from 'date-fns';

// Import medicine images
import paracetamolImg from '@/assets/medicines/paracetamol.jpg';
import amoxicillinImg from '@/assets/medicines/amoxicillin.jpg';
import cetirizineImg from '@/assets/medicines/cetirizine.jpg';
import omeprazoleImg from '@/assets/medicines/omeprazole.jpg';
import metforminImg from '@/assets/medicines/metformin.jpg';
import azithromycinImg from '@/assets/medicines/azithromycin.jpg';
import vitaminD3Img from '@/assets/medicines/vitamin-d3.jpg';
import pantoprazoleImg from '@/assets/medicines/pantoprazole.jpg';

// Map drug names to images
const medicineImages: Record<string, string> = {
  'paracetamol': paracetamolImg,
  'amoxicillin': amoxicillinImg,
  'cetirizine': cetirizineImg,
  'omeprazole': omeprazoleImg,
  'metformin': metforminImg,
  'azithromycin': azithromycinImg,
  'vitamin d3': vitaminD3Img,
  'pantoprazole': pantoprazoleImg,
};

const getMedicineImage = (drugName: string, uploadedImage?: string) => {
  if (uploadedImage) return uploadedImage;
  const key = Object.keys(medicineImages).find(k => 
    drugName.toLowerCase().includes(k)
  );
  return key ? medicineImages[key] : null;
};

export default function SearchMedicines() {
  const { user, loading: authLoading } = useAuth();
  const [medicines, setMedicines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [claiming, setClaiming] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchMedicines();
    }
  }, [user]);

  const fetchMedicines = async () => {
    const { data, error } = await supabase
      .from('medicines')
      .select('*, medicine_images(*)')
      .eq('status', 'verified')
      .order('created_at', { ascending: false });

    if (!error && data) {
      // Filter out medicines donated by current user
      const filtered = data.filter(m => m.donor_id !== user!.id);
      setMedicines(filtered);
    }
    setLoading(false);
  };

  const filteredMedicines = medicines.filter(medicine => {
    const query = searchQuery.toLowerCase();
    return (
      medicine.drug_name?.toLowerCase().includes(query) ||
      medicine.generic_name?.toLowerCase().includes(query) ||
      medicine.manufacturer?.toLowerCase().includes(query)
    );
  });

  const handleBuy = async (medicineId: string) => {
    setClaiming(medicineId);
    try {
      // Check if user has a recipient profile
      const { data: recipientData } = await supabase
        .from('recipients')
        .select('id, is_verified')
        .eq('user_id', user!.id)
        .maybeSingle();

      if (!recipientData) {
        toast({
          variant: 'destructive',
          title: 'Not registered as recipient',
          description: 'You need to register as a recipient organization to buy medicines.',
        });
        setClaiming(null);
        return;
      }

      if (!recipientData.is_verified) {
        toast({
          variant: 'destructive',
          title: 'Not verified',
          description: 'Your recipient organization needs to be verified to buy medicines.',
        });
        setClaiming(null);
        return;
      }

      // Create claim
      const { error: claimError } = await supabase
        .from('claims')
        .insert({
          medicine_id: medicineId,
          recipient_id: recipientData.id,
          quantity_claimed: 1,
          status: 'pending',
        });

      if (claimError) throw claimError;

      // Update medicine status
      await supabase
        .from('medicines')
        .update({ status: 'claimed' })
        .eq('id', medicineId);

      toast({
        title: 'Purchase request submitted!',
        description: 'The donor will be notified about your purchase request.',
      });

      fetchMedicines();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Purchase failed',
        description: error.message || 'Please try again.',
      });
    } finally {
      setClaiming(null);
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
          <h1 className="font-display text-3xl font-bold">Search Medicines</h1>
          <p className="text-muted-foreground">Find and buy medicines donated by others</p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search by drug name, generic name, or manufacturer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {filteredMedicines.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">
                {searchQuery ? 'No medicines found matching your search' : 'No medicines available for purchase'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredMedicines.map((medicine) => {
              const imageUrl = getMedicineImage(
                medicine.drug_name, 
                medicine.medicine_images?.[0]?.image_url
              );
              return (
              <Card key={medicine.id} className="overflow-hidden">
                {imageUrl && (
                  <div className="h-40 bg-muted">
                    <img
                      src={imageUrl}
                      alt={medicine.drug_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{medicine.drug_name}</h3>
                      {medicine.generic_name && (
                        <p className="text-sm text-muted-foreground">{medicine.generic_name}</p>
                      )}
                    </div>
                    <Badge className="bg-success text-success-foreground">Verified</Badge>
                  </div>

                  <div className="space-y-2 text-sm mb-4">
                    {medicine.manufacturer && (
                      <p className="text-muted-foreground">{medicine.manufacturer}</p>
                    )}
                    <div className="flex items-center gap-4">
                      {medicine.expiry_date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(medicine.expiry_date), 'MMM yyyy')}
                        </span>
                      )}
                      <span>Qty: {medicine.quantity}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-lg font-bold text-primary">
                        <IndianRupee className="h-4 w-4" />
                        {medicine.selling_price || medicine.mrp || 'Free'}
                      </span>
                      {medicine.mrp && medicine.selling_price && medicine.selling_price < medicine.mrp && (
                        <span className="text-muted-foreground line-through text-sm">
                          ₹{medicine.mrp}
                        </span>
                      )}
                    </div>
                  </div>

                  <Button 
                    className="w-full" 
                    onClick={() => handleBuy(medicine.id)}
                    disabled={claiming === medicine.id}
                  >
                    {claiming === medicine.id ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Buy Now
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
