import Link from "next/link";
import { format } from "date-fns";
import { ArrowRight, Calendar } from "lucide-react";
import { getArticles, getFeaturedArticles, getRecentArticles } from "@/lib/notion-articles";
import { getEvents } from "@/lib/notion";
import NewsletterSignup from "@/components/NewsletterSignup";
import type { Article } from "@/lib/types";

export const revalidate = 300;

function FeaturedArticle({ article }: { article: Article }) {
  const formattedDate = article.publishedDate
    ? format(new Date(article.publishedDate), "MMMM d, yyyy")
    : "";

  return (
    <Link href={`/news/${article.slug}`} className="group block">
      <article className="relative bg-white rounded-lg border border-neutral-200/80 hover:border-neutral-300 overflow-hidden transition-all duration-300 hover:shadow-[0_4px_12px_-4px_rgba(0,0,0,0.12)]">
        {article.imageUrl && (
          <div className="aspect-[2/1] overflow-hidden bg-neutral-100">
            <img
              src={article.imageUrl}
              alt=""
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>
        )}
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[11px] font-medium text-emerald-600 uppercase tracking-wider">
              {article.category}
            </span>
            {formattedDate && (
              <>
                <span className="w-1 h-1 rounded-full bg-neutral-300" />
                <span className="text-[12px] text-neutral-400">{formattedDate}</span>
              </>
            )}
          </div>
          <h2 className="text-[22px] sm:text-[26px] font-semibold text-neutral-900 mb-3 leading-tight group-hover:text-neutral-600 transition-colors duration-200">
            {article.title}
          </h2>
          {article.excerpt && (
            <p className="text-[15px] text-neutral-500 line-clamp-2 leading-relaxed mb-4">
              {article.excerpt}
            </p>
          )}
          <div className="flex items-center gap-2 text-[13px] font-medium text-neutral-900 group-hover:text-neutral-600 transition-colors duration-200">
            Read article
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" strokeWidth={1.5} />
          </div>
        </div>
      </article>
    </Link>
  );
}

function ArticleCard({ article }: { article: Article }) {
  const formattedDate = article.publishedDate
    ? format(new Date(article.publishedDate), "MMM d")
    : "";

  return (
    <Link href={`/news/${article.slug}`}>
      <article className="group relative bg-white rounded-lg border border-neutral-200/80 hover:border-neutral-300 p-5 transition-all duration-300 hover:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)]">
        <div className="flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
                {article.category}
              </span>
              {formattedDate && (
                <>
                  <span className="w-1 h-1 rounded-full bg-neutral-300" />
                  <span className="text-[12px] text-neutral-400">{formattedDate}</span>
                </>
              )}
            </div>
            <h3 className="text-[15px] font-semibold text-neutral-900 mb-1.5 group-hover:text-neutral-600 transition-colors duration-200 line-clamp-2 leading-snug">
              {article.title}
            </h3>
            {article.excerpt && (
              <p className="text-[13px] text-neutral-500 line-clamp-2 leading-relaxed">
                {article.excerpt}
              </p>
            )}
          </div>
          {article.imageUrl && (
            <div className="hidden sm:block w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-neutral-100">
              <img
                src={article.imageUrl}
                alt=""
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}

function UpcomingEventCard({ event }: { event: { name: string; date: string; city: string; slug: string } }) {
  const eventDate = new Date(event.date);
  const day = format(eventDate, "EEE");
  const date = format(eventDate, "d");
  const month = format(eventDate, "MMM");

  return (
    <Link
      href={`/events/${event.slug}`}
      className="group flex items-center gap-4 p-3 rounded-lg hover:bg-neutral-50 transition-all duration-200"
    >
      <div className="flex-shrink-0 w-12 text-center">
        <p className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">{day}</p>
        <p className="text-[17px] font-semibold text-neutral-900 -mt-0.5">{date}</p>
        <p className="text-[10px] text-neutral-400 uppercase">{month}</p>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-[13px] font-medium text-neutral-900 group-hover:text-neutral-600 transition-colors duration-200 line-clamp-1">
          {event.name}
        </h4>
        <p className="text-[12px] text-neutral-500">{event.city}</p>
      </div>
      <ArrowRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-500 group-hover:translate-x-0.5 transition-all duration-200" strokeWidth={1.5} />
    </Link>
  );
}

export default async function HomePage() {
  const [articles, featuredArticles, events] = await Promise.all([
    getArticles(),
    getFeaturedArticles(1),
    getEvents(),
  ]);

  const featured = featuredArticles[0] || articles[0];
  const recentArticles = articles.filter((a) => a.id !== featured?.id).slice(0, 6);
  const upcomingEvents = events.slice(0, 5);

  return (
    <div className="min-h-screen bg-neutral-50/50">
      {/* Hero Section */}
      <section className="bg-white border-b border-neutral-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="max-w-2xl">
            <h1 className="text-[32px] sm:text-[40px] font-semibold text-neutral-900 mb-3 tracking-tight leading-[1.1]">
              AI Journalen
            </h1>
            <p className="text-[17px] text-neutral-600 leading-relaxed">
              News, insights, and events from Sweden&apos;s growing AI community.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Articles Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Featured Article */}
            {featured && (
              <div>
                <FeaturedArticle article={featured} />
              </div>
            )}

            {/* Recent Articles */}
            {recentArticles.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[13px] font-medium text-neutral-900 uppercase tracking-wider">
                    Latest News
                  </h2>
                  <Link
                    href="/news"
                    className="text-[13px] text-neutral-500 hover:text-neutral-900 transition-colors duration-200 flex items-center gap-1"
                  >
                    View all
                    <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </Link>
                </div>
                <div className="space-y-3">
                  {recentArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {!featured && recentArticles.length === 0 && (
              <div className="bg-white rounded-lg border border-neutral-200/80 p-12 text-center">
                <h3 className="text-[17px] font-medium text-neutral-900 mb-2">No articles yet</h3>
                <p className="text-[14px] text-neutral-500">
                  We&apos;re working on bringing you the latest AI news from Sweden.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Upcoming Events Widget */}
            <div className="bg-white rounded-lg border border-neutral-200/80 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-neutral-400" strokeWidth={1.5} />
                  <h3 className="text-[13px] font-medium text-neutral-900 uppercase tracking-wider">
                    Upcoming Events
                  </h3>
                </div>
                <Link
                  href="/events"
                  className="text-[12px] text-neutral-500 hover:text-neutral-900 transition-colors duration-200"
                >
                  View all
                </Link>
              </div>
              {upcomingEvents.length > 0 ? (
                <div className="-mx-3">
                  {upcomingEvents.map((event) => (
                    <UpcomingEventCard key={event.id} event={event} />
                  ))}
                </div>
              ) : (
                <p className="text-[13px] text-neutral-500 py-4 text-center">
                  No upcoming events
                </p>
              )}
              <div className="mt-4 pt-4 border-t border-neutral-100">
                <Link
                  href="/submit"
                  className="flex items-center justify-center gap-2 w-full h-9 text-[13px] font-medium text-neutral-600 bg-neutral-50 hover:bg-neutral-100 rounded-md transition-all duration-200"
                >
                  Submit an event
                  <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-lg border border-neutral-200/80 p-5">
              <h3 className="text-[13px] font-medium text-neutral-900 uppercase tracking-wider mb-4">
                Explore
              </h3>
              <nav className="space-y-1">
                <Link
                  href="/events"
                  className="flex items-center justify-between px-3 py-2.5 rounded-md text-[13px] text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-all duration-200"
                >
                  Browse Events
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-300" strokeWidth={1.5} />
                </Link>
                <Link
                  href="/organisers"
                  className="flex items-center justify-between px-3 py-2.5 rounded-md text-[13px] text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-all duration-200"
                >
                  Event Organisers
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-300" strokeWidth={1.5} />
                </Link>
                <Link
                  href="/partners"
                  className="flex items-center justify-between px-3 py-2.5 rounded-md text-[13px] text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-all duration-200"
                >
                  AI Partners
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-300" strokeWidth={1.5} />
                </Link>
              </nav>
            </div>
          </aside>
        </div>
      </section>

      {/* Newsletter */}
      <section className="border-t border-neutral-200/80 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <NewsletterSignup />
        </div>
      </section>
    </div>
  );
}
