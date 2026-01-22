"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="font-medium text-gray-900 hover:text-gray-600 transition-colors">
            AI Journalen
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/events"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Events
            </Link>
            <Link
              href="/news"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              News
            </Link>
            <Link
              href="/organisers"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Organisers
            </Link>
            <Link
              href="/partners"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Partners
            </Link>
            <Link
              href="/submit"
              className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
            >
              Submit Event
            </Link>
          </nav>

          <button
            className="md:hidden p-2 -mr-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5 text-gray-600" />
            ) : (
              <Menu className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col gap-3">
              <Link
                href="/events"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Events
              </Link>
              <Link
                href="/news"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                News
              </Link>
              <Link
                href="/organisers"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Organisers
              </Link>
              <Link
                href="/partners"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Partners
              </Link>
              <Link
                href="/submit"
                className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors py-1"
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
