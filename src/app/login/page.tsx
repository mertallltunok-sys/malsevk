"use client";

import { useState, type FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { initDefaultAdmin } from "@/lib/storage";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Admin kullanıcısının varlığını kontrol et
  useEffect(() => {
    // Client-side'da admin oluştur
    initDefaultAdmin();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = login(usernameOrEmail, password);
    setLoading(false);

    if (!result.success) {
      setError("Kullanıcı adı, e-posta veya şifre hatalı.");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Test Bilgisi */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center shrink-0">
              <i className="fas fa-info-circle" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-blue-900 mb-2">Test Hesabı</h3>
              <div className="space-y-1 text-sm">
                <div className="flex gap-2">
                  <span className="font-semibold text-blue-700 w-28">Kullanıcı Adı:</span>
                  <span className="font-mono bg-white px-2 py-0.5 rounded text-blue-900">admin</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-semibold text-blue-700 w-28">Şifre:</span>
                  <span className="font-mono bg-white px-2 py-0.5 rounded text-blue-900">admin</span>
                </div>
              </div>
              <p className="text-xs text-blue-600 mt-2">
                * Bu hesap sadece geliştirme ve test amacıyla kullanılacaktır.
              </p>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#1e3a8a] rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-sign-in-alt text-2xl text-white" />
            </div>
            <h2 className="text-2xl font-bold text-[#1e3a8a]">Giriş Yap</h2>
            <p className="text-gray-500 mt-2">Hesabınıza giriş yapın</p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6">
              <i className="fas fa-exclamation-circle mr-2" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Kullanıcı Adı veya E-posta
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <i className="fas fa-user" />
                </span>
                <input
                  type="text"
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  placeholder="Kullanıcı adı veya e-posta"
                  required
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a8a] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Şifre
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <i className="fas fa-lock" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a8a] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <Link
                href="/forgot-password"
                className="text-sm text-[#1e3a8a] font-semibold hover:underline"
              >
                Şifremi Unuttum
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-bold text-lg transition-all hover:-translate-y-0.5 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2" />
                  Giriş yapılıyor...
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt mr-2" />
                  Giriş Yap
                </>
              )}
            </button>
          </form>

          <p className="text-center mt-6 text-gray-500">
            Hesabınız yok mu?{" "}
            <Link
              href="/register"
              className="text-[#1e3a8a] font-semibold hover:underline"
            >
              Kayıt Ol
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
