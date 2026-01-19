import { Sparkles } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-gray-900">AI Events Sweden</span>
            </Link>
            <p className="text-gray-600 text-sm">
              Discover AI events across Sweden. From conferences to meetups,
              find your next opportunity to learn and connect.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-4">Quick Links</h3>
            <nav className="flex flex-col gap-2">
              <Link
                href="/events"
                className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
              >
                All Events
              </Link>
              <Link
                href="/submit"
                className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
              >
                Submit Event
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-4">Cities</h3>
            <nav className="flex flex-col gap-2">
              <Link
                href="/events?city=Stockholm"
                className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
              >
                Stockholm
              </Link>
              <Link
                href="/events?city=Göteborg"
                className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
              >
                Göteborg
              </Link>
              <Link
                href="/events?city=Malmö"
                className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
              >
                Malmö
              </Link>
              <Link
                href="/events?city=Online"
                className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
              >
                Online
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm text-center">
            {new Date().getFullYear()} AI Events Sweden. Built for the Swedish AI
            community.
          </p>
        </div>
      </div>
    </footer>
  );
}
