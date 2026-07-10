"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { CITIES, CATEGORIES, type UserType, isEmailTaken, isPhoneTaken } from "@/lib/storage";
import {
  validatePassword,
  validateEmail,
  validateTurkishPhone,
  type PasswordValidation,
} from "@/lib/validation";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    company: "",
    phone: "",
    userType: "is_veren" as UserType,
    city: "",
    district: "",
    services: [] as string[],
    description: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidation>({
    isValid: false,
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    noSpaces: true,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Şifre değiştikçe validasyonu güncelle
    if (name === "password") {
      setPasswordValidation(validatePassword(value));
    }
  };

  const handleServiceToggle = (service: string) => {
    const services = form.services.includes(service)
      ? form.services.filter((s) => s !== service)
      : [...form.services, service];
    setForm({ ...form, services });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    // Zorunlu alan kontrolü
    if (!form.company || !form.name || !form.phone || !form.email || !form.city || !form.district) {
      setError("Lütfen zorunlu alanların tamamını doldurun.");
      return;
    }

    // E-posta validasyonu
    if (!validateEmail(form.email)) {
      setError("Lütfen geçerli bir e-posta adresi girin.");
      return;
    }

    // E-posta tekrar kontrolü
    if (isEmailTaken(form.email)) {
      setError("Bu e-posta adresi zaten kayıtlı.");
      return;
    }

    // Telefon validasyonu
    if (!validateTurkishPhone(form.phone)) {
      setError("Lütfen geçerli bir Türkiye telefon numarası girin (örn: 05XX XXX XX XX).");
      return;
    }

    // Telefon tekrar kontrolü
    if (isPhoneTaken(form.phone)) {
      setError("Bu telefon numarası zaten kayıtlı.");
      return;
    }

    // Hizmet veren için hizmet seçimi kontrolü
    if (form.userType === "hizmet_veren" && form.services.length === 0) {
      setError("Lütfen en az bir hizmet türü seçin.");
      return;
    }

    // Şifre güvenlik kontrolü
    if (!passwordValidation.isValid) {
      setError("Şifreniz güvenlik kurallarını karşılamıyor.");
      return;
    }

    // Şifre eşleşme kontrolü
    if (form.password !== form.confirmPassword) {
      setError("Girdiğiniz şifreler eşleşmiyor.");
      return;
    }

    setLoading(true);

    const result = register({
      ...form,
      phone: form.phone.replace(/\s/g, ""), // Boşlukları temizle
    });
    
    setLoading(false);

    if (!result.success) {
      setError(result.error || "Kayıt başarısız");
    } else {
      alert("Kayıt işleminiz başarıyla tamamlandı.");
      router.push("/profile");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#1e3a8a] rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-user-plus text-2xl text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[#1e3a8a]">Kayıt Ol</h2>
          <p className="text-gray-500 mt-2">Ücretsiz hesap oluşturun</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6">
            <i className="fas fa-exclamation-circle mr-2" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Kullanıcı Türü */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Hesap Türü *
            </label>
            <select
              name="userType"
              value={form.userType}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a8a] bg-white transition-colors"
            >
              <option value="is_veren">İş Veren</option>
              <option value="hizmet_veren">Hizmet Veren</option>
            </select>
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
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a8a] transition-colors"
            />
          </div>

          {/* Yetkili Kişi */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Yetkili Kişi Adı Soyadı *
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

          {/* Telefon & E-posta */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Telefon Numarası *
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                placeholder="05XX XXX XX XX"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a8a] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                E-posta Adresi *
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="ornek@email.com"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a8a] transition-colors"
              />
            </div>
          </div>

          {/* Şehir & İlçe */}
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
                İlçe *
              </label>
              <input
                type="text"
                name="district"
                value={form.district}
                onChange={handleChange}
                required
                placeholder="İlçe"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a8a] transition-colors"
              />
            </div>
          </div>

          {/* Hizmet Veren için Ek Alanlar */}
          {form.userType === "hizmet_veren" && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Verdiğiniz Hizmetler *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map((service) => (
                    <label
                      key={service}
                      className={`flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        form.services.includes(service)
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={form.services.includes(service)}
                        onChange={() => handleServiceToggle(service)}
                        className="w-4 h-4 text-orange-500"
                      />
                      <span className="text-sm font-medium">{service}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Firma Açıklaması
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Firmanız hakkında kısa bilgi..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a8a] resize-none transition-colors"
                />
              </div>
            </>
          )}

          {/* Şifre Oluştur */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Şifre Oluştur *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="Güçlü bir şifre oluşturun"
                className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a8a] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
              </button>
            </div>

            {/* Şifre Kuralları */}
            {form.password && (
              <div className="mt-2 p-3 bg-gray-50 rounded-lg space-y-1 text-sm">
                <PasswordRule met={passwordValidation.minLength} text="En az 8 karakter" />
                <PasswordRule met={passwordValidation.hasUpperCase} text="En az 1 büyük harf" />
                <PasswordRule met={passwordValidation.hasLowerCase} text="En az 1 küçük harf" />
                <PasswordRule met={passwordValidation.hasNumber} text="En az 1 rakam" />
                <PasswordRule met={passwordValidation.hasSpecialChar} text="En az 1 özel karakter (!@#$%...)" />
                <PasswordRule met={passwordValidation.noSpaces} text="Boşluk içermemeli" />
              </div>
            )}
          </div>

          {/* Şifreyi Tekrar Gir */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Şifreyi Tekrar Gir *
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Şifrenizi tekrar girin"
                className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a8a] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`} />
              </button>
            </div>
            {form.confirmPassword && form.password !== form.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                <i className="fas fa-times-circle mr-1" />
                Şifreler eşleşmiyor
              </p>
            )}
            {form.confirmPassword && form.password === form.confirmPassword && (
              <p className="mt-1 text-sm text-green-600">
                <i className="fas fa-check-circle mr-1" />
                Şifreler eşleşiyor
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-bold text-lg transition-all hover:-translate-y-0.5 shadow-md disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2" />
                Kayıt yapılıyor...
              </>
            ) : (
              <>
                <i className="fas fa-user-plus mr-2" />
                Kayıt Ol
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-500">
          Zaten hesabınız var mı?{" "}
          <Link
            href="/login"
            className="text-[#1e3a8a] font-semibold hover:underline"
          >
            Giriş Yap
          </Link>
        </p>
      </div>
    </div>
  );
}

function PasswordRule({ met, text }: { met: boolean; text: string }) {
  return (
    <div className={`flex items-center gap-2 ${met ? "text-green-600" : "text-gray-500"}`}>
      <i className={`fas ${met ? "fa-check-circle" : "fa-circle"} text-xs`} />
      <span>{text}</span>
    </div>
  );
}
