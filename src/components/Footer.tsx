import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200/80 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
            <Link
              href="/"
              className="text-[14px] font-semibold text-neutral-900 hover:text-neutral-600 transition-colors duration-200"
            >
              AI Journalen
            </Link>
            <nav className="flex items-center gap-6">
              <Link
                href="/events"
                className="text-[13px] text-neutral-500 hover:text-neutral-900 transition-colors duration-200"
              >
                Events
              </Link>
              <Link
                href="/news"
                className="text-[13px] text-neutral-500 hover:text-neutral-900 transition-colors duration-200"
              >
                News
              </Link>
              <Link
                href="/partners"
                className="text-[13px] text-neutral-500 hover:text-neutral-900 transition-colors duration-200"
              >
                Partners
              </Link>
              <Link
                href="/submit"
                className="text-[13px] text-neutral-500 hover:text-neutral-900 transition-colors duration-200"
              >
                Submit
              </Link>
            </nav>
          </div>
          <p className="text-[12px] text-neutral-400">
            © {new Date().getFullYear()} AI Journalen
          </p>
        </div>
      </div>
    </footer>
  );
}
