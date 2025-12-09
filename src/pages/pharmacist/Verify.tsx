import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft, CheckCircle, XCircle, AlertTriangle, Calendar, IndianRupee, Package } from 'lucide-react';
import { format } from 'date-fns';

export default function VerifyMedicine() {
  const { id } = useParams();
  const { user, roles, loading: authLoading } = useAuth();
  const [medicine, setMedicine] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [checklist, setChecklist] = useState({
    sealed: false,
    readable_label: false,
    valid_expiry: false,
    original_packaging: false,
    not_controlled: false,
  });
  const [notes, setNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
    if (!authLoading && user && !roles.includes('pharmacist')) {
      navigate('/donor');
    }
  }, [user, roles, authLoading, navigate]);

  useEffect(() => {
    if (user && roles.includes('pharmacist') && id) {
      fetchMedicine();
    }
  }, [user, roles, id]);

  const fetchMedicine = async () => {
    const { data, error } = await supabase
      .from('medicines')
      .select('*, medicine_images(*)')
      .eq('id', id)
      .single();

    if (!error && data) {
      setMedicine(data);
      setChecklist({
        sealed: data.is_sealed || false,
        readable_label: true,
        valid_expiry: data.expiry_date ? new Date(data.expiry_date) > new Date() : false,
        original_packaging: data.is_original_packaging || false,
        not_controlled: data.schedule === 'otc',
      });
    }
    setLoading(false);
  };

  const handleApprove = async () => {
    if (!Object.values(checklist).every(Boolean)) {
      toast({
        variant: 'destructive',
        title: 'Checklist incomplete',
        description: 'Please verify all items before approving.',
      });
      return;
    }

    setSubmitting(true);

    try {
      // Create verification record
      await supabase.from('verifications').insert({
        medicine_id: id,
        pharmacist_id: user!.id,
        status: 'approved',
        checklist,
        notes,
      });

      // Update medicine status
      await supabase
        .from('medicines')
        .update({ status: 'verified' })
        .eq('id', id);

      toast({
        title: 'Medicine verified!',
        description: 'The donation has been approved for redistribution.',
      });

      navigate('/pharmacist/queue');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason) {
      toast({
        variant: 'destructive',
        title: 'Reason required',
        description: 'Please provide a reason for rejection.',
      });
      return;
    }

    setSubmitting(true);

    try {
      // Create verification record
      await supabase.from('verifications').insert({
        medicine_id: id,
        pharmacist_id: user!.id,
        status: 'rejected',
        checklist,
        notes,
        rejection_reason: rejectionReason,
      });

      // Update medicine status
      await supabase
        .from('medicines')
        .update({ status: 'rejected', rejection_reason: rejectionReason })
        .eq('id', id);

      toast({
        title: 'Medicine rejected',
        description: 'The donor will be notified.',
      });

      navigate('/pharmacist/queue');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    } finally {
      setSubmitting(false);
    }
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

  if (!medicine) {
    return (
      <DashboardLayout role="pharmacist">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Medicine not found</p>
          <Button variant="ghost" onClick={() => navigate('/pharmacist/queue')} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Queue
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="pharmacist">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => navigate('/pharmacist/queue')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Queue
        </Button>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Medicine Details */}
          <Card>
            <CardHeader>
              <CardTitle>{medicine.drug_name}</CardTitle>
              {medicine.generic_name && (
                <CardDescription>{medicine.generic_name}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {medicine.medicine_images?.[0]?.image_url && (
                <img
                  src={medicine.medicine_images[0].image_url}
                  alt={medicine.drug_name}
                  className="w-full rounded-lg object-cover max-h-64"
                />
              )}

              <div className="grid grid-cols-2 gap-4">
                {medicine.manufacturer && (
                  <div>
                    <p className="text-sm text-muted-foreground">Manufacturer</p>
                    <p className="font-medium">{medicine.manufacturer}</p>
                  </div>
                )}
                {medicine.batch_number && (
                  <div>
                    <p className="text-sm text-muted-foreground">Batch Number</p>
                    <p className="font-medium">{medicine.batch_number}</p>
                  </div>
                )}
                {medicine.expiry_date && (
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Expiry Date
                    </p>
                    <p className="font-medium">{format(new Date(medicine.expiry_date), 'PPP')}</p>
                  </div>
                )}
                {medicine.mrp && (
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <IndianRupee className="h-3 w-3" /> MRP
                    </p>
                    <p className="font-medium">₹{medicine.mrp}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Package className="h-3 w-3" /> Quantity
                  </p>
                  <p className="font-medium">{medicine.quantity} {medicine.unit}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Schedule</p>
                  <Badge variant={medicine.schedule === 'otc' ? 'secondary' : 'destructive'}>
                    {medicine.schedule?.toUpperCase() || 'OTC'}
                  </Badge>
                </div>
              </div>

              <div className="flex gap-2">
                <Badge variant={medicine.is_sealed ? 'default' : 'destructive'}>
                  {medicine.is_sealed ? 'Sealed' : 'Opened'}
                </Badge>
                <Badge variant={medicine.is_original_packaging ? 'default' : 'destructive'}>
                  {medicine.is_original_packaging ? 'Original Packaging' : 'Repackaged'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Verification Form */}
          <Card>
            <CardHeader>
              <CardTitle>Verification Checklist</CardTitle>
              <CardDescription>Complete all checks before approving</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="sealed"
                    checked={checklist.sealed}
                    onCheckedChange={(c) => setChecklist({ ...checklist, sealed: c as boolean })}
                  />
                  <Label htmlFor="sealed" className="cursor-pointer">Medicine is sealed and unopened</Label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="readable_label"
                    checked={checklist.readable_label}
                    onCheckedChange={(c) => setChecklist({ ...checklist, readable_label: c as boolean })}
                  />
                  <Label htmlFor="readable_label" className="cursor-pointer">Label is clearly readable</Label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="valid_expiry"
                    checked={checklist.valid_expiry}
                    onCheckedChange={(c) => setChecklist({ ...checklist, valid_expiry: c as boolean })}
                  />
                  <Label htmlFor="valid_expiry" className="cursor-pointer">Expiry date is valid (3+ months)</Label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="original_packaging"
                    checked={checklist.original_packaging}
                    onCheckedChange={(c) => setChecklist({ ...checklist, original_packaging: c as boolean })}
                  />
                  <Label htmlFor="original_packaging" className="cursor-pointer">Original manufacturer packaging</Label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="not_controlled"
                    checked={checklist.not_controlled}
                    onCheckedChange={(c) => setChecklist({ ...checklist, not_controlled: c as boolean })}
                  />
                  <Label htmlFor="not_controlled" className="cursor-pointer">Not a controlled substance</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional observations..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rejection_reason">Rejection Reason (if rejecting)</Label>
                <Textarea
                  id="rejection_reason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Explain why this medicine cannot be accepted..."
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={handleReject}
                  disabled={submitting}
                >
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
                  Reject
                </Button>
                <Button
                  className="flex-1 bg-success hover:bg-success/90"
                  onClick={handleApprove}
                  disabled={submitting}
                >
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                  Approve
                </Button>
              </div>

              {medicine.schedule !== 'otc' && (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-warning/10 border border-warning/20">
                  <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-warning">Prescription Medicine</p>
                    <p className="text-muted-foreground">
                      This appears to be a prescription medicine. It should be rejected or flagged for proper disposal.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}