"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getJobs, getOffers, getUsers, CATEGORIES } from "@/lib/storage";

export default function HomePage() {
  const [stats, setStats] = useState({ jobs: 0, offers: 0, users: 0 });

  useEffect(() => {
    // Client-side'da istatistikleri yükle
    try {
      setStats({
        jobs: getJobs().length,
        offers: getOffers().length,
        users: getUsers().length,
      });
    } catch (error) {
      console.error("Stats error:", error);
    }
  }, []);

  return (
    <div className="pb-8">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1e3a8a] to-[#3730a3] text-white py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Liman ve Lojistik Hizmetleri<br />
            <span className="text-orange-400">Güvenilir Çözüm Ortağınız</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            İş verenler ve hizmet sağlayıcıları buluşturan Türkiye&apos;nin lider
            lojistik platformu. Hemen ücretsiz kayıt olun ve işinizi kolaylaştırın.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/jobs/new"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:-translate-y-1 shadow-lg hover:shadow-orange-500/30"
            >
              <i className="fas fa-plus-circle mr-2" />
              İş İlanı Ver
            </Link>
            <Link
              href="/jobs"
              className="bg-white/10 hover:bg-white/20 backdrop-blur text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:-translate-y-1 border border-white/30"
            >
              <i className="fas fa-search mr-2" />
              İlanları Gör
            </Link>
          </div>

          {/* Live stats */}
          <div className="grid grid-cols-3 gap-4 mt-12 max-w-xl mx-auto">
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="text-3xl font-bold text-orange-400">
                {stats.jobs}+
              </div>
              <div className="text-sm text-white/80">Aktif İlan</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="text-3xl font-bold text-orange-400">
                {stats.users}+
              </div>
              <div className="text-sm text-white/80">Üye</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="text-3xl font-bold text-orange-400">
                {stats.offers}+
              </div>
              <div className="text-sm text-white/80">Teklif</div>
            </div>
          </div>
        </div>
      </section>

      {/* Hizmet Kategorileri */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-3xl font-bold text-center text-[#1e3a8a] mb-4">
          Hizmet Kategorilerimiz
        </h2>
        <p className="text-gray-500 text-center mb-12">
          Liman ve lojistik sektöründe ihtiyacınız olan tüm hizmetler
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((category) => {
            const icons: Record<string, string> = {
              "Lashingleme": "fas fa-anchor",
              "Konteyner Dolum": "fas fa-box-open",
              "Konteyner Boşaltım": "fas fa-boxes",
              "Liman Personeli": "fas fa-users",
              "Forklift Hizmeti": "fas fa-truck-loading",
              "Depolama": "fas fa-warehouse",
            };
            return (
              <CategoryCard
                key={category}
                icon={icons[category]}
                title={category}
              />
            );
          })}
        </div>
      </section>

      {/* Nasıl Çalışır */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center text-[#1e3a8a] mb-4">
            Nasıl Çalışır?
          </h2>
          <p className="text-gray-500 text-center mb-12 max-w-xl mx-auto">
            3 basit adımda işinizi yayınlayın ve teklif almaya başlayın
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard
              icon="fas fa-user-plus"
              step="1"
              title="Kayıt Olun"
              desc="İş veren veya hizmet sağlayıcı olarak ücretsiz kayıt olun."
            />
            <StepCard
              icon="fas fa-clipboard-list"
              step="2"
              title="İlan Verin / Göz Atın"
              desc="İş ilanı oluşturun veya mevcut ilanlara teklif verin."
            />
            <StepCard
              icon="fas fa-handshake"
              step="3"
              title="İşinizi Tamamlayın"
              desc="En uygun teklifi seçin ve işbirliğine başlayın."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 sm:p-12 text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Hemen Ücretsiz Kayıt Olun!
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-xl mx-auto">
            Binlerce iş veren ve hizmet sağlayıcı MALSEVK.COM&apos;da buluşuyor.
            Siz de platformumuza katılın.
          </p>
          <Link
            href="/register"
            className="inline-block bg-white text-orange-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all hover:-translate-y-1 shadow-lg"
          >
            <i className="fas fa-rocket mr-2" />
            Ücretsiz Kayıt Ol
          </Link>
        </div>
      </section>
    </div>
  );
}

function CategoryCard({ icon, title }: { icon: string; title: string }) {
  return (
    <Link
      href="/jobs"
      className="bg-gray-50 hover:bg-blue-50 rounded-xl p-6 text-center transition-all hover:-translate-y-1 hover:shadow-md group"
    >
      <i
        className={`${icon} text-5xl text-orange-500 group-hover:text-[#1e3a8a] mb-4 transition-colors`}
      />
      <h3 className="font-bold text-[#1e3a8a] text-lg">{title}</h3>
    </Link>
  );
}

function StepCard({
  icon,
  step,
  title,
  desc,
}: {
  icon: string;
  step: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-lg transition-all relative">
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
        {step}
      </div>
      <i className={`${icon} text-5xl text-orange-500 mb-4`} />
      <h3 className="text-xl font-bold text-[#1e3a8a] mb-2">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
}
