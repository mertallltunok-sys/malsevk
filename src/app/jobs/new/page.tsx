"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { addJob, CATEGORIES } from "@/lib/storage";
import {
  TURKEY_CITIES,
  PORTS,
  OSB_LIST,
  FREE_ZONES,
  getDistrictsByCity,
  type LocationType,
  LOCATION_TYPE_LABELS,
} from "@/lib/locations";

export default function NewJobPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    category: "",
    title: "",
    company: "",
    locationType: "il_ilce" as LocationType,
    city: "",
    district: "",
    port: "",
    portTerminal: "",
    osb: "",
    freeZone: "",
    address: "",
    date: "",
    time: "",
    budget: "",
    description: "",
    phone: "",
  });

  const [districts, setDistricts] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // İl değiştiğinde ilçeleri güncelle
    if (name === "city") {
      setDistricts(getDistrictsByCity(value));
      setForm({ ...form, city: value, district: "" }); // İlçeyi sıfırla
    }

    // Lokasyon türü değiştiğinde alanları sıfırla
    if (name === "locationType") {
      setForm({
        ...form,
        locationType: value as LocationType,
        city: "",
        district: "",
        port: "",
        portTerminal: "",
        osb: "",
        freeZone: "",
      });
      setDistricts([]);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    // Zorunlu alan kontrolü
    if (
      !form.category ||
      !form.title ||
      !form.company ||
      !form.address ||
      !form.date ||
      !form.time ||
      !form.budget ||
      !form.phone
    ) {
      setError("Lütfen tüm zorunlu alanları doldurun.");
      return;
    }

    // Lokasyon kontrolü
    if (form.locationType === "il_ilce" && (!form.city || !form.district)) {
      setError("Lütfen il ve ilçe seçin.");
      return;
    }
    if (form.locationType === "liman" && !form.port) {
      setError("Lütfen liman seçin.");
      return;
    }
    if (form.locationType === "osb" && !form.osb) {
      setError("Lütfen OSB seçin.");
      return;
    }
    if (form.locationType === "serbest_bolge" && !form.freeZone) {
      setError("Lütfen serbest bölge seçin.");
      return;
    }

    setLoading(true);

    try {
      const newJob = addJob({
        userId: user!.id,
        category: form.category,
        title: form.title,
        company: form.company,
        locationType: form.locationType,
        city: form.locationType === "il_ilce" ? form.city : undefined,
        district: form.locationType === "il_ilce" ? form.district : undefined,
        port: form.locationType === "liman" ? form.port : undefined,
        portTerminal: form.locationType === "liman" ? form.portTerminal : undefined,
        osb: form.locationType === "osb" ? form.osb : undefined,
        freeZone: form.locationType === "serbest_bolge" ? form.freeZone : undefined,
        address: form.address,
        date: form.date,
        time: form.time,
        budget: form.budget,
        description: form.description,
        phone: form.phone,
        photos: [],
      });

      router.push(`/jobs/${newJob.id}`);
    } catch {
      setError("İlan oluşturulurken bir hata oluştu.");
      setLoading(false);
    }
  };

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
          <p className="text-gray-500 mb-4">
            İlan vermek için lütfen giriş yapın veya kayıt olun.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/login"
              className="bg-[#1e3a8a] hover:bg-[#1e40af] text-white px-6 py-3 rounded-xl font-semibold transition-all"
            >
              Giriş Yap
            </Link>
            <Link
              href="/register"
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-all"
            >
              Kayıt Ol
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (user.userType !== "is_veren") {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <i className="fas fa-exclamation-triangle text-5xl text-orange-300 mb-4" />
          <h2 className="text-xl font-bold text-[#1e3a8a] mb-2">
            Yetkiniz Yok
          </h2>
          <p className="text-gray-500 mb-4">
            Sadece iş verenler ilan oluşturabilir.
          </p>
          <Link
            href="/jobs"
            className="inline-block bg-[#1e3a8a] hover:bg-[#1e40af] text-white px-6 py-3 rounded-xl font-semibold transition-all"
          >
            İlanlara Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <Link
          href="/jobs"
          className="text-sm text-gray-500 hover:text-[#1e3a8a] transition-colors"
        >
          <i className="fas fa-arrow-left mr-1" /> İlanlara Dön
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-plus-circle text-2xl text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#1e3a8a]">Yeni İş İlanı</h1>
          <p className="text-gray-500 mt-2">
            İş detaylarını girin ve teklif almaya başlayın
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6">
            <i className="fas fa-exclamation-circle mr-2" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Hizmet Türü */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Hizmet Türü *
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a8a] bg-white"
            >
              <option value="">Seçiniz</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* İş Başlığı */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              İş Başlığı *
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Örn: 40'lık Konteyner Dolumu İhtiyacı"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a8a]"
            />
          </div>

          {/* Firma Adı */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Firma Adı *
            </label>
            <input
              type="text"
              name="company"
              value={form.company}
              onChange={handleChange}
              required
              placeholder="Firma adınız"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a8a]"
            />
          </div>

          {/* Lokasyon Türü Seçimi */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Lokasyon Türü *
            </label>
            <select
              name="locationType"
              value={form.locationType}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a8a] bg-white"
            >
              {Object.entries(LOCATION_TYPE_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Dinamik Lokasyon Alanları */}
          {form.locationType === "il_ilce" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  İl *
                </label>
                <select
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a8a] bg-white"
                >
                  <option value="">Seçiniz</option>
                  {TURKEY_CITIES.map((city) => (
                    <option key={city.name} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  İlçe *
                </label>
                <select
                  name="district"
                  value={form.district}
                  onChange={handleChange}
                  required
                  disabled={!form.city}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a8a] bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {form.city ? "Seçiniz" : "Önce il seçin"}
                  </option>
                  {districts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {form.locationType === "liman" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Liman *
                </label>
                <select
                  name="port"
                  value={form.port}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a8a] bg-white"
                >
                  <option value="">Seçiniz</option>
                  {PORTS.map((port) => (
                    <option key={port} value={port}>
                      {port}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Terminal / Rıhtım / Saha
                </label>
                <input
                  type="text"
                  name="portTerminal"
                  value={form.portTerminal}
                  onChange={handleChange}
                  placeholder="Örn: A Rıhtımı, 2. Terminal"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a8a]"
                />
              </div>
            </div>
          )}

          {form.locationType === "osb" && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Organize Sanayi Bölgesi *
              </label>
              <select
                name="osb"
                value={form.osb}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a8a] bg-white"
              >
                <option value="">Seçiniz</option>
                {OSB_LIST.map((osb) => (
                  <option key={osb} value={osb}>
                    {osb}
                  </option>
                ))}
              </select>
            </div>
          )}

          {form.locationType === "serbest_bolge" && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Serbest Bölge *
              </label>
              <select
                name="freeZone"
                value={form.freeZone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a8a] bg-white"
              >
                <option value="">Seçiniz</option>
                {FREE_ZONES.map((zone) => (
                  <option key={zone} value={zone}>
                    {zone}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Adres */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Açık Adres *
            </label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              required
              placeholder="Detaylı adres bilgisi"
              rows={2}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a8a] resize-none"
            />
          </div>

          {/* Tarih, Saat, Bütçe */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                İş Tarihi *
              </label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a8a]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                İş Saati *
              </label>
              <input
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a8a]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Bütçe (₺) *
              </label>
              <input
                type="number"
                name="budget"
                value={form.budget}
                onChange={handleChange}
                required
                placeholder="Örn: 5000"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a8a]"
              />
            </div>
          </div>

          {/* Telefon */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              İletişim Telefonu *
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              placeholder="05XX XXX XX XX"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a8a]"
            />
          </div>

          {/* Açıklama */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              İş Açıklaması
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="İş hakkında detaylı bilgi verin..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a8a] resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl font-bold text-lg transition-all hover:-translate-y-0.5 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2" />
                İlan oluşturuluyor...
              </>
            ) : (
              <>
                <i className="fas fa-check-circle mr-2" />
                İlanı Yayınla
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
