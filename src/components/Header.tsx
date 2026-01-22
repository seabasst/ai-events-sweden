"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-neutral-200/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="text-[15px] font-semibold text-neutral-900 hover:text-neutral-600 transition-colors duration-200"
          >
            AI Journalen
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/events"
              className="px-3 py-2 text-[13px] text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-md transition-all duration-200"
            >
              Events
            </Link>
            <Link
              href="/news"
              className="px-3 py-2 text-[13px] text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-md transition-all duration-200"
            >
              All News
            </Link>
            <Link
              href="/organisers"
              className="px-3 py-2 text-[13px] text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-md transition-all duration-200"
            >
              Organisers
            </Link>
            <Link
              href="/partners"
              className="px-3 py-2 text-[13px] text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-md transition-all duration-200"
            >
              Partners
            </Link>
            <div className="w-px h-5 bg-neutral-200 mx-2" />
            <Link
              href="/submit"
              className="px-3.5 py-1.5 text-[13px] font-medium text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-all duration-200"
            >
              Submit Event
            </Link>
          </nav>

          <button
            className="md:hidden p-2 -mr-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 rounded-md transition-all duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5" strokeWidth={1.5} />
            ) : (
              <Menu className="w-5 h-5" strokeWidth={1.5} />
            )}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-3 border-t border-neutral-100 animate-fade-in">
            <nav className="flex flex-col">
              <Link
                href="/events"
                className="px-3 py-2.5 text-[14px] text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-md transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Events
              </Link>
              <Link
                href="/news"
                className="px-3 py-2.5 text-[14px] text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-md transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                All News
              </Link>
              <Link
                href="/organisers"
                className="px-3 py-2.5 text-[14px] text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-md transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Organisers
              </Link>
              <Link
                href="/partners"
                className="px-3 py-2.5 text-[14px] text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-md transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Partners
              </Link>
              <div className="h-px bg-neutral-100 my-2" />
              <Link
                href="/submit"
                className="px-3 py-2.5 text-[14px] font-medium text-neutral-900 hover:bg-neutral-50 rounded-md transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Submit Event
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
