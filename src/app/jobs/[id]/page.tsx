"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  getJobById,
  getUserById,
  getOffersByJobId,
  addOffer,
  type Offer,
  type Job,
} from "@/lib/storage";

export default function JobDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { user } = useAuth();
  const router = useRouter();

  const [job, setJob] = useState<Job | null>(null);
  const [jobOwner, setJobOwner] = useState<any>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [offerForm, setOfferForm] = useState({
    company: "",
    amount: "",
    duration: "",
    description: "",
    phone: "",
  });
  const [offerSuccess, setOfferSuccess] = useState(false);
  const [offerError, setOfferError] = useState("");

  useEffect(() => {
    try {
      const jobData = getJobById(id);
      setJob(jobData);
      if (jobData) {
        setJobOwner(getUserById(jobData.userId));
        setOffers(getOffersByJobId(id));
      }
    } catch (error) {
      console.error("Job detail load error:", error);
      setJob(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const handleOfferSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      setOfferError("Teklif vermek için giriş yapmalısınız.");
      return;
    }

    if (!offerForm.company || !offerForm.amount || !offerForm.phone) {
      setOfferError("Lütfen tüm zorunlu alanları doldurun.");
      return;
    }

    try {
      addOffer({
        jobId: id,
        userId: user.id,
        company: offerForm.company,
        amount: offerForm.amount,
        duration: offerForm.duration,
        description: offerForm.description,
        phone: offerForm.phone,
      });

      setOfferSuccess(true);
      setOfferError("");
      setOfferForm({
        company: "",
        amount: "",
        duration: "",
        description: "",
        phone: "",
      });
      setShowOfferForm(false);
      setOffers(getOffersByJobId(id));

      setTimeout(() => setOfferSuccess(false), 5000);
    } catch {
      setOfferError("Teklif gönderilirken bir hata oluştu.");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <i className="fas fa-spinner fa-spin text-4xl text-[#1e3a8a]" />
        <p className="text-gray-500 mt-4">İlan yükleniyor...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <i className="fas fa-exclamation-circle text-5xl text-gray-300" />
        <p className="text-gray-500 mt-4 text-lg">İlan bulunamadı.</p>
        <Link
          href="/jobs"
          className="inline-block mt-4 text-[#1e3a8a] font-semibold hover:underline"
        >
          ← İlanlara Dön
        </Link>
      </div>
    );
  }

  const isOwner = user && user.id === job.userId;
  const canOffer = user && user.userType === "hizmet_veren" && !isOwner;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-gray-500">
        <Link href="/jobs" className="hover:text-[#1e3a8a] transition-colors">
          <i className="fas fa-arrow-left mr-1" /> İlanlar
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">{job.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Card */}
          <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#1e3a8a]">
                  {job.title}
                </h1>
                <div className="flex flex-wrap gap-3 mt-3">
                  <span
                    className={`text-sm px-3 py-1 rounded-full font-semibold ${
                      job.status === "open"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {job.status === "open" ? "Açık" : "Devam Ediyor"}
                  </span>
                  <span className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                    {job.category}
                  </span>
                </div>
              </div>
              <div className="bg-orange-500 text-white px-6 py-3 rounded-2xl text-center">
                <div className="text-sm opacity-90">Bütçe</div>
                <div className="text-2xl font-bold">
                  ₺{parseInt(job.budget).toLocaleString("tr-TR")}
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="bg-gray-50 rounded-xl p-5 mb-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
              <DetailItem
                icon="fas fa-building"
                label="Firma"
                value={job.company}
              />
              <DetailItem
                icon="fas fa-map-marker-alt"
                label="Konum"
                value={`${job.city} / ${job.district}`}
              />
              <DetailItem
                icon="fas fa-calendar"
                label="Tarih"
                value={job.date}
              />
              <DetailItem
                icon="fas fa-clock"
                label="Saat"
                value={job.time}
              />
              <DetailItem
                icon="fas fa-phone"
                label="Telefon"
                value={job.phone}
              />
              <DetailItem
                icon="fas fa-hand-paper"
                label="Teklifler"
                value={`${offers.length} teklif`}
              />
            </div>

            {/* Address */}
            <div className="mb-6">
              <h3 className="font-bold text-[#1e3a8a] mb-2">
                <i className="fas fa-location-dot mr-2" />
                Adres
              </h3>
              <p className="text-gray-600">{job.address}</p>
            </div>

            {/* Description */}
            {job.description && (
              <div>
                <h3 className="font-bold text-[#1e3a8a] mb-3">
                  <i className="fas fa-align-left mr-2" />
                  İş Açıklaması
                </h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {job.description}
                </p>
              </div>
            )}
          </div>

          {/* Offer Form */}
          {offerSuccess && (
            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-lg">
              <i className="fas fa-check-circle mr-2" />
              Teklifiniz başarıyla gönderildi!
            </div>
          )}

          {canOffer && (
            <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
              {!showOfferForm ? (
                <button
                  onClick={() => setShowOfferForm(true)}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl font-bold text-lg transition-all hover:-translate-y-0.5 shadow-md"
                >
                  <i className="fas fa-paper-plane mr-2" />
                  Teklif Ver
                </button>
              ) : (
                <form onSubmit={handleOfferSubmit} className="space-y-4">
                  <h3 className="text-xl font-bold text-[#1e3a8a]">
                    <i className="fas fa-paper-plane mr-2" />
                    Teklif Gönder
                  </h3>

                  {offerError && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded-lg text-sm">
                      <i className="fas fa-exclamation-circle mr-2" />
                      {offerError}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Firma Adı *
                    </label>
                    <input
                      type="text"
                      value={offerForm.company}
                      onChange={(e) =>
                        setOfferForm({ ...offerForm, company: e.target.value })
                      }
                      required
                      placeholder="Firma adınız"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a8a]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Teklif Tutarı (₺) *
                      </label>
                      <input
                        type="number"
                        value={offerForm.amount}
                        onChange={(e) =>
                          setOfferForm({ ...offerForm, amount: e.target.value })
                        }
                        required
                        placeholder="Örn: 5000"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a8a]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Tahmini Süre
                      </label>
                      <input
                        type="text"
                        value={offerForm.duration}
                        onChange={(e) =>
                          setOfferForm({
                            ...offerForm,
                            duration: e.target.value,
                          })
                        }
                        placeholder="Örn: 2 saat"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a8a]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Telefon Numarası *
                    </label>
                    <input
                      type="tel"
                      value={offerForm.phone}
                      onChange={(e) =>
                        setOfferForm({ ...offerForm, phone: e.target.value })
                      }
                      required
                      placeholder="05XX XXX XX XX"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a8a]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Açıklama
                    </label>
                    <textarea
                      value={offerForm.description}
                      onChange={(e) =>
                        setOfferForm({
                          ...offerForm,
                          description: e.target.value,
                        })
                      }
                      placeholder="Teklifiniz hakkında ek bilgi..."
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a8a] resize-none"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-bold transition-all"
                    >
                      <i className="fas fa-check mr-2" />
                      Teklifi Gönder
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowOfferForm(false)}
                      className="px-6 py-3 border-2 border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                    >
                      İptal
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {!user && (
            <div className="bg-blue-50 rounded-2xl p-6 text-center">
              <p className="text-[#1e3a8a] font-semibold mb-3">
                Bu ilana teklif vermek için giriş yapmalısınız.
              </p>
              <Link
                href="/login"
                className="inline-block bg-[#1e3a8a] hover:bg-[#1e40af] text-white px-6 py-3 rounded-xl font-semibold transition-all"
              >
                <i className="fas fa-sign-in-alt mr-2" />
                Giriş Yap
              </Link>
            </div>
          )}

          {/* Offers List */}
          {offers.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-[#1e3a8a]">
                <i className="fas fa-gavel mr-2" />
                Gelen Teklifler ({offers.length})
              </h3>
              {offers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publisher Info */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="font-bold text-[#1e3a8a] mb-4">
              <i className="fas fa-user-tie mr-2" />
              İlan Sahibi
            </h3>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#1e3a8a] text-white rounded-full flex items-center justify-center mx-auto text-2xl mb-3">
                <i className="fas fa-user" />
              </div>
              <h4 className="font-bold text-lg">{jobOwner?.name || "Kullanıcı"}</h4>
              {jobOwner?.company && (
                <p className="text-gray-500 text-sm">{jobOwner.company}</p>
              )}
              {jobOwner?.city && (
                <p className="text-gray-500 text-sm mt-1">
                  <i className="fas fa-map-marker-alt mr-1" />
                  {jobOwner.city}
                  {jobOwner.district && ` / ${jobOwner.district}`}
                </p>
              )}
            </div>
          </div>

          {/* Quick Info */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="font-bold text-[#1e3a8a] mb-4">
              <i className="fas fa-info-circle mr-2" />
              Özet Bilgiler
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between">
                <span className="text-gray-500">Kategori</span>
                <span className="font-semibold">{job.category}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-500">Konum</span>
                <span className="font-semibold">
                  {job.city} / {job.district}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-500">Tarih</span>
                <span className="font-semibold">{job.date}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-500">Saat</span>
                <span className="font-semibold">{job.time}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-500">Bütçe</span>
                <span className="font-semibold text-orange-500">
                  ₺{parseInt(job.budget).toLocaleString("tr-TR")}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="text-center">
      <i className={`${icon} text-orange-500 text-lg mb-1`} />
      <div className="text-xs text-gray-500">{label}</div>
      <div className="font-semibold text-sm">{value}</div>
    </div>
  );
}

function OfferCard({ offer }: { offer: Offer }) {
  const user = getUserById(offer.userId);
  return (
    <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-[#1e3a8a]">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-[#1e3a8a]">
              <i className="fas fa-user" />
            </div>
            <div>
              <h4 className="font-bold text-[#1e3a8a]">{offer.company}</h4>
              <div className="text-sm text-gray-500">
                <i className="fas fa-phone mr-1" />
                {offer.phone}
              </div>
            </div>
          </div>
          {offer.description && (
            <p className="text-gray-600 text-sm mt-2">{offer.description}</p>
          )}
          {offer.duration && (
            <span className="inline-block mt-2 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
              <i className="fas fa-clock mr-1" />
              {offer.duration}
            </span>
          )}
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-orange-500">
            ₺{parseInt(offer.amount).toLocaleString("tr-TR")}
          </div>
          <span
            className={`inline-block mt-2 text-xs px-3 py-1 rounded-full font-semibold ${
              offer.status === "pending"
                ? "bg-yellow-100 text-yellow-700"
                : offer.status === "accepted"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {offer.status === "pending"
              ? "Bekliyor"
              : offer.status === "accepted"
              ? "Kabul Edildi"
              : "Reddedildi"}
          </span>
        </div>
      </div>
    </div>
  );
}
