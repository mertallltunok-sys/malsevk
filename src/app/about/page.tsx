"use client";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-gradient-to-br from-[#1e3a8a] to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="fas fa-ship text-3xl text-white" />
        </div>
        <h1 className="text-4xl font-bold text-[#1e3a8a] mb-4">
          MALSEVK.COM Hakkında
        </h1>
        <p className="text-xl text-gray-600">
          Liman ve lojistik sektörünün dijital dönüşüm platformu
        </p>
      </div>

      {/* Content */}
      <div className="space-y-8">
        <Section
          icon="fas fa-bullseye"
          title="Misyonumuz"
          content="MALSEVK.COM, Türkiye'nin liman ve lojistik sektöründe faaliyet gösteren iş verenler ile hizmet sağlayıcıları güvenli, hızlı ve verimli bir şekilde bir araya getiren dijital platformdur. Amacımız, sektördeki iş süreçlerini dijitalleştirerek zaman ve maliyet tasarrufu sağlamak, şeffaf ve güvenilir bir iş ortamı oluşturmaktır."
        />

        <Section
          icon="fas fa-eye"
          title="Vizyonumuz"
          content="Liman ve lojistik sektörünün en güvenilir ve en çok tercih edilen online platformu olmak. Türkiye genelindeki tüm liman işletmelerini, lojistik firmalarını ve hizmet sağlayıcıları tek bir çatı altında toplayarak sektörün dijital dönüşümüne öncülük etmek."
        />

        <Section
          icon="fas fa-handshake"
          title="Değerlerimiz"
          content={
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li><strong>Güvenilirlik:</strong> Tüm kullanıcılarımızın güvenliği ve memnuniyeti önceliğimizdir</li>
              <li><strong>Şeffaflık:</strong> Açık ve net iş süreçleri sunuyoruz</li>
              <li><strong>Verimlilik:</strong> Zaman ve maliyet tasarrufu sağlayan çözümler geliştiriyoruz</li>
              <li><strong>İnovasyon:</strong> Sürekli gelişim ve yenilikçilik prensibiyle hareket ediyoruz</li>
              <li><strong>Müşteri Odaklılık:</strong> Kullanıcı deneyimi ve memnuniyeti odak noktamızdır</li>
            </ul>
          }
        />

        <Section
          icon="fas fa-cogs"
          title="Hizmetlerimiz"
          content={
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ServiceCard icon="fas fa-anchor" title="Lashingleme" />
              <ServiceCard icon="fas fa-box-open" title="Konteyner Dolum" />
              <ServiceCard icon="fas fa-boxes" title="Konteyner Boşaltım" />
              <ServiceCard icon="fas fa-users" title="Liman Personeli" />
              <ServiceCard icon="fas fa-truck-loading" title="Forklift Hizmeti" />
              <ServiceCard icon="fas fa-warehouse" title="Depolama" />
            </div>
          }
        />

        <Section
          icon="fas fa-chart-line"
          title="Neden MALSEVK.COM?"
          content={
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Feature
                icon="fas fa-clock"
                title="Hızlı İşlem"
                desc="Dakikalar içinde ilan oluşturun ve teklif alın"
              />
              <Feature
                icon="fas fa-shield-alt"
                title="Güvenli Platform"
                desc="Verileriniz güvende, işlemleriniz şeffaf"
              />
              <Feature
                icon="fas fa-money-bill-wave"
                title="Rekabetçi Fiyatlar"
                desc="En uygun teklifleri karşılaştırın ve seçin"
              />
              <Feature
                icon="fas fa-headset"
                title="7/24 Destek"
                desc="Her zaman yanınızdayız"
              />
            </div>
          }
        />
      </div>

      {/* CTA */}
      <div className="mt-12 bg-gradient-to-r from-[#1e3a8a] to-[#3730a3] rounded-2xl p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-4">
          Siz de platformumuza katılın!
        </h2>
        <p className="mb-6 text-white/90">
          Binlerce kullanıcımız arasında yerinizi alın ve işlerinizi kolaylaştırın.
        </p>
        <a
          href="/register"
          className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:-translate-y-1 shadow-lg"
        >
          <i className="fas fa-rocket mr-2" />
          Hemen Başla
        </a>
      </div>
    </div>
  );
}

function Section({
  icon,
  title,
  content,
}: {
  icon: string;
  title: string;
  content: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center">
          <i className={icon} />
        </div>
        <h2 className="text-2xl font-bold text-[#1e3a8a]">{title}</h2>
      </div>
      {typeof content === "string" ? (
        <p className="text-gray-600 leading-relaxed">{content}</p>
      ) : (
        content
      )}
    </div>
  );
}

function ServiceCard({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 flex items-center gap-3">
      <i className={`${icon} text-2xl text-orange-500`} />
      <span className="font-semibold text-gray-700">{title}</span>
    </div>
  );
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="w-10 h-10 bg-orange-100 text-orange-500 rounded-lg flex items-center justify-center shrink-0">
        <i className={icon} />
      </div>
      <div>
        <h3 className="font-bold text-gray-800 mb-1">{title}</h3>
        <p className="text-sm text-gray-600">{desc}</p>
      </div>
    </div>
  );
}
