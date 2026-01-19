import type { Category } from "@/lib/types";

interface CategoryPillProps {
  category: Category;
  size?: "sm" | "md";
  onClick?: () => void;
  selected?: boolean;
}

const categoryColors: Record<Category, { bg: string; text: string }> = {
  "AI/ML": { bg: "bg-purple-50", text: "text-purple-700" },
  "Data Science": { bg: "bg-blue-50", text: "text-blue-700" },
  Business: { bg: "bg-green-50", text: "text-green-700" },
  Research: { bg: "bg-indigo-50", text: "text-indigo-700" },
  Creative: { bg: "bg-pink-50", text: "text-pink-700" },
  Healthcare: { bg: "bg-red-50", text: "text-red-700" },
  Finance: { bg: "bg-emerald-50", text: "text-emerald-700" },
  Robotics: { bg: "bg-orange-50", text: "text-orange-700" },
  NLP: { bg: "bg-cyan-50", text: "text-cyan-700" },
};

export default function CategoryPill({
  category,
  size = "md",
  onClick,
  selected = false,
}: CategoryPillProps) {
  const colors = categoryColors[category] || { bg: "bg-gray-50", text: "text-gray-700" };
  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";

  const baseClasses = `inline-flex items-center rounded-full font-medium transition-all ${sizeClasses}`;
  const colorClasses = selected
    ? `${colors.bg} ${colors.text} ring-2 ring-offset-1 ring-current`
    : `${colors.bg} ${colors.text}`;
  const interactiveClasses = onClick
    ? "cursor-pointer hover:opacity-80"
    : "";

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${baseClasses} ${colorClasses} ${interactiveClasses}`}
      >
        {category}
      </button>
    );
  }

  return (
    <span className={`${baseClasses} ${colorClasses}`}>
      {category}
    </span>
  );
}
