"use client";

import { type ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function Shell({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-4rem)]">{children}</main>
      <Footer />
    </>
  );
}
