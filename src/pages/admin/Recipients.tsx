import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Building2, CheckCircle, XCircle, MapPin, Phone, Mail, FileText } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminRecipients() {
  const { user, roles, loading: authLoading } = useAuth();
  const [recipients, setRecipients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

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
      fetchRecipients();
    }
  }, [user, roles]);

  const fetchRecipients = async () => {
    const { data, error } = await supabase
      .from('recipients')
      .select('*, profiles(email, full_name)')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setRecipients(data);
    }
    setLoading(false);
  };

  const handleVerify = async (id: string, approved: boolean) => {
    setProcessing(id);

    try {
      const { error } = await supabase
        .from('recipients')
        .update({
          is_verified: approved,
          verified_at: approved ? new Date().toISOString() : null,
          verified_by: user!.id,
          rejection_reason: approved ? null : 'Did not meet verification requirements',
        })
        .eq('id', id);

      if (error) throw error;

      // Also add recipient role
      if (approved) {
        const recipient = recipients.find(r => r.id === id);
        if (recipient) {
          await supabase.from('user_roles').upsert({
            user_id: recipient.user_id,
            role: 'recipient',
            is_active: true,
            approved_at: new Date().toISOString(),
            approved_by: user!.id,
          });
        }
      }

      toast({
        title: approved ? 'Recipient verified' : 'Recipient rejected',
        description: approved 
          ? 'The organization can now claim medicines.' 
          : 'The organization has been notified.',
      });

      fetchRecipients();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    } finally {
      setProcessing(null);
    }
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

  const pending = recipients.filter(r => !r.is_verified && !r.rejection_reason);
  const verified = recipients.filter(r => r.is_verified);
  const rejected = recipients.filter(r => !r.is_verified && r.rejection_reason);

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold">Recipient Organizations</h1>
          <p className="text-muted-foreground">
            {pending.length} pending verification • {verified.length} verified • {rejected.length} rejected
          </p>
        </div>

        {pending.length > 0 && (
          <div className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-warning">Pending Verification</h2>
            {pending.map((recipient) => (
              <Card key={recipient.id} className="border-warning/30">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        {recipient.organization_name}
                      </CardTitle>
                      <CardDescription className="capitalize">
                        {recipient.organization_type}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">Pending</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p>{recipient.address}</p>
                        <p className="text-muted-foreground">
                          {recipient.city}, {recipient.state} - {recipient.pincode}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        {recipient.contact_phone}
                      </p>
                      <p className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {recipient.contact_email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      License: {recipient.license_number || 'Not provided'}
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">
                      Applied {format(new Date(recipient.created_at), 'PP')}
                    </span>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      variant="destructive"
                      onClick={() => handleVerify(recipient.id, false)}
                      disabled={processing === recipient.id}
                    >
                      {processing === recipient.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject
                        </>
                      )}
                    </Button>
                    <Button
                      className="bg-success hover:bg-success/90"
                      onClick={() => handleVerify(recipient.id, true)}
                      disabled={processing === recipient.id}
                    >
                      {processing === recipient.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Verify
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {verified.length > 0 && (
          <div className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-success">Verified Organizations</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {verified.map((recipient) => (
                <Card key={recipient.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{recipient.organization_name}</CardTitle>
                      <Badge className="bg-success text-success-foreground">Verified</Badge>
                    </div>
                    <CardDescription className="capitalize">{recipient.organization_type}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p>{recipient.city}, {recipient.state}</p>
                    <p className="text-muted-foreground mt-1">
                      Verified {format(new Date(recipient.verified_at), 'PP')}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {recipients.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No recipient organizations registered yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}