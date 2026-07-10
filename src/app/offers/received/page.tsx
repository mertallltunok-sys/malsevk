"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import {
  getJobs,
  getOffers,
  getUserById,
  acceptOffer,
  updateOffer,
} from "@/lib/storage";

export default function ReceivedOffersPage() {
  const { user, loading: authLoading } = useAuth();
  const [groupedOffers, setGroupedOffers] = useState<any[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadOffers = () => {
    if (user && user.userType === "is_veren") {
      try {
        const myJobs = getJobs().filter((j) => j.userId === user.id);
        const allOffers = getOffers();

        const grouped = myJobs
          .map((job) => ({
            job,
            offers: allOffers.filter((o) => o.jobId === job.id),
          }))
          .filter((g) => g.offers.length > 0);

        setGroupedOffers(grouped);
      } catch (error) {
        console.error("Received offers load error:", error);
        setGroupedOffers([]);
      }
    }
  };

  useEffect(() => {
    loadOffers();
  }, [user]);

  const handleAccept = async (offerId: string, jobId: string) => {
    if (!confirm("Bu teklifi kabul etmek istediğinizden emin misiniz?")) {
      return;
    }

    setActionLoading(offerId);
    const success = acceptOffer(offerId, jobId);

    if (success) {
      alert("Teklif kabul edildi! Telefon bilgileri artık görünür.");
      loadOffers();
    } else {
      alert("Teklif kabul edilirken bir hata oluştu.");
    }
    setActionLoading(null);
  };

  const handleReject = async (offerId: string) => {
    if (!confirm("Bu teklifi reddetmek istediğinizden emin misiniz?")) {
      return;
    }

    setActionLoading(offerId);
    const success = updateOffer(offerId, { status: "rejected" });

    if (success) {
      alert("Teklif reddedildi.");
      loadOffers();
    } else {
      alert("Teklif reddedilirken bir hata oluştu.");
    }
    setActionLoading(null);
  };

  if (authLoading) {
    return (
      <div className="text-center py-20">
        <i className="fas fa-spinner fa-spin text-4xl text-[#1e3a8a]" />
      </div>
    );
  }

  if (!user || user.userType !== "is_veren") {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <i className="fas fa-lock text-5xl text-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-[#1e3a8a] mb-2">
            Yetkisiz Erişim
          </h2>
          <p className="text-gray-500 mb-4">
            Bu sayfa sadece iş verenler için geçerlidir.
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-[#1e3a8a] mb-8">
        <i className="fas fa-inbox mr-2" />
        Gelen Teklifler
      </h1>

      {groupedOffers.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-8 text-center">
          <i className="fas fa-inbox text-5xl text-gray-300 mb-4" />
          <p className="text-gray-500 mb-4">Henüz teklif almadınız.</p>
          <Link
            href="/jobs/new"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-all"
          >
            <i className="fas fa-plus mr-2" />
            Yeni İlan Ver
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {groupedOffers.map(({ job, offers }) => (
            <div key={job.id} className="bg-white rounded-2xl shadow-md p-6">
              <div className="mb-4 pb-4 border-b border-gray-200">
                <Link
                  href={`/jobs/${job.id}`}
                  className="text-xl font-bold text-[#1e3a8a] hover:underline"
                >
                  {job.title}
                </Link>
                <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
                  <span>
                    <i className="fas fa-map-marker-alt mr-1" />
                    {job.city} / {job.district}
                  </span>
                  <span>
                    <i className="fas fa-calendar mr-1" />
                    {job.date} {job.time}
                  </span>
                  <span className="font-semibold text-orange-600">
                    <i className="fas fa-hand-paper mr-1" />
                    {offers.length} teklif
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      job.status === "open"
                        ? "bg-green-100 text-green-700"
                        : job.status === "service_selected"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {job.status === "open"
                      ? "Açık"
                      : job.status === "service_selected"
                      ? "Hizmet Veren Seçildi"
                      : "Tamamlandı"}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {offers.map((offer: any) => {
                  const offerUser = getUserById(offer.userId);
                  const isAccepted = offer.status === "accepted";
                  const canShowPhone = isAccepted || offer.status === "completed";

                  return (
                    <div
                      key={offer.id}
                      className={`rounded-xl p-4 ${
                        isAccepted
                          ? "bg-green-50 border-2 border-green-200"
                          : offer.status === "rejected"
                          ? "bg-gray-50 border-2 border-gray-200"
                          : "bg-gray-50"
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-[#1e3a8a] text-white rounded-full flex items-center justify-center text-sm">
                              <i className="fas fa-user" />
                            </div>
                            <div>
                              <h4 className="font-bold text-[#1e3a8a]">
                                {offer.company}
                              </h4>
                              {canShowPhone && (
                                <div className="text-sm text-green-600 font-semibold">
                                  <i className="fas fa-phone mr-1" />
                                  {offer.phone}
                                </div>
                              )}
                            </div>
                          </div>
                          {offer.duration && (
                            <div className="text-sm text-gray-500 ml-10">
                              <i className="fas fa-clock mr-1" />
                              {offer.duration}
                            </div>
                          )}
                          {offer.description && (
                            <p className="text-gray-600 text-sm mt-2 ml-10">
                              {offer.description}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="text-2xl font-bold text-orange-500">
                            ₺{parseInt(offer.amount).toLocaleString("tr-TR")}
                          </span>
                          <span
                            className={`text-xs px-3 py-1 rounded-full font-semibold ${
                              offer.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : offer.status === "accepted"
                                ? "bg-green-100 text-green-700"
                                : offer.status === "completed"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {offer.status === "pending"
                              ? "Bekliyor"
                              : offer.status === "accepted"
                              ? "Kabul Edildi"
                              : offer.status === "completed"
                              ? "Tamamlandı"
                              : "Reddedildi"}
                          </span>

                          {offer.status === "pending" && (
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={() => handleAccept(offer.id, job.id)}
                                disabled={actionLoading === offer.id}
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
                              >
                                {actionLoading === offer.id ? (
                                  <i className="fas fa-spinner fa-spin" />
                                ) : (
                                  <>
                                    <i className="fas fa-check mr-1" />
                                    Kabul Et
                                  </>
                                )}
                              </button>
                              <button
                                onClick={() => handleReject(offer.id)}
                                disabled={actionLoading === offer.id}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
                              >
                                {actionLoading === offer.id ? (
                                  <i className="fas fa-spinner fa-spin" />
                                ) : (
                                  <>
                                    <i className="fas fa-times mr-1" />
                                    Reddet
                                  </>
                                )}
                              </button>
                            </div>
                          )}

                          {offer.status === "accepted" && (
                            <Link
                              href={`/jobs/${job.id}/complete`}
                              className="bg-[#1e3a8a] hover:bg-[#1e40af] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all mt-2"
                            >
                              <i className="fas fa-star mr-1" />
                              İşi Tamamla & Puanla
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
