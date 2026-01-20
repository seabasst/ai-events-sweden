import { Client } from "@notionhq/client";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import type { Article, ArticleCategory, ArticleTag, ArticleStatus } from "./types";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const articlesDatabaseId = process.env.NOTION_ARTICLES_DATABASE_ID || "";

function isConfigured(): boolean {
  return Boolean(process.env.NOTION_API_KEY && process.env.NOTION_ARTICLES_DATABASE_ID);
}

function generateSlug(title: string, id: string): string {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const idWithoutDashes = id.replace(/-/g, "");
  const uniqueId = idWithoutDashes.slice(-12);
  return `${baseSlug}-${uniqueId}`;
}

function getPropertyValue(
  page: PageObjectResponse,
  propertyName: string
): unknown {
  const property = page.properties[propertyName];
  if (!property) return null;

  switch (property.type) {
    case "title":
      return property.title[0]?.plain_text || "";
    case "rich_text":
      return property.rich_text.map((t) => t.plain_text).join("") || "";
    case "date":
      return property.date?.start || null;
    case "select":
      return property.select?.name || null;
    case "multi_select":
      return property.multi_select.map((item) => item.name);
    case "checkbox":
      return property.checkbox;
    case "url":
      return property.url || "";
    default:
      return null;
  }
}

function pageToArticle(page: PageObjectResponse): Article {
  const title = getPropertyValue(page, "Title") as string;
  const customSlug = getPropertyValue(page, "Slug") as string;

  return {
    id: page.id,
    slug: customSlug || generateSlug(title, page.id),
    title,
    content: (getPropertyValue(page, "Content") as string) || "",
    excerpt: (getPropertyValue(page, "Excerpt") as string) || "",
    publishedDate: (getPropertyValue(page, "Published Date") as string) || "",
    author: (getPropertyValue(page, "Author") as string) || "",
    category: (getPropertyValue(page, "Category") as ArticleCategory) || "Industry News",
    tags: (getPropertyValue(page, "Tags") as ArticleTag[]) || [],
    imageUrl: (getPropertyValue(page, "Image URL") as string) || undefined,
    status: (getPropertyValue(page, "Status") as ArticleStatus) || "Draft",
    featured: (getPropertyValue(page, "Featured") as boolean) || false,
  };
}

export async function getArticles(): Promise<Article[]> {
  if (!isConfigured()) {
    console.warn("Notion articles database is not configured. Set NOTION_ARTICLES_DATABASE_ID.");
    return [];
  }

  try {
    const response = await notion.databases.query({
      database_id: articlesDatabaseId,
      filter: {
        property: "Status",
        select: {
          equals: "Published",
        },
      },
      sorts: [
        {
          property: "Published Date",
          direction: "descending",
        },
      ],
    });

    return response.results
      .filter((page): page is PageObjectResponse => "properties" in page)
      .map(pageToArticle);
  } catch (error) {
    console.warn("Failed to fetch articles from Notion:", error);
    return [];
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  if (!isConfigured()) {
    return null;
  }

  const idPart = slug.split("-").pop();
  if (!idPart || idPart.length < 12) return null;

  try {
    const response = await notion.databases.query({
      database_id: articlesDatabaseId,
      filter: {
        property: "Status",
        select: {
          equals: "Published",
        },
      },
    });

    const page = response.results
      .filter((p): p is PageObjectResponse => "properties" in p)
      .find((p) => {
        const article = pageToArticle(p);
        return article.slug === slug || p.id.replace(/-/g, "").endsWith(idPart);
      });

    if (!page) return null;

    return pageToArticle(page);
  } catch (error) {
    console.warn("Failed to fetch article from Notion:", error);
    return null;
  }
}

export async function getFeaturedArticles(limit = 3): Promise<Article[]> {
  if (!isConfigured()) {
    return [];
  }

  try {
    const response = await notion.databases.query({
      database_id: articlesDatabaseId,
      filter: {
        and: [
          {
            property: "Status",
            select: {
              equals: "Published",
            },
          },
          {
            property: "Featured",
            checkbox: {
              equals: true,
            },
          },
        ],
      },
      sorts: [
        {
          property: "Published Date",
          direction: "descending",
        },
      ],
      page_size: limit,
    });

    return response.results
      .filter((page): page is PageObjectResponse => "properties" in page)
      .map(pageToArticle);
  } catch (error) {
    console.warn("Failed to fetch featured articles from Notion:", error);
    return [];
  }
}

export async function getRecentArticles(limit = 5): Promise<Article[]> {
  if (!isConfigured()) {
    return [];
  }

  try {
    const response = await notion.databases.query({
      database_id: articlesDatabaseId,
      filter: {
        property: "Status",
        select: {
          equals: "Published",
        },
      },
      sorts: [
        {
          property: "Published Date",
          direction: "descending",
        },
      ],
      page_size: limit,
    });

    return response.results
      .filter((page): page is PageObjectResponse => "properties" in page)
      .map(pageToArticle);
  } catch (error) {
    console.warn("Failed to fetch recent articles from Notion:", error);
    return [];
  }
}

export async function getArticlesByCategory(category: ArticleCategory): Promise<Article[]> {
  if (!isConfigured()) {
    return [];
  }

  try {
    const response = await notion.databases.query({
      database_id: articlesDatabaseId,
      filter: {
        and: [
          {
            property: "Status",
            select: {
              equals: "Published",
            },
          },
          {
            property: "Category",
            select: {
              equals: category,
            },
          },
        ],
      },
      sorts: [
        {
          property: "Published Date",
          direction: "descending",
        },
      ],
    });

    return response.results
      .filter((page): page is PageObjectResponse => "properties" in page)
      .map(pageToArticle);
  } catch (error) {
    console.warn("Failed to fetch articles by category from Notion:", error);
    return [];
  }
}
