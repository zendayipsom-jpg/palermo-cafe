"use client";

import dynamic from "next/dynamic";

const Footer = dynamic(() => import("./Footer"), {
  ssr: false,
  loading: () => (
    <footer className="bg-brand-dark text-white" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="h-6 bg-white/10 rounded w-1/3 mb-4 animate-pulse"></div>
        <div className="h-4 bg-white/10 rounded w-1/2 animate-pulse"></div>
      </div>
    </footer>
  ),
});

export default function ClientFooter() {
  return <Footer />;
}
