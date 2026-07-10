"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#1f2937] text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Main Content */}
        <div className="text-center mb-8">
          {/* Brand */}
          <h3 className="text-orange-500 text-3xl font-bold mb-4">
            MALSEVK.COM
          </h3>
          <p className="text-base leading-relaxed max-w-3xl mx-auto text-gray-400">
            Türkiye&apos;nin lashingleme, konteyner dolum, konteyner boşaltım, 
            liman personeli, forklift ve depolama hizmetleri için dijital buluşma platformu.
          </p>
        </div>

        {/* Contact Info */}
        <div className="flex flex-wrap justify-center gap-8 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
              <i className="fas fa-envelope text-orange-500" />
            </div>
            <div className="text-left">
              <div className="text-xs text-gray-500">E-posta</div>
              <div className="text-sm font-semibold">info@malsevk.com</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
              <i className="fas fa-phone text-orange-500" />
            </div>
            <div className="text-left">
              <div className="text-xs text-gray-500">Telefon</div>
              <div className="text-sm font-semibold">0850 123 45 67</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
              <i className="fas fa-map-marker-alt text-orange-500" />
            </div>
            <div className="text-left">
              <div className="text-xs text-gray-500">Konum</div>
              <div className="text-sm font-semibold">Kocaeli, Türkiye</div>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="flex justify-center gap-4 mb-8">
          <SocialButton icon="fab fa-facebook-f" />
          <SocialButton icon="fab fa-twitter" />
          <SocialButton icon="fab fa-instagram" />
          <SocialButton icon="fab fa-linkedin-in" />
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-6">
          <div className="text-center text-sm text-gray-500">
            <p>&copy; 2026 MALSEVK.COM - Tüm hakları saklıdır.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialButton({ icon }: { icon: string }) {
  return (
    <button className="w-11 h-11 bg-white/10 hover:bg-orange-500 text-white rounded-full flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg hover:shadow-orange-500/30">
      <i className={icon} />
    </button>
  );
}
