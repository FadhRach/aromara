"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import Swal from "sweetalert2";

interface Supplier {
  id: string;
  name: string;
  city: string;
  province: string;
}

export default function ContactSupplierPage() {
  const params = useParams();
  const router = useRouter();
  const supplierId = params?.id as string;

  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    service_type: "",
    country: "Indonesia",
    city: "",
    estimated_delivery_time: "",
    total_quantity: "",
    required_certifications: [] as string[],
    packaging_preference: "",
    additional_details: "",
  });

  useEffect(() => {
    if (supplierId) {
      fetchSupplier();
    }
  }, [supplierId]);

  const fetchSupplier = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('company')
        .select('id, name, city, province')
        .eq('id', supplierId)
        .single();

      if (error) throw error;
      setSupplier(data);
    } catch (error) {
      console.error('Error fetching supplier:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (value: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        required_certifications: [...formData.required_certifications, value],
      });
    } else {
      setFormData({
        ...formData,
        required_certifications: formData.required_certifications.filter(
          (cert) => cert !== value
        ),
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);

      // Get user from localStorage (if logged in)
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;

      const inquiryData = {
        supplier_id: supplierId,
        buyer_id: user?.id || null,
        contact_name: user?.name || '',
        contact_email: user?.email || '',
        service_type: formData.service_type,
        country: formData.country,
        city: formData.city,
        estimated_delivery_time: formData.estimated_delivery_time,
        total_quantity: formData.total_quantity,
        required_certifications: formData.required_certifications,
        packaging_preference: formData.packaging_preference as any,
        additional_details: formData.additional_details,
        subject: `Inquiry for ${formData.service_type}`,
        message: formData.additional_details,
        status: 'pending',
      };

      const { error } = await supabase
        .from('inquiry')
        .insert([inquiryData]);

      if (error) throw error;

      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Your inquiry has been submitted successfully',
        confirmButtonColor: '#252F24',
      });

      router.push(`/supplier/${supplierId}`);

    } catch (error) {
      console.error('Error submitting inquiry:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to submit inquiry. Please try again.',
        confirmButtonColor: '#252F24',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAEE] pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <p className="text-center text-[#252F24]/70">Loading...</p>
        </div>
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="min-h-screen bg-[#FAFAEE] pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <p className="text-center text-[#252F24]/70">Supplier not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAEE] pt-32 pb-16">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#252F24] mb-2">
            Hubungi Suplier
          </h1>
          <p className="text-[#252F24]/70">
            To: <span className="font-medium">{supplier.name}</span> • {supplier.city}, {supplier.province}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="bg-[#E8F5E9] border-none">
            <CardContent className="p-6 md:p-8">
              {/* Service Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#252F24] mb-2">
                  Layanan yang dibutuhkan
                </label>
                <Input
                  placeholder="Pilih sebutkan anda dalam segi"
                  value={formData.service_type}
                  onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                  className="bg-white border-[#252F24]/20"
                  required
                />
              </div>

              {/* Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-[#252F24] mb-2">
                    Pilih Negara
                  </label>
                  <Input
                    placeholder="Pilih Daerah Kota"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="bg-white border-[#252F24]/20"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#252F24] mb-2">
                    Pilih Kota
                  </label>
                  <Input
                    placeholder="Pilih Daerah Kota"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="bg-white border-[#252F24]/20"
                    required
                  />
                </div>
              </div>

              {/* Estimated Delivery Time */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#252F24] mb-2">
                  Estimasi waktu pengiriman
                </label>
                <select
                  value={formData.estimated_delivery_time}
                  onChange={(e) => setFormData({ ...formData, estimated_delivery_time: e.target.value })}
                  className="w-full bg-white border border-[#252F24]/20 rounded-md px-3 py-2"
                  required
                >
                  <option value="">Pilih sebutkan anda dalam segi</option>
                  <option value="Kurang dari 24 Jam">Kurang dari 24 Jam</option>
                  <option value="1-3 Hari">1-3 Hari</option>
                  <option value="3-7 Hari">3-7 Hari</option>
                  <option value="Lebih dari 7 Hari">Lebih dari 7 Hari</option>
                </select>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#252F24] mb-2">
                  Jumlah yang dibutuhkan
                </label>
                <Input
                  placeholder="Contoh: 200 kg, 500 pcs, 10 liter"
                  value={formData.total_quantity}
                  onChange={(e) => setFormData({ ...formData, total_quantity: e.target.value })}
                  className="bg-white border-[#252F24]/20"
                  required
                />
              </div>

              {/* Certifications */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#252F24] mb-2">
                  Sertifikasi yang dibutuhkan
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value="halal"
                      onChange={(e) => handleCheckboxChange('halal', e.target.checked)}
                      className="rounded text-[#252F24]"
                    />
                    <span className="text-sm">Halal</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value="coa"
                      onChange={(e) => handleCheckboxChange('coa', e.target.checked)}
                      className="rounded text-[#252F24]"
                    />
                    <span className="text-sm">COA</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value="msds"
                      onChange={(e) => handleCheckboxChange('msds', e.target.checked)}
                      className="rounded text-[#252F24]"
                    />
                    <span className="text-sm">MSDS</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value="organic"
                      onChange={(e) => handleCheckboxChange('organic', e.target.checked)}
                      className="rounded text-[#252F24]"
                    />
                    <span className="text-sm">Organik</span>
                  </label>
                </div>
              </div>

              {/* Packaging Preference */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#252F24] mb-2">
                  Preferensi Kemasan
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="packaging"
                      value="drum_aluminium"
                      onChange={(e) => setFormData({ ...formData, packaging_preference: e.target.value })}
                      className="text-[#252F24]"
                    />
                    <span className="text-sm">Drum Aluminium</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="packaging"
                      value="karung_jute_bag"
                      onChange={(e) => setFormData({ ...formData, packaging_preference: e.target.value })}
                      className="text-[#252F24]"
                    />
                    <span className="text-sm">Karung/Jute bag</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="packaging"
                      value="vacuum_sealed_bag"
                      onChange={(e) => setFormData({ ...formData, packaging_preference: e.target.value })}
                      className="text-[#252F24]"
                    />
                    <span className="text-sm">Vacum sealed bag</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="packaging"
                      value="no_preference"
                      onChange={(e) => setFormData({ ...formData, packaging_preference: e.target.value })}
                      className="text-[#252F24]"
                    />
                    <span className="text-sm">Tanpa preferensi</span>
                  </label>
                </div>
              </div>

              {/* Additional Details */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#252F24] mb-2">
                  Detail Permintaan
                </label>
                <textarea
                  placeholder="Silakan deskripsikan permintaan, kualitas yang diinginkan, kendusisi khusus, format pengiriman, informasi releven lainnya yang dapat membantu perusahaan kami melayani permintaan anda dengan sepat dan akurat."
                  value={formData.additional_details}
                  onChange={(e) => setFormData({ ...formData, additional_details: e.target.value })}
                  className="w-full bg-white border border-[#252F24]/20 rounded-md px-3 py-2 min-h-[120px]"
                  required
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#252F24] hover:bg-[#252F24]/90 text-white"
                size="lg"
              >
                {submitting ? 'Sending...' : 'Kirim Permintaan'}
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>

      {/* Right sidebar - How we work (optional) */}
      <div className="fixed right-0 top-32 w-80 bg-[#252F24] text-white p-6 hidden xl:block">
        <h3 className="font-semibold mb-4">Bagaimana cara kami bekerja?</h3>
        <p className="text-sm text-white/80">
          Content about how the system works...
        </p>
      </div>
    </div>
  );
}
