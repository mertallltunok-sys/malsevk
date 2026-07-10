"use client";

import { useState, type FormEvent } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Simüle edilmiş gönderim
    setSuccess(true);
    setForm({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-gradient-to-br from-[#1e3a8a] to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="fas fa-envelope text-3xl text-white" />
        </div>
        <h1 className="text-4xl font-bold text-[#1e3a8a] mb-4">
          İletişime Geçin
        </h1>
        <p className="text-xl text-gray-600">
          Sorularınız, önerileriniz veya destek talepleriniz için bize ulaşın
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* İletişim Bilgileri */}
        <div className="lg:col-span-1 space-y-6">
          <ContactInfo
            icon="fas fa-phone"
            title="Telefon"
            content="+90 850 123 45 67"
            subContent="Pazartesi - Cuma, 09:00 - 18:00"
          />
          <ContactInfo
            icon="fas fa-envelope"
            title="E-posta"
            content="destek@malsevk.com"
            subContent="24 saat içinde yanıt veriyoruz"
          />
          <ContactInfo
            icon="fas fa-map-marker-alt"
            title="Adres"
            content="İstanbul Teknik Üniversitesi Teknokent"
            subContent="Maslak, İstanbul, Türkiye"
          />
          <ContactInfo
            icon="fas fa-clock"
            title="Çalışma Saatleri"
            content="Pazartesi - Cuma: 09:00 - 18:00"
            subContent="Cumartesi - Pazar: Kapalı"
          />

          {/* Sosyal Medya */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="font-bold text-[#1e3a8a] mb-4">
              <i className="fas fa-share-alt mr-2" />
              Sosyal Medya
            </h3>
            <div className="flex gap-3">
              <SocialButton icon="fab fa-facebook-f" />
              <SocialButton icon="fab fa-twitter" />
              <SocialButton icon="fab fa-linkedin-in" />
              <SocialButton icon="fab fa-instagram" />
            </div>
          </div>
        </div>

        {/* İletişim Formu */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-[#1e3a8a] mb-6">
              Mesaj Gönderin
            </h2>

            {success && (
              <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-lg mb-6">
                <i className="fas fa-check-circle mr-2" />
                Mesajınız başarıyla gönderildi! En kısa sürede size dönüş
                yapacağız.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    placeholder="Adınız ve soyadınız"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a8a] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    E-posta *
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

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Konu *
                </label>
                <select
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a8a] bg-white transition-colors"
                >
                  <option value="">Seçiniz</option>
                  <option value="Genel Bilgi">Genel Bilgi</option>
                  <option value="Teknik Destek">Teknik Destek</option>
                  <option value="Hesap Sorunu">Hesap Sorunu</option>
                  <option value="İş Birliği">İş Birliği</option>
                  <option value="Şikayet">Şikayet</option>
                  <option value="Öneri">Öneri</option>
                  <option value="Diğer">Diğer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Mesajınız *
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder="Mesajınızı buraya yazın..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a8a] resize-none transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl font-bold text-lg transition-all hover:-translate-y-0.5 shadow-md"
              >
                <i className="fas fa-paper-plane mr-2" />
                Mesajı Gönder
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* SSS */}
      <div className="mt-12">
        <h2 className="text-3xl font-bold text-[#1e3a8a] text-center mb-8">
          Sıkça Sorulan Sorular
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FaqCard
            question="Platform nasıl çalışır?"
            answer="İş verenler ilan oluşturur, hizmet sağlayıcılar bu ilanlara teklif verir. İş verenler gelen teklifleri değerlendirir ve en uygununu seçer."
          />
          <FaqCard
            question="Kayıt ücreti var mı?"
            answer="Hayır, platformumuza kayıt olmak tamamen ücretsizdir. Sadece başarılı işlemlerden komisyon alınır."
          />
          <FaqCard
            question="Ödemeler nasıl yapılır?"
            answer="Ödemeler iş veren ve hizmet sağlayıcı arasında doğrudan gerçekleştirilir. Platform sadece buluşma noktasıdır."
          />
          <FaqCard
            question="Teknik destek nasıl alabilirim?"
            answer="7/24 destek hattımızdan, e-posta veya canlı destek üzerinden bize ulaşabilirsiniz."
          />
        </div>
      </div>
    </div>
  );
}

function ContactInfo({
  icon,
  title,
  content,
  subContent,
}: {
  icon: string;
  title: string;
  content: string;
  subContent: string;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex gap-4">
        <div className="w-12 h-12 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center shrink-0">
          <i className={icon} />
        </div>
        <div>
          <h3 className="font-bold text-[#1e3a8a] mb-1">{title}</h3>
          <p className="text-gray-700 font-semibold">{content}</p>
          <p className="text-sm text-gray-500 mt-1">{subContent}</p>
        </div>
      </div>
    </div>
  );
}

function SocialButton({ icon }: { icon: string }) {
  return (
    <button className="w-10 h-10 bg-[#1e3a8a] hover:bg-orange-500 text-white rounded-full flex items-center justify-center transition-all hover:scale-110">
      <i className={icon} />
    </button>
  );
}

function FaqCard({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="font-bold text-[#1e3a8a] mb-2 flex items-start gap-2">
        <i className="fas fa-question-circle text-orange-500 mt-1" />
        {question}
      </h3>
      <p className="text-gray-600 leading-relaxed ml-6">{answer}</p>
    </div>
  );
}
