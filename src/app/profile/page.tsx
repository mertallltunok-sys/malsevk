"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { getJobsByUserId, getOffersByUserId } from "@/lib/storage";

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const [myJobs, setMyJobs] = useState<any[]>([]);
  const [myOffers, setMyOffers] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      try {
        if (user.userType === "is_veren") {
          setMyJobs(getJobsByUserId(user.id));
        } else {
          setMyOffers(getOffersByUserId(user.id));
        }
      } catch (error) {
        console.error("Profile data load error:", error);
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

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <i className="fas fa-lock text-5xl text-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-[#1e3a8a] mb-2">
            Giriş Yapmalısınız
          </h2>
          <p className="text-gray-500 mb-4">
            Profil sayfasını görüntülemek için giriş yapın.
          </p>
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-[#1e3a8a] to-[#3730a3] rounded-2xl p-8 text-white mb-8">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center text-4xl border-4 border-white shadow-lg">
            <i className="fas fa-user" />
          </div>
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-3xl font-bold">{user.name}</h1>
            {user.company && (
              <p className="text-white/80 text-lg">{user.company}</p>
            )}
            <div className="flex flex-wrap gap-3 mt-3 justify-center sm:justify-start">
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                <i className="fas fa-envelope mr-1" /> {user.email}
              </span>
              {user.city && (
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  <i className="fas fa-map-marker-alt mr-1" /> {user.city}
                  {user.district && ` / ${user.district}`}
                </span>
              )}
              {user.phone && (
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  <i className="fas fa-phone mr-1" /> {user.phone}
                </span>
              )}
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                <i className="fas fa-tag mr-1" />{" "}
                {user.userType === "is_veren" ? "İş Veren" : "Hizmet Veren"}
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <Link
              href="/settings"
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-semibold transition-all border border-white/30"
            >
              <i className="fas fa-cog mr-2" />
              Ayarlar
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {user.userType === "is_veren" ? (
          <>
            <StatCard
              icon="fas fa-clipboard-list"
              value={myJobs.length}
              label="İlanlarım"
              color="bg-blue-50 text-blue-600"
            />
            <StatCard
              icon="fas fa-hand-paper"
              value={myJobs.reduce(
                (sum, job) => sum + getOffersByUserId(job.id).length,
                0
              )}
              label="Toplam Teklif"
              color="bg-orange-50 text-orange-600"
            />
            <StatCard
              icon="fas fa-check-circle"
              value={myJobs.filter((j) => j.status === "completed").length}
              label="Tamamlanan"
              color="bg-green-50 text-green-600"
            />
            <StatCard
              icon="fas fa-hourglass-half"
              value={myJobs.filter((j) => j.status === "open").length}
              label="Açık İlan"
              color="bg-yellow-50 text-yellow-600"
            />
          </>
        ) : (
          <>
            <StatCard
              icon="fas fa-paper-plane"
              value={myOffers.length}
              label="Tekliflerim"
              color="bg-blue-50 text-blue-600"
            />
            <StatCard
              icon="fas fa-check-circle"
              value={myOffers.filter((o) => o.status === "accepted").length}
              label="Kabul Edilen"
              color="bg-green-50 text-green-600"
            />
            <StatCard
              icon="fas fa-hourglass-half"
              value={myOffers.filter((o) => o.status === "pending").length}
              label="Bekleyen"
              color="bg-yellow-50 text-yellow-600"
            />
            <StatCard
              icon="fas fa-times-circle"
              value={myOffers.filter((o) => o.status === "rejected").length}
              label="Reddedilen"
              color="bg-red-50 text-red-600"
            />
          </>
        )}
      </div>

      {/* Content */}
      {user.userType === "is_veren" ? (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#1e3a8a]">
              <i className="fas fa-clipboard-list mr-2" />
              İlanlarım
            </h2>
            <Link
              href="/jobs/new"
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-all"
            >
              <i className="fas fa-plus mr-2" />
              Yeni İlan
            </Link>
          </div>

          {myJobs.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md p-8 text-center">
              <i className="fas fa-inbox text-5xl text-gray-300 mb-4" />
              <p className="text-gray-500 mb-4">Henüz ilan vermediniz.</p>
              <Link
                href="/jobs/new"
                className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-all"
              >
                <i className="fas fa-plus mr-2" />
                İlk İlanı Ver
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {myJobs.map((job) => (
                <Link key={job.id} href={`/jobs/${job.id}`}>
                  <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-all border-l-4 border-orange-500 cursor-pointer">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                      <div>
                        <h3 className="font-bold text-[#1e3a8a]">
                          {job.title}
                        </h3>
                        <div className="flex gap-3 mt-2 text-sm text-gray-500">
                          <span>
                            <i className="fas fa-map-marker-alt mr-1" />
                            {job.city} / {job.district}
                          </span>
                          <span>
                            <i className="fas fa-tag mr-1" />
                            {job.category}
                          </span>
                          <span>
                            <i className="fas fa-calendar mr-1" />
                            {job.date}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-bold">
                          ₺{parseInt(job.budget).toLocaleString("tr-TR")}
                        </span>
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-semibold ${
                            job.status === "open"
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {job.status === "open" ? "Açık" : "Devam Ediyor"}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold text-[#1e3a8a] mb-6">
            <i className="fas fa-paper-plane mr-2" />
            Gönderilen Tekliflerim
          </h2>

          {myOffers.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md p-8 text-center">
              <i className="fas fa-inbox text-5xl text-gray-300 mb-4" />
              <p className="text-gray-500 mb-4">
                Henüz teklif göndermediniz.
              </p>
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
              {myOffers.map((offer) => (
                <div
                  key={offer.id}
                  className="bg-white rounded-xl shadow-md p-5 border-l-4 border-[#1e3a8a]"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                    <div>
                      <h3 className="font-bold text-[#1e3a8a]">
                        {offer.company}
                      </h3>
                      <div className="text-sm text-gray-500 mt-1">
                        <i className="fas fa-phone mr-1" />
                        {offer.phone}
                      </div>
                      {offer.duration && (
                        <div className="text-sm text-gray-500 mt-1">
                          <i className="fas fa-clock mr-1" />
                          {offer.duration}
                        </div>
                      )}
                      {offer.description && (
                        <p className="text-gray-600 text-sm mt-2">
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
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
  color,
}: {
  icon: string;
  value: number | string;
  label: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-md p-5 text-center">
      <div
        className={`w-12 h-12 ${color} rounded-full flex items-center justify-center mx-auto mb-3`}
      >
        <i className={icon} />
      </div>
      <div className="text-2xl font-bold text-gray-800">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}
