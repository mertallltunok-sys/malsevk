"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { getOffersByUserId, getJobById } from "@/lib/storage";

export default function SentOffersPage() {
  const { user, loading: authLoading } = useAuth();
  const [offersWithJobs, setOffersWithJobs] = useState<any[]>([]);

  useEffect(() => {
    if (user && user.userType === "hizmet_veren") {
      try {
        const myOffers = getOffersByUserId(user.id);
        const withJobs = myOffers.map((offer) => ({
          ...offer,
          job: getJobById(offer.jobId),
        }));
        setOffersWithJobs(withJobs);
      } catch (error) {
        console.error("Sent offers load error:", error);
        setOffersWithJobs([]);
      }
    }
  }, [user]);

  if (authLoading) {
    return (
      <div className="text-center py-20">
        <i className="fas fa-spinner fa-spin text-4xl text-[#1e3a8a]" />
      </div>
    );
  }

  if (!user || user.userType !== "hizmet_veren") {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <i className="fas fa-lock text-5xl text-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-[#1e3a8a] mb-2">
            Yetkisiz Erişim
          </h2>
          <p className="text-gray-500 mb-4">
            Bu sayfa sadece hizmet verenler için geçerlidir.
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
        <i className="fas fa-paper-plane mr-2" />
        Gönderilen Tekliflerim
      </h1>

      {offersWithJobs.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-8 text-center">
          <i className="fas fa-inbox text-5xl text-gray-300 mb-4" />
          <p className="text-gray-500 mb-4">Henüz teklif göndermediniz.</p>
          <Link
            href="/jobs"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-all"
          >
            <i className="fas fa-search mr-2" />
            İlanları İncele
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {offersWithJobs.map(({ job, ...offer }) => (
            <div
              key={offer.id}
              className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-[#1e3a8a]"
            >
              <div className="flex flex-col lg:flex-row justify-between gap-4">
                <div className="flex-1">
                  <Link
                    href={`/jobs/${job?.id}`}
                    className="text-lg font-bold text-[#1e3a8a] hover:underline"
                  >
                    {job?.title || "İlan silinmiş"}
                  </Link>
                  {job && (
                    <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
                      <span>
                        <i className="fas fa-building mr-1" />
                        {job.company}
                      </span>
                      <span>
                        <i className="fas fa-map-marker-alt mr-1" />
                        {job.city} / {job.district}
                      </span>
                      <span>
                        <i className="fas fa-calendar mr-1" />
                        {job.date}
                      </span>
                    </div>
                  )}
                  <div className="mt-4 bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-700 mb-2">
                      Teklifiniz:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Firma:</span>{" "}
                        <span className="font-semibold">{offer.company}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Telefon:</span>{" "}
                        <span className="font-semibold">{offer.phone}</span>
                      </div>
                      {offer.duration && (
                        <div>
                          <span className="text-gray-500">Süre:</span>{" "}
                          <span className="font-semibold">{offer.duration}</span>
                        </div>
                      )}
                    </div>
                    {offer.description && (
                      <p className="text-gray-600 mt-2">{offer.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between gap-2">
                  <span className="text-3xl font-bold text-orange-500">
                    ₺{parseInt(offer.amount).toLocaleString("tr-TR")}
                  </span>
                  <span
                    className={`text-sm px-4 py-2 rounded-full font-semibold ${
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
                  <div className="text-xs text-gray-400">
                    {new Date(offer.createdAt).toLocaleDateString("tr-TR")}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
