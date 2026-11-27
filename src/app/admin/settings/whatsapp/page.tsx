"use client";

import { useState, useEffect, type FormEvent } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import {
  getAdminWhatsAppSetting,
  updateAdminWhatsAppSetting,
} from "@/services/setting-service";
import { ApiError } from "@/lib/api-client";
import {
  MessageSquare,
  Save,
  Loader2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Phone,
} from "lucide-react";

export default function AdminWhatsAppSettingsPage() {
  const [currentNumber, setCurrentNumber] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [inputNumber, setInputNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const fetchCurrentSetting = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await getAdminWhatsAppSetting();
      setCurrentNumber(data.whatsapp_number);
      setCurrentUrl(data.whatsapp_url);
      setInputNumber(data.whatsapp_number || "");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Gagal memuat pengaturan WhatsApp admin.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentSetting();
  }, []);

  // Normalisasi preview lokal real-time
  const computePreview = (raw: string): string => {
    const digits = raw.replace(/[^0-9]/g, "");
    if (!digits) return "";
    if (digits.startsWith("08")) {
      return "628" + digits.substring(2);
    }
    if (digits.startsWith("8")) {
      return "628" + digits.substring(1);
    }
    return digits;
  };

  const previewNormalized = computePreview(inputNumber);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setFieldErrors({});

    if (!inputNumber.trim()) {
      setErrorMsg("Nomor WhatsApp wajib diisi.");
      return;
    }

    setSaving(true);
    try {
      const res = await updateAdminWhatsAppSetting(inputNumber.trim());
      setCurrentNumber(res.data.whatsapp_number);
      setCurrentUrl(res.data.whatsapp_url);
      setInputNumber(res.data.whatsapp_number || "");
      setSuccessMsg(res.message || "Nomor WhatsApp admin berhasil diperbarui.");
    } catch (err: unknown) {
      if (err instanceof ApiError && err.errors) {
        setFieldErrors(err.errors);
        setErrorMsg(err.message || "Nomor WhatsApp tidak valid.");
      } else if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Gagal menyimpan nomor WhatsApp.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <AdminPageHeader
        title="WhatsApp Admin"
        description="Kelola nomor WhatsApp admin yang terhubung ke tombol chat dan kontak di seluruh website."
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Pengaturan Website" },
          { label: "WhatsApp Admin" },
        ]}
      />

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">Terjadi Kesalahan</p>
            <p className="text-xs text-rose-700 mt-0.5">{errorMsg}</p>
          </div>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">Perubahan Tersimpan</p>
            <p className="text-xs text-emerald-700 mt-0.5">{successMsg}</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center bg-surface border border-brand-border rounded-2xl space-y-3">
          <Loader2 className="w-7 h-7 text-brand-primary animate-spin mx-auto" />
          <p className="text-xs text-brand-muted">Memuat data pengaturan WhatsApp...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Form Card */}
          <div className="md:col-span-2 bg-surface border border-brand-border rounded-2xl p-6 sm:p-7 shadow-xs space-y-6">
            <div className="border-b border-brand-border pb-4">
              <h2 className="text-base font-bold text-foreground">
                Ubah Nomor WhatsApp
              </h2>
              <p className="text-xs text-brand-muted mt-1">
                Nomor ini akan otomatis digunakan oleh tombol hubungi penjual pada halaman produk, navbar, dan footer.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="whatsapp_number"
                  className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1.5"
                >
                  Nomor WhatsApp <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-muted">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    id="whatsapp_number"
                    type="text"
                    value={inputNumber}
                    onChange={(e) => setInputNumber(e.target.value)}
                    placeholder="Contoh: 081234567890 atau +6281234567890"
                    className="w-full pl-10 pr-4 py-2.5 bg-background border border-brand-border rounded-xl text-sm text-foreground placeholder:text-brand-muted focus:border-brand-primary focus:outline-hidden transition-colors"
                  />
                </div>

                {fieldErrors.whatsapp_number && (
                  <p className="text-xs text-rose-600 mt-1.5 font-medium">
                    {fieldErrors.whatsapp_number[0]}
                  </p>
                )}

                {/* Live Normalization Preview */}
                {inputNumber.trim() && (
                  <div className="mt-2.5 p-3 rounded-lg bg-background border border-brand-border text-xs space-y-1">
                    <span className="text-brand-muted">Hasil normalisasi sistem:</span>
                    <p className="font-mono font-semibold text-brand-primary">
                      {previewNormalized ? (
                        <>+{previewNormalized}</>
                      ) : (
                        <span className="text-rose-500 font-sans">Nomor tidak valid</span>
                      )}
                    </p>
                  </div>
                )}
              </div>

              {/* Petunjuk Format */}
              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold">
                  <HelpCircle className="w-4 h-4 text-amber-700" />
                  <span>Format yang didukung:</span>
                </div>
                <ul className="list-disc list-inside space-y-0.5 text-amber-800 text-[11px] pl-1">
                  <li>Format lokal: <code className="bg-amber-100/80 px-1 py-0.5 rounded">081234567890</code></li>
                  <li>Format internasional: <code className="bg-amber-100/80 px-1 py-0.5 rounded">+6281234567890</code> atau <code className="bg-amber-100/80 px-1 py-0.5 rounded">6281234567890</code></li>
                  <li>Sistem akan menolak huruf, simbol selain angka, atau panjang yang tidak wajar.</li>
                </ul>
              </div>

              <div className="pt-2 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-semibold rounded-xl shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Simpan Perubahan</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Status Preview Card */}
          <div className="bg-surface border border-brand-border rounded-2xl p-6 shadow-xs space-y-5 h-fit">
            <div className="flex items-center gap-2.5 text-foreground font-bold text-sm border-b border-brand-border pb-3">
              <MessageSquare className="w-4 h-4 text-brand-primary" />
              <span>Status Aktif Saat Ini</span>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-brand-muted">
                  Nomor Tersimpan
                </span>
                <p className="font-mono text-sm font-bold text-foreground mt-0.5">
                  {currentNumber ? `+${currentNumber}` : <span className="text-brand-muted italic">Belum diatur</span>}
                </p>
              </div>

              <div>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-brand-muted">
                  Link Langsung
                </span>
                {currentUrl ? (
                  <a
                    href={currentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-primary hover:underline break-all"
                  >
                    <span>{currentUrl}</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  </a>
                ) : (
                  <p className="text-xs text-brand-muted mt-1 italic">Link belum tersedia</p>
                )}
              </div>
            </div>

            <div className="p-3 bg-background border border-brand-border rounded-xl text-[11px] text-brand-muted space-y-1">
              <span className="font-semibold text-foreground">Catatan Sinkronisasi:</span>
              <p>Perubahan nomor langsung terhubung ke database dan merevalidasi cache website secara otomatis.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

