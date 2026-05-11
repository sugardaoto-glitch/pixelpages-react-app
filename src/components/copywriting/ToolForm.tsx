"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  DEFAULT_OUTPUT_LANGUAGE,
  OUTPUT_LANGUAGES,
} from "@/lib/copywriting/languages";
import type { Tool } from "@/lib/copywriting/tools";
import { getLocalStorage, setLocalStorage } from "@/lib/utils";

interface ToolFormProps {
  tool: Tool;
  onSubmit: (values: Record<string, string>, language: string) => Promise<void>;
  loading: boolean;
}

function buildInitialValues(tool: Tool): Record<string, string> {
  return Object.fromEntries(
    Object.keys(tool.fields).map((key) => [key, ""])
  );
}

export function ToolForm({ tool, onSubmit, loading }: ToolFormProps) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    buildInitialValues(tool)
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [language, setLanguage] = useState(DEFAULT_OUTPUT_LANGUAGE);

  useEffect(() => {
    // Reset the form when the active tool changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValues(buildInitialValues(tool));
    setErrors({});
  }, [tool]);

  useEffect(() => {
    const stored = getLocalStorage("copywriting:output-language");
    if (stored) {
      // Hydrate the saved language preference once on the client.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLanguage(stored);
    }
  }, []);

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    setLocalStorage("copywriting:output-language", value);
  };

  const handleReset = () => {
    setValues(buildInitialValues(tool));
    setErrors({});
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (loading) return;

    const nextErrors: Record<string, string> = {};
    for (const [key, field] of Object.entries(tool.fields)) {
      if (!values[key]?.trim()) {
        nextErrors[key] = `${field.label} is required`;
      }
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    try {
      await onSubmit(values, language);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Generation failed";
      toast.error(message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-full flex-col rounded-lg border border-slate-200 bg-white"
    >
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {Object.entries(tool.fields).map(([key, field]) => {
          const fieldId = `field-${key}`;
          const errorMessage = errors[key];
          return (
            <div key={key} className="space-y-1.5">
              <Label htmlFor={fieldId}>{field.label}</Label>
              {field.type === "Input" && (
                <Input
                  id={fieldId}
                  value={values[key] ?? ""}
                  onChange={(event) => handleChange(key, event.target.value)}
                  placeholder={
                    field.placeholder ?? `Enter ${field.label.toLowerCase()}`
                  }
                  disabled={loading}
                />
              )}
              {field.type === "Textarea" && (
                <Textarea
                  id={fieldId}
                  value={values[key] ?? ""}
                  onChange={(event) => handleChange(key, event.target.value)}
                  className={field.isBig ? "min-h-40" : "min-h-20"}
                  placeholder={
                    field.placeholder ?? `Enter ${field.label.toLowerCase()}`
                  }
                  disabled={loading}
                />
              )}
              {field.type === "Select" && (
                <Select
                  id={fieldId}
                  value={values[key] ?? ""}
                  onValueChange={(value) => handleChange(key, value)}
                  options={field.options ?? []}
                  placeholder={field.placeholder ?? `Select ${field.label}`}
                  disabled={loading}
                />
              )}
              {errorMessage && (
                <p className="text-xs text-red-500">{errorMessage}</p>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between gap-2 border-t border-slate-200 p-4">
        <Button
          type="button"
          variant="ghost"
          onClick={handleReset}
          disabled={loading}
        >
          Clear
        </Button>
        <div className="flex items-center gap-2">
          <div className="w-36">
            <Select
              aria-label="Output language"
              value={language}
              onValueChange={handleLanguageChange}
              options={OUTPUT_LANGUAGES}
              disabled={loading}
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Generating..." : tool.submitLabel}
          </Button>
        </div>
      </div>
    </form>
  );
}
