import { Metadata } from "next";
import Link from "next/link";
import {
  Sparkles,
  ExternalLink,
  BarChart3,
  Brain,
  Megaphone,
  ShoppingCart,
  LineChart,
  Zap,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "AI Partners & Consultants | AI Journalen",
  description:
    "Discover Swedish companies specializing in AI implementation, automation, and digital transformation to help your business leverage artificial intelligence.",
};

interface Partner {
  name: string;
  tagline: string;
  description: string;
  services: string[];
  url: string;
  icon: React.ElementType;
  color: string;
  highlight?: string;
}

const partners: Partner[] = [
  {
    name: "Dema",
    tagline: "Agentic Omnichannel Commerce Analytics",
    description:
      "AI-powered commerce intelligence platform with real-time analytics. Their AI agent enables natural language queries across your commerce data, automatically generating dashboards and actionable insights without SQL knowledge.",
    services: [
      "Commerce Analytics",
      "Marketing Mix Modeling",
      "Profit Prediction",
      "AI-powered Insights",
    ],
    url: "https://dema.ai",
    icon: BarChart3,
    color: "blue",
    highlight: "83% contribution margin growth for clients",
  },
  {
    name: "Epiminds",
    tagline: "Agentic AI for Marketing",
    description:
      "AI operating system for marketing agencies featuring Lucy, a platform that coordinates 20+ autonomous AI agents across data, creative, and strategy. Founded by ex-Google and Spotify executives.",
    services: [
      "Marketing Automation",
      "AI Agents",
      "Campaign Optimization",
      "Workflow Automation",
    ],
    url: "https://epiminds.com",
    icon: Megaphone,
    color: "purple",
    highlight: "$6.6M raised from Lightspeed",
  },
  {
    name: "Etals",
    tagline: "Agentic AI & Automation for Digital Growth",
    description:
      "AI-powered solutions for eCommerce businesses. Automates copywriting, translations, product enrichment, and keyword research with continuous learning from human validation.",
    services: [
      "eCommerce AI",
      "Automated Copywriting",
      "SEO Optimization",
      "Product Data Enrichment",
    ],
    url: "https://etals.com",
    icon: ShoppingCart,
    color: "green",
  },
  {
    name: "Normain",
    tagline: "The Extractional AI Platform",
    description:
      "Specialized AI platform focused on intelligent data extraction capabilities. Helps businesses automate the extraction and processing of information from various sources.",
    services: [
      "Data Extraction",
      "Document Processing",
      "AI Automation",
      "Information Processing",
    ],
    url: "https://normain.com",
    icon: Brain,
    color: "orange",
  },
  {
    name: "Kiri Media",
    tagline: "Proven Creative Strategy. Expert Execution.",
    description:
      "Performance-focused agency combining marketing expertise with AI & analytics. Implements AI systems including MCP servers and AI agents for real-time marketing and sales analysis.",
    services: [
      "Performance Marketing",
      "AI Implementation",
      "Growth Strategy",
      "Analytics Systems",
    ],
    url: "https://kirimedia.co",
    icon: LineChart,
    color: "rose",
    highlight: "Stockholm-based agency",
  },
];

const colorClasses: Record<string, { bg: string; border: string; text: string; light: string }> = {
  blue: {
    bg: "bg-blue-600",
    border: "border-blue-200",
    text: "text-blue-600",
    light: "bg-blue-50",
  },
  purple: {
    bg: "bg-purple-600",
    border: "border-purple-200",
    text: "text-purple-600",
    light: "bg-purple-50",
  },
  green: {
    bg: "bg-green-600",
    border: "border-green-200",
    text: "text-green-600",
    light: "bg-green-50",
  },
  orange: {
    bg: "bg-orange-500",
    border: "border-orange-200",
    text: "text-orange-600",
    light: "bg-orange-50",
  },
  rose: {
    bg: "bg-rose-600",
    border: "border-rose-200",
    text: "text-rose-600",
    light: "bg-rose-50",
  },
};

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm font-medium mb-6">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span>AI Implementation Partners</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 tracking-tight">
              Get help implementing AI in your business
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed mb-8">
              These Swedish companies specialize in AI workflows, automation, and
              digital transformation. Whether you need marketing AI, commerce
              analytics, or custom AI solutions, they can help you get started.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="#partners"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-xl font-semibold hover:bg-slate-100 transition-colors"
              >
                View Partners
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 transition-colors"
              >
                Browse Events
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Grid */}
      <section id="partners" className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            AI Companies & Consultants
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Trusted partners helping Swedish businesses adopt AI and automation
            solutions. From marketing to eCommerce, find the right expertise for
            your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {partners.map((partner) => {
            const colors = colorClasses[partner.color];
            const Icon = partner.icon;

            return (
              <article
                key={partner.name}
                className={`bg-white rounded-2xl border ${colors.border} overflow-hidden hover:shadow-lg transition-all duration-300 group`}
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-14 h-14 ${colors.light} rounded-xl flex items-center justify-center`}
                      >
                        <Icon className={`w-7 h-7 ${colors.text}`} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {partner.name}
                        </h3>
                        <p className={`text-sm font-medium ${colors.text}`}>
                          {partner.tagline}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Highlight Badge */}
                  {partner.highlight && (
                    <div className="mb-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 ${colors.light} ${colors.text} text-xs font-semibold rounded-full`}
                      >
                        <Sparkles className="w-3 h-3" />
                        {partner.highlight}
                      </span>
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {partner.description}
                  </p>

                  {/* Services */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {partner.services.map((service) => (
                      <span
                        key={service}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-lg"
                      >
                        {service}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <a
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 px-5 py-2.5 ${colors.bg} text-white rounded-xl font-medium hover:opacity-90 transition-opacity`}
                  >
                    Visit Website
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 sm:p-12 text-center text-white">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Want to be listed here?
            </h2>
            <p className="text-blue-100 mb-8 max-w-xl mx-auto">
              If your company helps businesses implement AI solutions and you want
              to reach the Swedish AI community, get in touch with us.
            </p>
            <a
              href="mailto:partners@aijournalen.se"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
            >
              Contact Us
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
