"use client";

import { BOARD_TEMPLATES, hasIllustratedLayout } from "@/lib/types";
import { FluentEmoji } from "@/lib/fluent-emoji";
import { StarfishTemplatePreview } from "@/app/create/starfish-template-preview";
import { SailboatTemplatePreview } from "@/app/create/sailboat-template-preview";
import { CheckCircle2 } from "lucide-react";

interface BoardTemplatePickerProps {
  selectedId: string | null;
  onSelect: (templateId: string) => void;
}

export function BoardTemplatePicker({ selectedId, onSelect }: BoardTemplatePickerProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {BOARD_TEMPLATES.map((template) => (
        <button
          key={template.id}
          type="button"
          onClick={() => onSelect(template.id)}
          className={`relative rounded-xl border-2 p-4 text-left transition-all ${
            selectedId === template.id
              ? "border-primary bg-primary/5 shadow-sm"
              : "border-border hover:border-muted-foreground/30"
          }`}
        >
          {selectedId === template.id && (
            <CheckCircle2 className="absolute right-3 top-3 size-4 text-primary" />
          )}
          <div className={`mb-2 ${hasIllustratedLayout(template.layout) ? "flex justify-center px-1" : "flex gap-1.5 items-center"}`}>
            {template.layout === "radial" ? (
              <StarfishTemplatePreview />
            ) : template.layout === "sailboat" ? (
              <SailboatTemplatePreview />
            ) : (
              template.columns.map((col) => (
                <FluentEmoji key={col.title} emoji={col.emoji} size="1.25rem" />
              ))
            )}
          </div>
          <h3 className="text-sm font-semibold">{template.name}</h3>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{template.description}</p>
        </button>
      ))}
    </div>
  );
}
