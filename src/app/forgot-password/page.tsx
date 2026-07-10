"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { validateEmail } from "@/lib/validation";
import { getUserByEmail } from "@/lib/storage";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // E-posta validasyonu
    if (!validateEmail(email)) {
      setError("Lütfen geçerli bir e-posta adresi girin.");
      return;
    }

    setLoading(true);

    // Sistemde kayıtlı mı kontrol et
    const user = getUserByEmail(email);

    // Güvenlik için her durumda başarı mesajı göster
    // (Gerçek uygulamada e-posta gönderilir)
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setEmail("");
    }, 1500);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#1e3a8a] rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-key text-2xl text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[#1e3a8a]">Şifremi Unuttum</h2>
          <p className="text-gray-500 mt-2">
            Şifrenizi sıfırlamak için e-posta adresinizi girin
          </p>
        </div>

        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-lg mb-6">
            <i className="fas fa-check-circle mr-2" />
            <strong>Başarılı!</strong> Eğer bu e-posta adresi sistemimizde kayıtlıysa,
            şifre sıfırlama bağlantısı e-postanıza gönderildi.
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6">
            <i className="fas fa-exclamation-circle mr-2" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              E-posta Adresi
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <i className="fas fa-envelope" />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@email.com"
                required
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a8a] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-bold text-lg transition-all hover:-translate-y-0.5 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2" />
                Gönderiliyor...
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane mr-2" />
                Sıfırlama Bağlantısı Gönder
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="text-sm text-[#1e3a8a] font-semibold hover:underline"
          >
            <i className="fas fa-arrow-left mr-1" />
            Giriş sayfasına dön
          </Link>
        </div>

        {/* Bilgilendirme */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">
            <i className="fas fa-info-circle mr-2" />
            Bilgi
          </h3>
          <p className="text-xs text-blue-700 leading-relaxed">
            Şifre sıfırlama bağlantısı e-posta adresinize gönderilecektir.
            E-postayı almadıysanız spam/gereksiz klasörünüzü kontrol edin.
            Bağlantı 24 saat geçerlidir.
          </p>
        </div>
      </div>
    </div>
  );
}
