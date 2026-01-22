import { Metadata } from "next";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowRight } from "lucide-react";
import { getArticles } from "@/lib/notion-articles";
import type { Article } from "@/lib/types";

export const metadata: Metadata = {
  title: "AI News | AI Journalen",
  description:
    "Stay updated with the latest AI news, startup announcements, research breakthroughs, and industry insights from Sweden's AI ecosystem.",
};

export const revalidate = 300;

function ArticleCard({ article }: { article: Article }) {
  const formattedDate = article.publishedDate
    ? format(new Date(article.publishedDate), "MMM d")
    : "";

  return (
    <Link href={`/news/${article.slug}`}>
      <article className="group relative bg-white rounded-lg border border-neutral-200/80 hover:border-neutral-300 p-5 sm:p-6 transition-all duration-300 hover:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)]">
        <div className="flex items-start justify-between gap-5">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2.5">
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

            <h2 className="text-[15px] font-semibold text-neutral-900 mb-2.5 group-hover:text-neutral-600 transition-colors duration-200 line-clamp-2 leading-snug">
              {article.title}
            </h2>

            {article.excerpt && (
              <p className="text-[13px] text-neutral-500 line-clamp-2 mb-3 leading-relaxed">
                {article.excerpt}
              </p>
            )}

            <div className="flex items-center gap-3 text-[13px] text-neutral-500">
              {article.author && <span>{article.author}</span>}
              {article.tags.length > 0 && (
                <>
                  <span className="w-1 h-1 rounded-full bg-neutral-300" />
                  <span className="truncate">{article.tags.slice(0, 2).join(", ")}</span>
                </>
              )}
            </div>
          </div>

          {article.imageUrl && (
            <div className="hidden sm:block w-28 h-28 flex-shrink-0 rounded-md overflow-hidden bg-neutral-100">
              <img
                src={article.imageUrl}
                alt=""
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          )}
        </div>

        <div className="hidden sm:flex absolute top-6 right-6 items-center justify-center w-8 h-8 rounded-full bg-neutral-50 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <ArrowRight className="w-4 h-4 text-neutral-500" strokeWidth={1.5} />
        </div>
      </article>
    </Link>
  );
}

export default async function NewsPage() {
  const articles = await getArticles();

  return (
    <div className="min-h-screen bg-neutral-50/50">
      {/* Hero Section */}
      <section className="bg-white border-b border-neutral-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="max-w-2xl">
            <h1 className="text-[32px] sm:text-[40px] font-semibold text-neutral-900 mb-4 tracking-tight leading-[1.1]">
              AI News & Insights
            </h1>
            <p className="text-[17px] text-neutral-600 leading-relaxed">
              The latest news, research breakthroughs, and industry insights from Sweden&apos;s AI
              ecosystem.
            </p>
          </div>
        </div>
      </section>

      {/* Articles List */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {articles.length > 0 ? (
          <>
            <div className="mb-6">
              <p className="text-[13px] text-neutral-500">
                {articles.length} article{articles.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="space-y-4">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-24">
            <h3 className="text-[17px] font-medium text-neutral-900 mb-2">No articles yet</h3>
            <p className="text-[14px] text-neutral-500 mb-6">
              We&apos;re working on bringing you the latest AI news from Sweden.
            </p>
            <Link
              href="/"
              className="text-[13px] font-medium text-neutral-900 hover:text-neutral-600 transition-colors duration-200"
            >
              Browse Events →
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
