import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Camera, Upload, Sparkles, CheckCircle, AlertTriangle } from 'lucide-react';

interface ExtractedData {
  drug_name: string;
  generic_name: string;
  manufacturer: string;
  batch_number: string;
  expiry_date: string;
  mrp: string;
}

export default function DonateMedicine() {
  const { user, loading: authLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData>({
    drug_name: '',
    generic_name: '',
    manufacturer: '',
    batch_number: '',
    expiry_date: '',
    mrp: '',
  });
  const [quantity, setQuantity] = useState(1);
  const [isSealed, setIsSealed] = useState(true);
  const [isOriginalPackaging, setIsOriginalPackaging] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExtract = async () => {
    if (!imagePreview) return;

    setExtracting(true);

    try {
      const { data, error } = await supabase.functions.invoke('extract-medicine-data', {
        body: { image: imagePreview }
      });

      if (error) throw error;

      if (data) {
        setExtractedData({
          drug_name: data.drug_name || '',
          generic_name: data.generic_name || '',
          manufacturer: data.manufacturer || '',
          batch_number: data.batch_number || '',
          expiry_date: data.expiry_date || '',
          mrp: data.mrp || '',
        });
        setStep(2);
        toast({
          title: 'Data extracted!',
          description: 'Please review and confirm the details.',
        });
      }
    } catch (error: any) {
      console.error('OCR Error:', error);
      toast({
        variant: 'destructive',
        title: 'Extraction failed',
        description: 'Could not extract data. Please enter details manually.',
      });
      setStep(2);
    } finally {
      setExtracting(false);
    }
  };

  const handleSubmit = async () => {
    if (!extractedData.drug_name) {
      toast({
        variant: 'destructive',
        title: 'Missing information',
        description: 'Please enter at least the drug name.',
      });
      return;
    }

    setSubmitting(true);

    try {
      // Upload image first
      let imageUrl = '';
      if (imageFile) {
        const fileName = `${user!.id}/${Date.now()}-${imageFile.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('medicine-images')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('medicine-images')
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
      }

      // Create medicine record
      const { data: medicine, error: medicineError } = await supabase
        .from('medicines')
        .insert([{
          donor_id: user!.id,
          drug_name: extractedData.drug_name,
          generic_name: extractedData.generic_name || null,
          manufacturer: extractedData.manufacturer || null,
          batch_number: extractedData.batch_number || null,
          expiry_date: extractedData.expiry_date || null,
          mrp: extractedData.mrp ? parseFloat(extractedData.mrp) : null,
          quantity,
          is_sealed: isSealed,
          is_original_packaging: isOriginalPackaging,
          status: 'pending' as const,
          ocr_raw_data: JSON.parse(JSON.stringify(extractedData)),
        }])
        .select()
        .single();

      if (medicineError) throw medicineError;

      // Save image reference
      if (imageUrl && medicine) {
        await supabase.from('medicine_images').insert({
          medicine_id: medicine.id,
          image_url: imageUrl,
          is_primary: true,
        });
      }

      toast({
        title: 'Donation submitted!',
        description: 'Your medicine has been submitted for verification.',
      });

      navigate('/donor/donations');
    } catch (error: any) {
      console.error('Submit Error:', error);
      toast({
        variant: 'destructive',
        title: 'Submission failed',
        description: error.message || 'Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
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
      <div className="max-w-2xl mx-auto">
        <h1 className="font-display text-3xl font-bold mb-2">Donate Medicine</h1>
        <p className="text-muted-foreground mb-6">Upload a photo and we'll extract the details automatically</p>

        {/* Progress */}
        <div className="flex items-center gap-4 mb-8">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
              1
            </div>
            <span className="font-medium hidden sm:inline">Upload Photo</span>
          </div>
          <div className="flex-1 h-0.5 bg-muted">
            <div className={`h-full bg-primary transition-all ${step >= 2 ? 'w-full' : 'w-0'}`} />
          </div>
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
              2
            </div>
            <span className="font-medium hidden sm:inline">Confirm Details</span>
          </div>
        </div>

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Upload Medicine Photo</CardTitle>
              <CardDescription>
                Take a clear photo of the medicine packaging, showing the label with drug name, expiry date, and batch number.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileSelect}
              />

              {!imagePreview ? (
                <div
                  className="border-2 border-dashed border-border rounded-xl p-12 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="font-medium mb-2">Click to upload or take a photo</p>
                  <p className="text-sm text-muted-foreground">Supports JPG, PNG up to 10MB</p>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Medicine preview"
                    className="w-full rounded-xl object-cover max-h-80"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute bottom-4 right-4"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Change
                  </Button>
                </div>
              )}

              <Button
                className="w-full"
                size="lg"
                disabled={!imagePreview || extracting}
                onClick={handleExtract}
              >
                {extracting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Extracting data...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Extract Medicine Details
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Our AI will automatically extract medicine information from the image
              </p>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-success" />
                Confirm Medicine Details
              </CardTitle>
              <CardDescription>
                Review the extracted information and make any corrections needed.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="drug_name">Drug Name *</Label>
                <Input
                  id="drug_name"
                  value={extractedData.drug_name}
                  onChange={(e) => setExtractedData({ ...extractedData, drug_name: e.target.value })}
                  placeholder="Enter drug name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="generic_name">Generic Name</Label>
                <Input
                  id="generic_name"
                  value={extractedData.generic_name}
                  onChange={(e) => setExtractedData({ ...extractedData, generic_name: e.target.value })}
                  placeholder="Generic/salt name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="manufacturer">Manufacturer</Label>
                <Input
                  id="manufacturer"
                  value={extractedData.manufacturer}
                  onChange={(e) => setExtractedData({ ...extractedData, manufacturer: e.target.value })}
                  placeholder="Manufacturer name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="batch_number">Batch Number</Label>
                  <Input
                    id="batch_number"
                    value={extractedData.batch_number}
                    onChange={(e) => setExtractedData({ ...extractedData, batch_number: e.target.value })}
                    placeholder="Batch/Lot number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiry_date">Expiry Date</Label>
                  <Input
                    id="expiry_date"
                    type="date"
                    value={extractedData.expiry_date}
                    onChange={(e) => setExtractedData({ ...extractedData, expiry_date: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mrp">MRP (₹)</Label>
                  <Input
                    id="mrp"
                    type="number"
                    value={extractedData.mrp}
                    onChange={(e) => setExtractedData({ ...extractedData, mrp: e.target.value })}
                    placeholder="Maximum retail price"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  />
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="sealed"
                    checked={isSealed}
                    onCheckedChange={(checked) => setIsSealed(checked as boolean)}
                  />
                  <Label htmlFor="sealed" className="cursor-pointer">
                    Medicine is sealed and unopened
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="original"
                    checked={isOriginalPackaging}
                    onCheckedChange={(checked) => setIsOriginalPackaging(checked as boolean)}
                  />
                  <Label htmlFor="original" className="cursor-pointer">
                    Original manufacturer packaging
                  </Label>
                </div>
              </div>

              {(!isSealed || !isOriginalPackaging) && (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-warning/10 border border-warning/20">
                  <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-warning">Important</p>
                    <p className="text-muted-foreground">
                      Opened or repackaged medicines may not be eligible for donation and might be rejected during verification.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button onClick={handleSubmit} disabled={submitting} className="flex-1">
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Donation'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}