import { Metadata } from "next";
import { ExternalLink, ArrowRight } from "lucide-react";

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
  highlight?: string;
}

const partners: Partner[] = [
  {
    name: "Dema",
    tagline: "Agentic Omnichannel Commerce Analytics",
    description:
      "AI-powered commerce intelligence platform with real-time analytics. Their AI agent enables natural language queries across your commerce data, automatically generating dashboards and actionable insights without SQL knowledge.",
    services: ["Commerce Analytics", "Marketing Mix Modeling", "Profit Prediction", "AI-powered Insights"],
    url: "https://dema.ai",
    highlight: "83% contribution margin growth for clients",
  },
  {
    name: "Epiminds",
    tagline: "Agentic AI for Marketing",
    description:
      "AI operating system for marketing agencies featuring Lucy, a platform that coordinates 20+ autonomous AI agents across data, creative, and strategy. Founded by ex-Google and Spotify executives.",
    services: ["Marketing Automation", "AI Agents", "Campaign Optimization", "Workflow Automation"],
    url: "https://epiminds.com",
    highlight: "$6.6M raised from Lightspeed",
  },
  {
    name: "Etals",
    tagline: "Agentic AI & Automation for Digital Growth",
    description:
      "AI-powered solutions for eCommerce businesses. Automates copywriting, translations, product enrichment, and keyword research with continuous learning from human validation.",
    services: ["eCommerce AI", "Automated Copywriting", "SEO Optimization", "Product Data Enrichment"],
    url: "https://etals.com",
  },
  {
    name: "Normain",
    tagline: "The Extractional AI Platform",
    description:
      "Specialized AI platform focused on intelligent data extraction capabilities. Helps businesses automate the extraction and processing of information from various sources.",
    services: ["Data Extraction", "Document Processing", "AI Automation", "Information Processing"],
    url: "https://normain.com",
  },
  {
    name: "Kiri Media",
    tagline: "Proven Creative Strategy. Expert Execution.",
    description:
      "Performance-focused agency combining marketing expertise with AI & analytics. Implements AI systems including MCP servers and AI agents for real-time marketing and sales analysis.",
    services: ["Performance Marketing", "AI Implementation", "Growth Strategy", "Analytics Systems"],
    url: "https://kirimedia.co",
    highlight: "Stockholm-based agency",
  },
];

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-neutral-50/50">
      {/* Hero Section */}
      <section className="bg-white border-b border-neutral-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="max-w-2xl">
            <h1 className="text-[32px] sm:text-[40px] font-semibold text-neutral-900 mb-4 tracking-tight leading-[1.1]">
              AI Implementation Partners
            </h1>
            <p className="text-[17px] text-neutral-600 leading-relaxed">
              Swedish companies specializing in AI workflows, automation, and digital transformation.
              Find the right expertise for your needs.
            </p>
          </div>
        </div>
      </section>

      {/* Partners List */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <p className="text-[13px] text-neutral-500 mb-6">
          {partners.length} partner{partners.length !== 1 ? "s" : ""}
        </p>

        <div className="space-y-4">
          {partners.map((partner) => (
            <article
              key={partner.name}
              className="group bg-white rounded-lg border border-neutral-200/80 hover:border-neutral-300 p-5 sm:p-6 transition-all duration-300 hover:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)]"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
                    <h3 className="text-[15px] font-semibold text-neutral-900">{partner.name}</h3>
                    <span className="text-[13px] text-neutral-500">{partner.tagline}</span>
                  </div>

                  {partner.highlight && (
                    <p className="text-[12px] text-emerald-600 font-medium mb-2.5">
                      {partner.highlight}
                    </p>
                  )}

                  <p className="text-[13px] text-neutral-600 mb-4 line-clamp-2 leading-relaxed">
                    {partner.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {partner.services.map((service) => (
                      <span
                        key={service}
                        className="px-2.5 py-1 bg-neutral-100 text-neutral-600 text-[12px] rounded-md"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                <a
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[13px] text-neutral-500 hover:text-neutral-900 transition-colors duration-200 whitespace-nowrap sm:mt-1"
                >
                  Visit website
                  <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white border border-neutral-200/80 rounded-lg p-8 sm:p-10 text-center">
          <h2 className="text-[17px] font-semibold text-neutral-900 mb-2">Want to be listed here?</h2>
          <p className="text-[14px] text-neutral-500 mb-6 max-w-md mx-auto">
            If your company helps businesses implement AI solutions, get in touch.
          </p>
          <a
            href="mailto:partners@aijournalen.se"
            className="inline-flex items-center gap-2 h-10 px-5 bg-neutral-900 text-white text-[13px] font-medium rounded-md hover:bg-neutral-800 transition-all duration-200"
          >
            Contact Us
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
          </a>
        </div>
      </section>
    </div>
  );
}
