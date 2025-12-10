import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Building2 } from 'lucide-react';
import { z } from 'zod';

const registerSchema = z.object({
  organization_name: z.string().min(2, 'Organization name must be at least 2 characters').max(200),
  organization_type: z.enum(['pharmacy', 'ngo', 'clinic', 'hospital', 'take_back_center']),
  contact_person: z.string().min(2, 'Contact person name is required').max(100),
  contact_phone: z.string().min(10, 'Valid phone number is required').max(15),
  contact_email: z.string().email('Valid email is required').max(255),
  license_number: z.string().optional(),
  address: z.string().min(5, 'Address is required').max(500),
  city: z.string().min(2, 'City is required').max(100),
  state: z.string().min(2, 'State is required').max(100),
  pincode: z.string().min(6, 'Valid pincode is required').max(10),
});

const organizationTypes = [
  { value: 'pharmacy', label: 'Pharmacy' },
  { value: 'ngo', label: 'NGO / Non-Profit' },
  { value: 'clinic', label: 'Clinic' },
  { value: 'hospital', label: 'Hospital' },
  { value: 'take_back_center', label: 'Take-Back Center' },
];

export default function RecipientRegister() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    organization_name: '',
    organization_type: '' as 'pharmacy' | 'ngo' | 'clinic' | 'hospital' | 'take_back_center' | '',
    contact_person: '',
    contact_phone: '',
    contact_email: user?.email || '',
    license_number: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Validate form
    const result = registerSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }

    try {
      // Insert recipient record
      const { error: insertError } = await supabase.from('recipients').insert({
        user_id: user!.id,
        organization_name: formData.organization_name,
        organization_type: formData.organization_type as 'pharmacy' | 'ngo' | 'clinic' | 'hospital' | 'take_back_center',
        contact_person: formData.contact_person,
        contact_phone: formData.contact_phone,
        contact_email: formData.contact_email,
        license_number: formData.license_number || null,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      });

      if (insertError) throw insertError;

      toast({
        title: 'Registration Submitted',
        description: 'Your organization registration is pending approval. We will notify you once verified.',
      });

      navigate('/recipient');
    } catch (error: any) {
      toast({
        title: 'Registration Failed',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role="donor">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
              <Building2 className="h-8 w-8 text-primary-foreground" />
            </div>
            <CardTitle className="font-display text-2xl">Register as Recipient</CardTitle>
            <CardDescription>
              Register your organization to claim and purchase donated medicines
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Organization Details */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Organization Details</h3>
                
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="organization_name">Organization Name *</Label>
                    <Input
                      id="organization_name"
                      value={formData.organization_name}
                      onChange={e => handleChange('organization_name', e.target.value)}
                      placeholder="Enter organization name"
                      className={errors.organization_name ? 'border-destructive' : ''}
                    />
                    {errors.organization_name && (
                      <p className="text-sm text-destructive">{errors.organization_name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organization_type">Organization Type *</Label>
                    <Select
                      value={formData.organization_type}
                      onValueChange={value => handleChange('organization_type', value)}
                    >
                      <SelectTrigger className={errors.organization_type ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Select organization type" />
                      </SelectTrigger>
                      <SelectContent>
                        {organizationTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.organization_type && (
                      <p className="text-sm text-destructive">{errors.organization_type}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="license_number">License Number (if applicable)</Label>
                    <Input
                      id="license_number"
                      value={formData.license_number}
                      onChange={e => handleChange('license_number', e.target.value)}
                      placeholder="Enter license/registration number"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Contact Details</h3>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="contact_person">Contact Person *</Label>
                    <Input
                      id="contact_person"
                      value={formData.contact_person}
                      onChange={e => handleChange('contact_person', e.target.value)}
                      placeholder="Full name"
                      className={errors.contact_person ? 'border-destructive' : ''}
                    />
                    {errors.contact_person && (
                      <p className="text-sm text-destructive">{errors.contact_person}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact_phone">Contact Phone *</Label>
                    <Input
                      id="contact_phone"
                      value={formData.contact_phone}
                      onChange={e => handleChange('contact_phone', e.target.value)}
                      placeholder="Phone number"
                      className={errors.contact_phone ? 'border-destructive' : ''}
                    />
                    {errors.contact_phone && (
                      <p className="text-sm text-destructive">{errors.contact_phone}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_email">Contact Email *</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={formData.contact_email}
                    onChange={e => handleChange('contact_email', e.target.value)}
                    placeholder="Email address"
                    className={errors.contact_email ? 'border-destructive' : ''}
                  />
                  {errors.contact_email && (
                    <p className="text-sm text-destructive">{errors.contact_email}</p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Address</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address *</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={e => handleChange('address', e.target.value)}
                    placeholder="Enter full address"
                    className={errors.address ? 'border-destructive' : ''}
                  />
                  {errors.address && (
                    <p className="text-sm text-destructive">{errors.address}</p>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={e => handleChange('city', e.target.value)}
                      placeholder="City"
                      className={errors.city ? 'border-destructive' : ''}
                    />
                    {errors.city && (
                      <p className="text-sm text-destructive">{errors.city}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={e => handleChange('state', e.target.value)}
                      placeholder="State"
                      className={errors.state ? 'border-destructive' : ''}
                    />
                    {errors.state && (
                      <p className="text-sm text-destructive">{errors.state}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      value={formData.pincode}
                      onChange={e => handleChange('pincode', e.target.value)}
                      placeholder="Pincode"
                      className={errors.pincode ? 'border-destructive' : ''}
                    />
                    {errors.pincode && (
                      <p className="text-sm text-destructive">{errors.pincode}</p>
                    )}
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Registration'
                )}
              </Button>

              <p className="text-sm text-muted-foreground text-center">
                Your registration will be reviewed by our team. You'll be notified once approved.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
