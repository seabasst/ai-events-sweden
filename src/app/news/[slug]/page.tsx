import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { format } from "date-fns";
import { ArrowLeft, Calendar, User, Tag, Share2 } from "lucide-react";
import { getArticleBySlug, getRecentArticles } from "@/lib/notion-articles";
import type { ArticleCategory } from "@/lib/types";

const categoryColors: Record<ArticleCategory, { bg: string; text: string }> = {
  "Industry News": { bg: "bg-blue-50", text: "text-blue-700" },
  "Startup News": { bg: "bg-green-50", text: "text-green-700" },
  Research: { bg: "bg-purple-50", text: "text-purple-700" },
  Opinion: { bg: "bg-orange-50", text: "text-orange-700" },
  Tutorial: { bg: "bg-pink-50", text: "text-pink-700" },
  "Event Recap": { bg: "bg-yellow-50", text: "text-yellow-700" },
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const article = await getArticleBySlug(resolvedParams.slug);

  if (!article) {
    return {
      title: "Article Not Found",
    };
  }

  return {
    title: `${article.title} | AI Journalen`,
    description: article.excerpt || article.content.slice(0, 160),
    openGraph: {
      title: article.title,
      description: article.excerpt || article.content.slice(0, 160),
      type: "article",
      images: article.imageUrl ? [{ url: article.imageUrl }] : undefined,
    },
  };
}

export const revalidate = 300;

export default async function ArticlePage({ params }: PageProps) {
  const resolvedParams = await params;
  const article = await getArticleBySlug(resolvedParams.slug);

  if (!article) {
    notFound();
  }

  const recentArticles = await getRecentArticles(4);
  const relatedArticles = recentArticles
    .filter((a) => a.id !== article.id)
    .slice(0, 3);

  const colors = categoryColors[article.category] || categoryColors["Industry News"];
  const formattedDate = article.publishedDate
    ? format(new Date(article.publishedDate), "MMMM d, yyyy")
    : "";

  return (
    <div className="min-h-screen bg-white">
      {/* Back button */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
        <Link
          href="/news"
          className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to news
        </Link>
      </div>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${colors.bg} ${colors.text}`}>
              {article.category}
            </span>
            {formattedDate && (
              <span className="flex items-center gap-1.5 text-gray-500">
                <Calendar className="w-4 h-4" />
                {formattedDate}
              </span>
            )}
            {article.author && (
              <span className="flex items-center gap-1.5 text-gray-500">
                <User className="w-4 h-4" />
                {article.author}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="text-xl text-gray-600 leading-relaxed">
              {article.excerpt}
            </p>
          )}
        </header>

        {/* Featured Image */}
        {article.imageUrl && (
          <div className="aspect-video rounded-2xl overflow-hidden mb-8">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg"
              >
                <Tag className="w-3.5 h-3.5" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg prose-gray max-w-none mb-12">
          <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
            {article.content}
          </div>
        </div>

        {/* Share */}
        <div className="flex items-center gap-4 py-6 border-t border-gray-200">
          <span className="text-gray-600 font-medium">Share this article:</span>
          <button
            onClick={() => {
              if (typeof navigator !== "undefined" && navigator.share) {
                navigator.share({
                  title: article.title,
                  text: article.excerpt,
                  url: window.location.href,
                });
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              More Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((relatedArticle) => {
                const relatedColors = categoryColors[relatedArticle.category] || categoryColors["Industry News"];
                const relatedDate = relatedArticle.publishedDate
                  ? format(new Date(relatedArticle.publishedDate), "MMM d, yyyy")
                  : "";

                return (
                  <Link
                    key={relatedArticle.id}
                    href={`/news/${relatedArticle.slug}`}
                    className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
                  >
                    <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full ${relatedColors.bg} ${relatedColors.text} mb-3`}>
                      {relatedArticle.category}
                    </span>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {relatedArticle.title}
                    </h3>
                    {relatedDate && (
                      <span className="text-sm text-gray-500">{relatedDate}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
