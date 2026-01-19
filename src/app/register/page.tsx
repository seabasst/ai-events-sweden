"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Bell, Calendar, Sparkles, CheckCircle, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [frequency, setFrequency] = useState("weekly");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const interestOptions = [
    "AI/ML",
    "Data Science",
    "Business",
    "Research",
    "Creative",
    "Healthcare",
    "Finance",
    "Robotics",
    "NLP",
  ];

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call - replace with actual newsletter service integration
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSuccess(true);
    setIsSubmitting(false);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            You&apos;re registered!
          </h1>
          <p className="text-gray-600 mb-8">
            Thanks for signing up. We&apos;ll keep you updated on the latest AI events
            in Sweden based on your preferences.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
          >
            Browse Events
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-6">
              <Bell className="w-4 h-4" />
              <span>Stay Updated</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Never miss an AI event in Sweden
            </h1>
            <p className="text-lg text-blue-100">
              Register for our newsletter and get personalized event recommendations
              delivered straight to your inbox. Choose what interests you and how often
              you want to hear from us.
            </p>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Email */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <label className="block">
              <span className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-2">
                <Mail className="w-5 h-5 text-blue-600" />
                Email Address
              </span>
              <p className="text-sm text-gray-500 mb-4">
                We&apos;ll send event updates to this email
              </p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </label>
          </div>

          {/* Interests */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <span className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              Your Interests
            </span>
            <p className="text-sm text-gray-500 mb-4">
              Select the categories you&apos;re interested in (optional)
            </p>
            <div className="flex flex-wrap gap-2">
              {interestOptions.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    interests.includes(interest)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {/* Frequency */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <span className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Email Frequency
            </span>
            <p className="text-sm text-gray-500 mb-4">
              How often would you like to receive updates?
            </p>
            <div className="space-y-3">
              {[
                { value: "weekly", label: "Weekly digest", description: "A summary of the week's events every Monday" },
                { value: "biweekly", label: "Bi-weekly digest", description: "Updates every two weeks" },
                { value: "monthly", label: "Monthly digest", description: "A monthly roundup of AI events" },
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                    frequency === option.value
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="frequency"
                    value={option.value}
                    checked={frequency === option.value}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{option.label}</p>
                    <p className="text-sm text-gray-500">{option.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting || !email}
            className="w-full px-6 py-4 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Registering...
              </>
            ) : (
              <>
                Register for Updates
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          <p className="text-center text-sm text-gray-500">
            By registering, you agree to receive emails from AI Events Sweden.
            You can unsubscribe at any time.
          </p>
        </form>
      </section>

      {/* Benefits */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 border-t border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 text-center mb-8">
          Why Register?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Bell className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Early Access</h3>
            <p className="text-sm text-gray-600">
              Be the first to know about new events before they sell out
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Personalized</h3>
            <p className="text-sm text-gray-600">
              Get recommendations based on your interests and location
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Curated</h3>
            <p className="text-sm text-gray-600">
              We handpick the best events so you don&apos;t miss what matters
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
