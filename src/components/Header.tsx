"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <header className="bg-[#1e3a8a] text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <Link
            href="/"
            className="text-2xl font-bold text-orange-500 hover:text-orange-400 transition-colors"
          >
            MALSEVK.COM
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink href="/" active={pathname === "/"}>
              <i className="fas fa-home mr-1" /> Ana Sayfa
            </NavLink>
            <NavLink href="/jobs" active={pathname.startsWith("/jobs")}>
              <i className="fas fa-list mr-1" /> İş İlanları
            </NavLink>

            {user ? (
              <>
                {user.userType === "is_veren" && (
                  <>
                    <NavLink
                      href="/jobs/new"
                      active={pathname === "/jobs/new"}
                    >
                      <i className="fas fa-plus mr-1" /> Yeni İlan
                    </NavLink>
                    <NavLink
                      href="/offers/received"
                      active={pathname === "/offers/received"}
                    >
                      <i className="fas fa-inbox mr-1" /> Gelen Teklifler
                    </NavLink>
                  </>
                )}
                {user.userType === "hizmet_veren" && (
                  <NavLink
                    href="/offers/sent"
                    active={pathname === "/offers/sent"}
                  >
                    <i className="fas fa-paper-plane mr-1" /> Tekliflerim
                  </NavLink>
                )}
                <NavLink
                  href="/profile"
                  active={pathname === "/profile"}
                >
                  <i className="fas fa-user mr-1" /> Profilim
                </NavLink>
                <button
                  onClick={logout}
                  className="text-white/80 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg text-sm transition-all"
                >
                  <i className="fas fa-sign-out-alt mr-1" /> Çıkış
                </button>
              </>
            ) : (
              <>
                <NavLink
                  href="/login"
                  active={pathname === "/login"}
                >
                  <i className="fas fa-sign-in-alt mr-1" /> Giriş Yap
                </NavLink>
                <Link
                  href="/register"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:-translate-y-0.5"
                >
                  Kayıt Ol
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <MobileMenu user={user} onLogout={logout} pathname={pathname} />
        </div>
      </div>
    </header>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-lg text-sm transition-all ${
        active
          ? "bg-white/20 text-white"
          : "text-white/80 hover:text-white hover:bg-white/10"
      }`}
    >
      {children}
    </Link>
  );
}

function MobileMenu({
  user,
  onLogout,
  pathname,
}: {
  user: any;
  onLogout: () => void;
  pathname: string;
}) {
  return (
    <div className="md:hidden relative group">
      <button className="text-white p-2">
        <i className="fas fa-bars text-xl" />
      </button>
      <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-lg shadow-xl opacity-0 invisible group-focus-within:opacity-100 group-focus-within:visible transition-all z-50">
        <div className="py-2">
          <MobileLink href="/" active={pathname === "/"}>
            <i className="fas fa-home mr-2" /> Ana Sayfa
          </MobileLink>
          <MobileLink href="/jobs" active={pathname.startsWith("/jobs")}>
            <i className="fas fa-list mr-2" /> İş İlanları
          </MobileLink>
          {user ? (
            <>
              {user.userType === "is_veren" && (
                <>
                  <MobileLink href="/jobs/new" active={pathname === "/jobs/new"}>
                    <i className="fas fa-plus mr-2" /> Yeni İlan
                  </MobileLink>
                  <MobileLink href="/offers/received" active={pathname === "/offers/received"}>
                    <i className="fas fa-inbox mr-2" /> Gelen Teklifler
                  </MobileLink>
                </>
              )}
              {user.userType === "hizmet_veren" && (
                <MobileLink href="/offers/sent" active={pathname === "/offers/sent"}>
                  <i className="fas fa-paper-plane mr-2" /> Tekliflerim
                </MobileLink>
              )}
              <MobileLink href="/profile" active={pathname === "/profile"}>
                <i className="fas fa-user mr-2" /> Profilim
              </MobileLink>
              <MobileLink href="/settings" active={pathname === "/settings"}>
                <i className="fas fa-cog mr-2" /> Ayarlar
              </MobileLink>
              <button
                onClick={onLogout}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <i className="fas fa-sign-out-alt mr-2" /> Çıkış Yap
              </button>
            </>
          ) : (
            <>
              <MobileLink href="/login" active={pathname === "/login"}>
                <i className="fas fa-sign-in-alt mr-2" /> Giriş Yap
              </MobileLink>
              <MobileLink href="/register" active={pathname === "/register"}>
                <i className="fas fa-user-plus mr-2" /> Kayıt Ol
              </MobileLink>
            </>
          )}
          <div className="border-t border-gray-200 mt-2 pt-2">
            <MobileLink href="/about" active={pathname === "/about"}>
              <i className="fas fa-info-circle mr-2" /> Hakkında
            </MobileLink>
            <MobileLink href="/contact" active={pathname === "/contact"}>
              <i className="fas fa-envelope mr-2" /> İletişim
            </MobileLink>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`block px-4 py-2 text-sm transition-colors ${
        active
          ? "bg-blue-50 text-blue-700 font-semibold"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      {children}
    </Link>
  );
}
