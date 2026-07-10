"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  getJobById,
  getOffers,
  getUserById,
  completeOffer,
} from "@/lib/storage";

export default function CompleteJobPage() {
  const params = useParams();
  const id = params.id as string;
  const { user } = useAuth();
  const router = useRouter();

  const [job, setJob] = useState<any>(null);
  const [offer, setOffer] = useState<any>(null);
  const [serviceProvider, setServiceProvider] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    try {
      const jobData = getJobById(id);
      setJob(jobData);

      if (jobData && jobData.selectedOfferId) {
        const offers = getOffers();
        const selectedOffer = offers.find((o) => o.id === jobData.selectedOfferId);
        setOffer(selectedOffer);

        if (selectedOffer) {
          setServiceProvider(getUserById(selectedOffer.userId));
        }
      }
    } catch (error) {
      console.error("Complete page load error:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      alert("Lütfen bir puan verin (1-5 yıldız)");
      return;
    }

    if (!review.trim()) {
      alert("Lütfen bir yorum yazın");
      return;
    }

    if (!offer) {
      alert("Teklif bulunamadı");
      return;
    }

    setSubmitting(true);

    const success = completeOffer(offer.id, rating, review);

    if (success) {
      alert("İş başarıyla tamamlandı ve hizmet veren puanlandı!");
      router.push("/profile");
    } else {
      alert("İş tamamlanırken bir hata oluştu.");
    }

    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <i className="fas fa-spinner fa-spin text-4xl text-[#1e3a8a]" />
        <p className="text-gray-500 mt-4">Yükleniyor...</p>
      </div>
    );
  }

  if (!job || !offer || !serviceProvider) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <i className="fas fa-exclamation-circle text-5xl text-gray-300" />
        <p className="text-gray-500 mt-4 text-lg">
          İş veya teklif bulunamadı.
        </p>
        <Link
          href="/profile"
          className="inline-block mt-4 text-[#1e3a8a] font-semibold hover:underline"
          >
          ← Profilime Dön
        </Link>
      </div>
    );
  }

  if (job.userId !== user?.id) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <i className="fas fa-lock text-5xl text-gray-300" />
        <p className="text-gray-500 mt-4">Yetkisiz erişim.</p>
      </div>
    );
  }

  if (offer.status === "completed") {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <i className="fas fa-check-circle text-5xl text-green-500 mb-4" />
          <h2 className="text-xl font-bold text-[#1e3a8a] mb-2">
            Bu İş Zaten Tamamlandı
          </h2>
          <p className="text-gray-500 mb-4">
            Puanlama: {offer.rating} / 5 yıldız
          </p>
          <Link
            href="/profile"
            className="inline-block bg-[#1e3a8a] hover:bg-[#1e40af] text-white px-6 py-3 rounded-xl font-semibold transition-all"
          >
            Profilime Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <Link
          href="/offers/received"
          className="text-sm text-gray-500 hover:text-[#1e3a8a] transition-colors"
        >
          <i className="fas fa-arrow-left mr-1" /> Gelen Tekliflere Dön
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-check-circle text-2xl text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#1e3a8a]">
            İşi Tamamla ve Puanla
          </h1>
          <p className="text-gray-500 mt-2">
            Hizmet sağlayıcıyı değerlendirin
          </p>
        </div>

        {/* İş Bilgileri */}
        <div className="bg-gray-50 rounded-xl p-5 mb-6">
          <h3 className="font-bold text-[#1e3a8a] mb-3">İş Bilgileri</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-500">İş:</span>{" "}
              <span className="font-semibold">{job.title}</span>
            </div>
            <div>
              <span className="text-gray-500">Konum:</span>{" "}
              <span className="font-semibold">
                {job.city} / {job.district}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Tarih:</span>{" "}
              <span className="font-semibold">
                {job.date} {job.time}
              </span>
            </div>
          </div>
        </div>

        {/* Hizmet Veren Bilgileri */}
        <div className="bg-blue-50 rounded-xl p-5 mb-6">
          <h3 className="font-bold text-[#1e3a8a] mb-3">Hizmet Veren</h3>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-[#1e3a8a] text-white rounded-full flex items-center justify-center text-lg">
              <i className="fas fa-user" />
            </div>
            <div>
              <h4 className="font-bold">{offer.company}</h4>
              <p className="text-sm text-gray-600">
                {serviceProvider.name}
              </p>
            </div>
          </div>
          <div className="space-y-1 text-sm">
            <div>
              <span className="text-gray-500">Telefon:</span>{" "}
              <span className="font-semibold">{offer.phone}</span>
            </div>
            <div>
              <span className="text-gray-500">Teklif Tutarı:</span>{" "}
              <span className="font-semibold text-orange-500">
                ₺{parseInt(offer.amount).toLocaleString("tr-TR")}
              </span>
            </div>
            {offer.duration && (
              <div>
                <span className="text-gray-500">Tamamlanma Süresi:</span>{" "}
                <span className="font-semibold">{offer.duration}</span>
              </div>
            )}
          </div>
        </div>

        {/* Puanlama Formu */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">
              Hizmeti Puanlayın *
            </label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="text-4xl transition-all hover:scale-110"
                >
                  <i
                    className={`fas fa-star ${
                      star <= rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-center mt-2 text-sm font-semibold text-[#1e3a8a]">
                {rating === 1 && "Çok Kötü"}
                {rating === 2 && "Kötü"}
                {rating === 3 && "Orta"}
                {rating === 4 && "İyi"}
                {rating === 5 && "Mükemmel"}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Yorumunuz *
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              required
              rows={5}
              placeholder="Aldığınız hizmet hakkında düşüncelerinizi paylaşın..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a8a] resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-bold text-lg transition-all hover:-translate-y-0.5 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2" />
                İşlem yapılıyor...
              </>
            ) : (
              <>
                <i className="fas fa-check-circle mr-2" />
                İşi Tamamla ve Puanla
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
