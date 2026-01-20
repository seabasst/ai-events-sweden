import { Metadata } from "next";
import Link from "next/link";
import { format } from "date-fns";
import { Newspaper, Calendar, User, Tag, ArrowRight } from "lucide-react";
import { getArticles } from "@/lib/notion-articles";
import type { Article, ArticleCategory } from "@/lib/types";

export const metadata: Metadata = {
  title: "AI News | AI Events Sweden",
  description:
    "Stay updated with the latest AI news, startup announcements, research breakthroughs, and industry insights from Sweden's AI ecosystem.",
};

export const revalidate = 300;

const categoryColors: Record<ArticleCategory, { bg: string; text: string }> = {
  "Industry News": { bg: "bg-blue-50", text: "text-blue-700" },
  "Startup News": { bg: "bg-green-50", text: "text-green-700" },
  Research: { bg: "bg-purple-50", text: "text-purple-700" },
  Opinion: { bg: "bg-orange-50", text: "text-orange-700" },
  Tutorial: { bg: "bg-pink-50", text: "text-pink-700" },
  "Event Recap": { bg: "bg-yellow-50", text: "text-yellow-700" },
};

function ArticleCard({ article }: { article: Article }) {
  const colors = categoryColors[article.category] || categoryColors["Industry News"];
  const formattedDate = article.publishedDate
    ? format(new Date(article.publishedDate), "MMM d, yyyy")
    : "";

  return (
    <article className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
      {article.imageUrl && (
        <Link href={`/news/${article.slug}`} className="block aspect-[16/9] overflow-hidden">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
      )}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${colors.bg} ${colors.text}`}>
            {article.category}
          </span>
          {formattedDate && (
            <span className="flex items-center gap-1 text-sm text-gray-500">
              <Calendar className="w-3.5 h-3.5" />
              {formattedDate}
            </span>
          )}
        </div>

        <Link href={`/news/${article.slug}`}>
          <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
            {article.title}
          </h2>
        </Link>

        {article.excerpt && (
          <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>
        )}

        <div className="flex items-center justify-between">
          {article.author && (
            <span className="flex items-center gap-1.5 text-sm text-gray-500">
              <User className="w-3.5 h-3.5" />
              {article.author}
            </span>
          )}
          <Link
            href={`/news/${article.slug}`}
            className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            Read more
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
            {article.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

export default async function NewsPage() {
  const articles = await getArticles();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm font-medium mb-6">
              <Newspaper className="w-4 h-4 text-blue-400" />
              <span>AI News & Insights</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 tracking-tight">
              Stay ahead of the AI curve
            </h1>

            <p className="text-lg sm:text-xl text-indigo-100 leading-relaxed">
              Get the latest news, research breakthroughs, startup announcements, and
              industry insights from Sweden&apos;s thriving AI ecosystem.
            </p>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {articles.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Latest Articles</h2>
                <p className="text-gray-600 mt-1">
                  {articles.length} article{articles.length !== 1 ? "s" : ""} published
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Newspaper className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No articles yet
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              We&apos;re working on bringing you the latest AI news from Sweden.
              Check back soon!
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
            >
              Browse Events
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
