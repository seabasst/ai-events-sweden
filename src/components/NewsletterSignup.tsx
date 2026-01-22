"use client";

import { useState } from "react";
import { Check } from "lucide-react";

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
      <div className="flex items-center justify-center gap-2 py-4">
        <Check className="w-4 h-4 text-emerald-600" />
        <p className="text-sm text-gray-600">You&apos;re subscribed. We&apos;ll keep you updated.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-gray-900">Stay updated</p>
        <p className="text-sm text-gray-500">Get notified about new AI events in Sweden.</p>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2 w-full sm:w-auto">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          required
          className="flex-1 sm:w-64 px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-4 py-2 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {status === "loading" ? "..." : "Subscribe"}
        </button>
      </form>
    </div>
  );
}
