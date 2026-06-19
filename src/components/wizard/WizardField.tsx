import type { Control, FieldErrors } from "react-hook-form";
import { Controller } from "react-hook-form";
import type { BriefingFormValues, FieldDef } from "@/lib/briefing-schema";

export function WizardField({
  field,
  control,
  errors,
}: {
  field: FieldDef;
  control: Control<BriefingFormValues>;
  errors: FieldErrors<BriefingFormValues>;
}) {
  const error = errors[field.name]?.message as string | undefined;
  const baseInput =
    "w-full px-4 py-3 bg-brand-card border border-brand-border rounded-xl text-white placeholder:text-brand-text-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all";

  return (
    <div className="space-y-2">
      <label htmlFor={field.name} className="block text-sm font-medium text-white">
        {field.label}
        {field.required && <span className="text-brand-primary ml-1">*</span>}
      </label>
      {field.helper && (
        <p className="text-xs text-brand-text-muted">{field.helper}</p>
      )}
      <Controller
        control={control}
        name={field.name}
        render={({ field: rhf }) => {
          if (field.type === "textarea") {
            return (
              <textarea
                id={field.name}
                {...rhf}
                value={rhf.value ?? ""}
                placeholder={field.placeholder}
                rows={4}
                className={baseInput + " resize-y min-h-[112px]"}
              />
            );
          }
          if (field.type === "select") {
            return (
              <select
                id={field.name}
                {...rhf}
                value={rhf.value ?? ""}
                className={baseInput}
              >
                <option value="">Selecione...</option>
                {field.options?.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            );
          }
          return (
            <input
              id={field.name}
              type={field.type === "date" ? "date" : "text"}
              {...rhf}
              value={rhf.value ?? ""}
              placeholder={field.placeholder}
              className={baseInput}
            />
          );
        }}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
