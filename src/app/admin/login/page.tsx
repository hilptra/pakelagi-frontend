"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PakeLagiLogo } from "@/components/ui/PakeLagiLogo";
import { loginAdmin, getAdminProfile } from "@/services/auth-service";
import { Lock, Mail, Eye, EyeOff, ArrowLeft, ShieldCheck, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Auto redirect if already logged in
  useEffect(() => {
    getAdminProfile().then((user) => {
      if (user) {
        router.replace("/admin");
      }
    });
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim() || !password) {
      setErrorMsg("Email dan kata sandi wajib diisi.");
      return;
    }

    setIsLoading(true);

    try {
      const admin = await loginAdmin(email.trim(), password);
      setSuccessMsg(`Selamat datang kembali, ${admin.name}! Membuka Dashboard Admin...`);
      setTimeout(() => {
        router.push("/admin");
      }, 500);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Gagal melakukan autentikasi. Silakan coba lagi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col justify-center items-center px-4 py-12 bg-[#F8F7F4]">
      
      {/* Back to Home Link */}
      <div className="w-full max-w-md mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B7280] hover:text-[#1E3447] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Beranda</span>
        </Link>

        <span className="text-[11px] font-mono font-medium text-[#6B7280] bg-[#E7DCC8]/40 border border-[#E7DCC8] px-2.5 py-0.5 rounded-full">
          Portal Admin
        </span>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
        
        {/* Header Logo & Title */}
        <div className="flex flex-col items-center text-center space-y-3">
          <Link href="/">
            <PakeLagiLogo height={52} color="#1E3447" />
          </Link>

          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-[#1F2937]">
              Login Admin
            </h1>
            <p className="text-xs text-[#6B7280]">
              Masuk untuk mengelola katalog pakaian preloved PakeLagi.
            </p>
          </div>
        </div>

        {/* Feedback Messages */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl border border-red-200 bg-red-50 text-red-700 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl border border-[#A7BFA7] bg-[#A7BFA7]/20 text-[#1E3447] text-xs flex items-center gap-2 font-medium">
            <ShieldCheck className="w-4 h-4 text-[#1E3447] shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email Input */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-xs font-semibold text-[#1F2937]">
              Email Admin <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                required
                placeholder="pakelagi@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#F8F7F4] text-[#1F2937] text-xs rounded-xl pl-9 pr-4 py-3 border border-[#E5E7EB] focus:border-[#1E3447] focus:bg-white focus:outline-none transition-all"
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label htmlFor="password font-semibold" className="block text-xs font-semibold text-[#1F2937]">
              Kata Sandi <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#F8F7F4] text-[#1F2937] text-xs rounded-xl pl-9 pr-10 py-3 border border-[#E5E7EB] focus:border-[#1E3447] focus:bg-white focus:outline-none transition-all"
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#1F2937]"
                aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-[#1E3447] hover:bg-[#162735] text-white font-semibold text-sm py-3.5 px-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span>Memproses...</span>
            ) : (
              <span>Masuk Sekarang</span>
            )}
          </button>
        </form>

        {/* Footer Note */}
        <div className="pt-2 text-center border-t border-[#E5E7EB]">
          <p className="text-[11px] text-[#6B7280]">
            Halaman ini khusus pengelola sistem PakeLagi.
          </p>
        </div>

      </div>

    </div>
  );
}
