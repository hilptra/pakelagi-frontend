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
    <div className="min-h-[calc(100vh-5rem)] flex flex-col justify-center items-center px-4 py-12 bg-background">
      
      {/* Back to Home Link */}
      <div className="w-full max-w-md mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-muted hover:text-brand-primary transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Beranda</span>
        </Link>

        <span className="text-[11px] font-mono font-medium text-brand-muted bg-brand-accent/40 border border-brand-accent px-2.5 py-0.5 rounded-full">
          Portal Admin
        </span>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-surface border border-brand-border rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
        
        {/* Header Logo & Title */}
        <div className="flex flex-col items-center text-center space-y-3">
          <Link href="/">
            <PakeLagiLogo height={52} className="text-brand-primary" />
          </Link>

          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-foreground">
              Login Admin
            </h1>
            <p className="text-xs text-brand-muted">
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
          <div className="p-3.5 rounded-xl border border-brand-success bg-brand-success/20 text-brand-primary text-xs flex items-center gap-2 font-medium">
            <ShieldCheck className="w-4 h-4 text-brand-primary shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email Input */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-xs font-semibold text-foreground">
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
                className="w-full bg-background text-foreground text-xs rounded-xl pl-9 pr-4 py-3 border border-brand-border focus:border-brand-primary focus:bg-surface focus:outline-none transition-all"
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-xs font-semibold text-foreground">
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
                className="w-full bg-background text-foreground text-xs rounded-xl pl-9 pr-10 py-3 border border-brand-border focus:border-brand-primary focus:bg-surface focus:outline-none transition-all"
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-foreground"
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
            className="w-full mt-2 bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold text-sm py-3.5 px-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span>Memproses...</span>
            ) : (
              <span>Masuk Sekarang</span>
            )}
          </button>
        </form>

        {/* Footer Note */}
        <div className="pt-2 text-center border-t border-brand-border">
          <p className="text-[11px] text-brand-muted">
            Halaman ini khusus pengelola sistem PakeLagi.
          </p>
        </div>

      </div>

    </div>
  );
}
