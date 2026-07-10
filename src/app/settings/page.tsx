"use client";

import { useState, type FormEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { CITIES } from "@/lib/storage";

export default function SettingsPage() {
  const { user, loading: authLoading, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: "",
    company: "",
    phone: "",
    city: "",
    district: "",
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Form'u kullanıcı verisiyle doldur
  useState(() => {
    if (user) {
      setForm({
        name: user.name || "",
        company: user.company || "",
        phone: user.phone || "",
        city: user.city || "",
        district: user.district || "",
      });
    }
  });

  if (authLoading) {
    return (
      <div className="text-center py-20">
        <i className="fas fa-spinner fa-spin text-4xl text-[#1e3a8a]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <i className="fas fa-lock text-5xl text-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-[#1e3a8a] mb-2">
            Giriş Yapmalısınız
          </h2>
          <Link
            href="/login"
            className="inline-block bg-[#1e3a8a] hover:bg-[#1e40af] text-white px-6 py-3 rounded-xl font-semibold transition-all"
          >
            Giriş Yap
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!form.name) {
      setError("Ad Soyad alanı zorunludur.");
      return;
    }

    const result = updateProfile(form);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(result.error || "Güncelleme başarısız.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <Link
          href="/profile"
          className="text-sm text-gray-500 hover:text-[#1e3a8a] transition-colors"
        >
          <i className="fas fa-arrow-left mr-1" /> Profilime Dön
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <div className="mb-8">
          <div className="w-16 h-16 bg-[#1e3a8a] rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-cog text-2xl text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#1e3a8a] text-center">
            Hesap Ayarları
          </h1>
          <p className="text-gray-500 mt-2 text-center">
            Profil bilgilerinizi güncelleyin
          </p>
        </div>

        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-lg mb-6">
            <i className="fas fa-check-circle mr-2" />
            Bilgileriniz başarıyla güncellendi!
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6">
            <i className="fas fa-exclamation-circle mr-2" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">E-posta:</span>{" "}
                <span className="font-semibold">{user.email}</span>
              </div>
              <div>
                <span className="text-gray-500">Kullanıcı Türü:</span>{" "}
                <span className="font-semibold">
                  {user.userType === "is_veren" ? "İş Veren" : "Hizmet Veren"}
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              * E-posta ve kullanıcı türü değiştirilemez
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Ad Soyad *
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Ad Soyad"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a8a] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Firma Adı
            </label>
            <input
              type="text"
              name="company"
              value={form.company}
              onChange={handleChange}
              placeholder="Firma Adı"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a8a] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Telefon
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="05XX XXX XX XX"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a8a] transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                İl
              </label>
              <select
                name="city"
                value={form.city}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a8a] bg-white transition-colors"
              >
                <option value="">Seçiniz</option>
                {CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                İlçe
              </label>
              <input
                type="text"
                name="district"
                value={form.district}
                onChange={handleChange}
                placeholder="İlçe"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a8a] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl font-bold text-lg transition-all hover:-translate-y-0.5 shadow-md"
          >
            <i className="fas fa-save mr-2" />
            Değişiklikleri Kaydet
          </button>
        </form>
      </div>
    </div>
  );
}
