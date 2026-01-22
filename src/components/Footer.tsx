import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors">
              AI Journalen
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/events" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                Events
              </Link>
              <Link href="/news" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                News
              </Link>
              <Link href="/submit" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                Submit
              </Link>
            </nav>
          </div>
          <p className="text-sm text-gray-400">
            {new Date().getFullYear()} AI Journalen
          </p>
        </div>
      </div>
    </footer>
  );
}
