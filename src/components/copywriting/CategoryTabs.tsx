"use client";

import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/copywriting/tools";
import { cn } from "@/lib/utils";

interface CategoryTabsProps {
  active: string;
  onChange: (category: string) => void;
}

export function CategoryTabs({ active, onChange }: CategoryTabsProps) {
  const items = ["All", ...CATEGORIES] as const;
  return (
    <div className="flex flex-wrap gap-2 mb-5">
      {items.map((label) => (
        <Button
          key={label}
          size="sm"
          variant="outline"
          onClick={() => onChange(label)}
          className={cn(
            "transition-colors",
            active === label
              ? "bg-brand text-white hover:bg-brand-dark hover:text-white"
              : "bg-white text-slate-900 hover:bg-slate-100"
          )}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
