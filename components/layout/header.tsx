"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const navLinks = [
  { name: "How it Works", href: "/how-it-works" },
  { name: "Charities", href: "/charities" },
  { name: "Pricing", href: "/pricing" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "nav-blur-scrolled py-3" : "nav-blur py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group" id="nav-logo">
            <div className="w-8 h-8 bg-emerald-700 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 group-hover:rotate-3">
              <svg className="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="font-serif font-bold text-lg tracking-wide text-emerald-950">
              Swing for Change
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1" id="nav-desktop">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-emerald-900/70 hover:text-emerald-900 rounded-lg hover:bg-emerald-50 transition-all duration-200"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3" id="nav-auth">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-semibold text-emerald-800 hover:text-emerald-950 transition"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="px-5 py-2.5 text-sm font-semibold bg-emerald-700 text-white rounded-xl hover:bg-emerald-800 transition-all shadow-sm hover:shadow-md hover:-translate-y-px"
              id="nav-signup-cta"
            >
              Sign Up Free
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-emerald-50 transition"
            aria-label="Toggle menu"
            id="nav-mobile-toggle"
          >
            <div className="w-5 flex flex-col gap-1.5">
              <span
                className={`block h-0.5 bg-emerald-900 rounded-full transition-all duration-300 origin-center ${
                  mobileOpen ? "rotate-45 translate-y-[4px]" : ""
                }`}
              />
              <span
                className={`block h-0.5 bg-emerald-900 rounded-full transition-all duration-300 ${
                  mobileOpen ? "opacity-0 scale-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 bg-emerald-900 rounded-full transition-all duration-300 origin-center ${
                  mobileOpen ? "-rotate-45 -translate-y-[4px]" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-stone-50/98 backdrop-blur-xl transition-all duration-400 md:hidden ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        id="nav-mobile-menu"
      >
        <div className="pt-24 px-8 flex flex-col gap-2">
          {navLinks.map((link, i) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`text-2xl font-serif font-bold text-emerald-950 py-4 border-b border-stone-200 transition-all duration-500 ${
                mobileOpen
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-6"
              }`}
              style={{ transitionDelay: mobileOpen ? `${i * 80}ms` : "0ms" }}
            >
              {link.name}
            </Link>
          ))}

          <div
            className={`mt-8 flex flex-col gap-3 transition-all duration-500 ${
              mobileOpen
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: mobileOpen ? "300ms" : "0ms" }}
          >
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="w-full text-center py-4 text-lg font-semibold text-emerald-800 rounded-2xl border border-emerald-200 hover:bg-emerald-50 transition"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              onClick={() => setMobileOpen(false)}
              className="w-full text-center py-4 text-lg font-semibold bg-emerald-700 text-white rounded-2xl hover:bg-emerald-800 transition shadow-lg"
            >
              Sign Up Free
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
