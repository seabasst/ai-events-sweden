"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-600" />
            <span className="font-semibold text-gray-900">AI Journalen</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/events"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Events
            </Link>
            <Link
              href="/news"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              News
            </Link>
            <Link
              href="/organisers"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Organisers
            </Link>
            <Link
              href="/partners"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Partners
            </Link>
            <Link
              href="/archives"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Archives
            </Link>
            <Link
              href="/submit"
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Submit Event
            </Link>
          </nav>

          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col gap-4">
              <Link
                href="/events"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Events
              </Link>
              <Link
                href="/news"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                News
              </Link>
              <Link
                href="/organisers"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Organisers
              </Link>
              <Link
                href="/partners"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Partners
              </Link>
              <Link
                href="/archives"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Archives
              </Link>
              <Link
                href="/submit"
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-center"
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
