"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import MoraAIBanner from "@/components/shared/MoraAIBanner";
import { showAlert } from "@/lib/sweetalert";
import { supabase } from "@/lib/supabase";

interface FormData {
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  country: string;
  city: string;
  product_or_service: string;
  estimated_delivery_time: string;
  total_quantity: string;
  supplier_types: string[];
  required_certifications: string[];
  packaging_preference: string;
  message: string;
  attachment_file?: File | null;
}

export default function RequestQuotePage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  const [formData, setFormData] = useState<FormData>({
    contact_name: "",
    contact_email: "",
    contact_phone: "",
    country: "Indonesia",
    city: "",
    product_or_service: "",
    estimated_delivery_time: "",
    total_quantity: "",
    supplier_types: [],
    required_certifications: [],
    packaging_preference: "",
    message: "",
    attachment_file: null,
  });

  useEffect(() => {
    // Get logged in user
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setFormData(prev => ({
        ...prev,
        contact_name: parsedUser.name || "",
        contact_email: parsedUser.email || "",
        contact_phone: parsedUser.phone || "",
      }));
    }
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (field: 'supplier_types' | 'required_certifications', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file size (max 25MB)
      if (file.size > 25 * 1024 * 1024) {
        showAlert.warning("File Terlalu Besar", "Ukuran file maksimal 25 MB");
        return;
      }
      
      // Validate file type
      const validTypes = ['.xls', '.xlsx', '.pdf', '.csv', '.png', '.jpeg', '.jpg', '.doc', '.docx', '.ppt', '.pptx', '.odt', '.ods', '.zip'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!validTypes.includes(fileExtension)) {
        showAlert.warning("Format File Tidak Valid", "Format yang didukung: xls, xlsx, pdf, csv, png, jpeg, jpg, doc, docx, ppt, pptx, odt, ods, zip");
        return;
      }
      
      setFormData(prev => ({ ...prev, attachment_file: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.contact_name || !formData.contact_email || !formData.contact_phone) {
      showAlert.warning("Data Tidak Lengkap", "Nama, email, dan nomor telepon harus diisi!");
      return;
    }
    
    if (!formData.city || !formData.product_or_service) {
      showAlert.warning("Data Tidak Lengkap", "Pilih kota dan jenis layanan yang dibutuhkan!");
      return;
    }
    
    if (!formData.message) {
      showAlert.warning("Data Tidak Lengkap", "Detail permintaan harus diisi!");
      return;
    }

    setSubmitting(true);

    try {
      // Get all active suppliers
      const { data: suppliers, error: suppliersError } = await supabase
        .from("company")
        .select("id")
        .eq("role", "supplier")
        .eq("is_active", true);

      if (suppliersError) throw suppliersError;

      if (!suppliers || suppliers.length === 0) {
        showAlert.warning("Tidak Ada Supplier", "Belum ada supplier aktif di sistem.");
        setSubmitting(false);
        return;
      }

      // Prepare inquiry data for each supplier
      const inquiries = suppliers.map((supplier: any) => ({
        supplier_id: supplier.id,
        buyer_id: user?.id || null,
        contact_name: formData.contact_name,
        contact_email: formData.contact_email,
        contact_phone: formData.contact_phone,
        country: formData.country,
        city: formData.city,
        service_type: formData.product_or_service,
        estimated_delivery_time: formData.estimated_delivery_time || null,
        total_quantity: formData.total_quantity || null,
        required_certifications: formData.required_certifications.length > 0 ? formData.required_certifications : null,
        packaging_preference: formData.packaging_preference || null,
        subject: `Permintaan RFQ: ${formData.product_or_service}`,
        message: formData.message,
        additional_details: formData.supplier_types.length > 0 ? `Jenis Pemasok: ${formData.supplier_types.join(', ')}` : null,
        status: "pending",
      }));

      // Insert all inquiries
      const { error } = await supabase
        .from("inquiry")
        .insert(inquiries);

      if (error) throw error;

      showAlert.success(
        "Permintaan Terkirim!",
        `Permintaan Anda telah dikirim ke ${suppliers.length} supplier. Mereka akan menghubungi Anda segera.`
      );

      // Redirect back to explore-suppliers
      setTimeout(() => {
        router.push("/explore-suppliers");
      }, 2000);

    } catch (error) {
      console.error("Error submitting inquiry:", error);
      showAlert.error("Gagal Mengirim", "Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAEE] pt-32 md:pt-36 pb-16">
      <MoraAIBanner />
      
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#252F24] mb-2">
            Permintaan Stok dan Penawaran Harga
          </h1>
          <p className="text-[#252F24]/70">
            Buat permintaan Anda dan kami akan mempublikasikannya kepada pemasok yang relevan di platform kami.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Content - Form */}
          <div className="lg:col-span-8">
            <Card className="bg-[#E1F0C9] border-none shadow-sm rounded-xl">
              <CardContent className="p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Product or Service */}
                  <div>
                    <label className="block text-sm font-semibold text-[#252F24] mb-2">
                      Produk atau Layanan
                    </label>
                    <input
                      type="text"
                      name="product_or_service"
                      value={formData.product_or_service}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white border border-[#252F24]/20 rounded-lg focus:ring-2 focus:ring-[#252F24] focus:border-transparent"
                      placeholder="Silakan masukkan produk atau layanan"
                      required
                    />
                  </div>

                  {/* Location - Country and City */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#252F24] mb-2">
                        Pilih Negara
                      </label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white border border-[#252F24]/20 rounded-lg focus:ring-2 focus:ring-[#252F24] focus:border-transparent"
                      >
                        <option value="Indonesia">Indonesia</option>
                        <option value="Malaysia">Malaysia</option>
                        <option value="Singapore">Singapore</option>
                        <option value="Thailand">Thailand</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#252F24] mb-2">
                        Pilih Kota
                      </label>
                      <select
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white border border-[#252F24]/20 rounded-lg focus:ring-2 focus:ring-[#252F24] focus:border-transparent"
                        required
                      >
                        <option value="">Pilih Detail Kota</option>
                        <option value="Jakarta">Jakarta</option>
                        <option value="Bandung">Bandung</option>
                        <option value="Surabaya">Surabaya</option>
                        <option value="Yogyakarta">Yogyakarta</option>
                        <option value="Semarang">Semarang</option>
                        <option value="Medan">Medan</option>
                        <option value="Bali">Bali</option>
                      </select>
                    </div>
                  </div>

                  {/* Estimated Delivery Time */}
                  <div>
                    <label className="block text-sm font-semibold text-[#252F24] mb-2">
                      Estimasi waktu pengiriman
                    </label>
                    <select
                      name="estimated_delivery_time"
                      value={formData.estimated_delivery_time}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white border border-[#252F24]/20 rounded-lg focus:ring-2 focus:ring-[#252F24] focus:border-transparent"
                    >
                      <option value="">Pilih kebutuhan anda dalam opsi</option>
                      <option value="Kurang dari 24 Jam">Kurang dari 24 Jam</option>
                      <option value="1-3 Hari">1-3 Hari</option>
                      <option value="3-7 Hari">3-7 Hari</option>
                      <option value="1-2 Minggu">1-2 Minggu</option>
                      <option value="Lebih dari 2 Minggu">Lebih dari 2 Minggu</option>
                    </select>
                  </div>

                  {/* Total Quantity */}
                  <div>
                    <label className="block text-sm font-semibold text-[#252F24] mb-2">
                      Jumlah yang dibutuhkan
                    </label>
                    <input
                      type="text"
                      name="total_quantity"
                      value={formData.total_quantity}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white border border-[#252F24]/20 rounded-lg focus:ring-2 focus:ring-[#252F24] focus:border-transparent"
                      placeholder="Contoh: 200 kg, 500 pcs, 10 liter"
                    />
                  </div>

                  {/* Supplier Types */}
                  <div>
                    <label className="block text-sm font-semibold text-[#252F24] mb-3">
                      Pilih Jenis Pemasok Yang Anda Cari
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {[
                        { value: 'essential_oil_producer', label: 'Produsen Minyak Atsiri', icon: '🌿' },
                        { value: 'fragrance_producer', label: 'Produksi Fragrance', icon: '🌸' },
                        { value: 'supplier_packaging', label: 'Supplier Packaging', icon: '📦' },
                        { value: 'laboratory_certification', label: 'Sertifikasi Laboratorium', icon: '🔬' }
                      ].map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => handleCheckboxChange('supplier_types', type.value)}
                          className={`px-4 py-2.5 rounded-full text-sm font-medium transition flex items-center gap-2 ${
                            formData.supplier_types.includes(type.value)
                              ? 'bg-[#252F24] text-white'
                              : 'bg-white text-[#252F24] border border-[#252F24]/30 hover:border-[#252F24]'
                          }`}
                        >
                          <span>{type.icon}</span>
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Certifications */}
                  <div>
                    <label className="block text-sm font-semibold text-[#252F24] mb-3">
                      Sertifikasi yang dibutuhkan
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { value: 'halal', label: 'Halal' },
                        { value: 'coa', label: 'COA' },
                        { value: 'msds', label: 'MSDS' },
                        { value: 'organic', label: 'Organik' }
                      ].map((cert) => (
                        <label key={cert.value} className="flex items-center gap-2 p-3 bg-white rounded-lg cursor-pointer hover:bg-[#252F24]/5 transition">
                          <input
                            type="checkbox"
                            checked={formData.required_certifications.includes(cert.value)}
                            onChange={() => handleCheckboxChange('required_certifications', cert.value)}
                            className="w-4 h-4 text-[#252F24] rounded border-[#252F24]/30 focus:ring-[#252F24]"
                          />
                          <span className="text-sm font-medium text-[#252F24]">{cert.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Detail Permintaan */}
                  <div>
                    <label className="block text-sm font-semibold text-[#252F24] mb-2">
                      Detail Permintaan
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={6}
                      className="w-full px-4 py-3 bg-white border border-[#252F24]/20 rounded-lg focus:ring-2 focus:ring-[#252F24] focus:border-transparent resize-none"
                      placeholder="Silakan berikan spesifikasi lengkap, termasuk varian, material, ukuran, berat, jenis kemasan, sertifikasi, dan informasi relevan lainnya agar pemasok dapat memberikan penawaran secara cepat dan akurat."
                      required
                    />
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-[#252F24] mb-2">
                      Unggah gambar atau file
                    </label>
                    <div className="border-2 border-dashed border-[#252F24]/30 rounded-lg p-8 bg-white hover:border-[#252F24]/50 transition">
                      <input
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                        accept=".xls,.xlsx,.pdf,.csv,.png,.jpeg,.jpg,.doc,.docx,.ppt,.pptx,.odt,.ods,.zip"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <div className="text-center">
                          <svg className="w-12 h-12 mx-auto text-[#252F24]/40 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className="text-sm text-[#252F24] mb-1">
                            <span className="font-semibold">Maksimal 5 file</span> per pengajuan, masing-masing hingga 25 MB
                          </p>
                          {formData.attachment_file ? (
                            <p className="text-sm text-green-600 font-medium mt-2">
                              ✓ {formData.attachment_file.name}
                            </p>
                          ) : (
                            <p className="text-xs text-[#252F24]/60">
                              Nama file tidak boleh lebih dari 80 karakter
                            </p>
                          )}
                        </div>
                      </label>
                    </div>
                    <p className="text-xs text-[#252F24]/60 mt-2">
                      Format yang didukung: xls, xlsx, pdf, csv, png, jpeg, jpg, doc, docx, ppt, pptx, odt, ods, zip
                    </p>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#252F24] hover:bg-[#1a2119] text-white py-4 rounded-lg font-semibold text-base h-auto disabled:bg-[#252F24]/40"
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Mengirim Permintaan...
                      </span>
                    ) : (
                      'Kirim Permintaan'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Info */}
          <div className="lg:col-span-4">
            <Card className="bg-[#252F24] text-white border-none rounded-xl sticky top-28">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">Bagaimana cara kami bekerja?</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#E1F0C9] rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-[#252F24]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Sampaikan Detail Kebutuhan</h4>
                      <p className="text-sm text-white/80">
                        Semakin jelas permintaanmu, semakin tepat hasil pencocokannya.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#E1F0C9] rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-[#252F24]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Kami Kirimkan ke Supplier Terverifikasi</h4>
                      <p className="text-sm text-white/80">
                        Permintaanmu diproses secara cermat untuk menemukan mitra yang paling sesuai.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#E1F0C9] rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-[#252F24]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Terhubung dengan Perusahaan yang Tepat</h4>
                      <p className="text-sm text-white/80">
                        Dapatkan respons dalam 1 hari kerja dari supplier berkualitas.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
