"use client";

import { useState } from "react";
import { Check, ArrowRight } from "lucide-react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    await new Promise((resolve) => setTimeout(resolve, 500));
    setStatus("success");
    setEmail("");
  };

  if (status === "success") {
    return (
      <div className="flex items-center justify-center gap-2.5 py-6">
        <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center">
          <Check className="w-3 h-3 text-emerald-600" strokeWidth={2} />
        </div>
        <p className="text-[14px] text-neutral-600">You&apos;re subscribed. We&apos;ll keep you updated.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
      <div className="text-center sm:text-left">
        <p className="text-[14px] font-medium text-neutral-900 mb-1">Stay updated</p>
        <p className="text-[13px] text-neutral-500">Get notified about new AI events in Sweden.</p>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2.5 w-full sm:w-auto">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="flex-1 sm:w-64 h-10 px-4 text-[13px] bg-neutral-50 border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200 focus:border-neutral-300 transition-all duration-200"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="h-10 px-4 text-[13px] font-medium bg-neutral-900 text-white rounded-md hover:bg-neutral-800 transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
        >
          {status === "loading" ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Subscribe
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
