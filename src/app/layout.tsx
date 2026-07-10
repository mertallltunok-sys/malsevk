import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Shell from "@/components/Shell";

export const metadata: Metadata = {
  title: "MALSEVK.COM - Lojistik Hizmet Platformu",
  description:
    "Türkiye'nin en güvenilir online lojistik ve nakliye hizmet platformu. Yük ilanı verin, teklif alın.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className="bg-gray-100 text-gray-800 antialiased">
        <AuthProvider>
          <Shell>{children}</Shell>
        </AuthProvider>
      </body>
    </html>
  );
}
