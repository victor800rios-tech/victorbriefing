import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, HelpCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  STEPS,
  briefingSchema,
  defaultBriefingValues,
  type BriefingFormValues,
} from "@/lib/briefing-schema";
import { WizardField } from "@/components/wizard/WizardField";
import { FileDropzone, type PendingFile } from "@/components/wizard/FileDropzone";
import { supabase } from "@/integrations/supabase/client";

const STORAGE_KEY = "briefing-draft-v1";

export const Route = createFileRoute("/briefing")({
  head: () => ({
    meta: [
      { title: "Briefing · Preencher" },
      {
        name: "description",
        content: "Preencha o briefing em 10 etapas para receber uma proposta personalizada.",
      },
    ],
  }),
  component: BriefingWizard,
});

function BriefingWizard() {
  const navigate = useNavigate();
  const [stepIndex, setStepIndex] = useState(0);
  const [files, setFiles] = useState<PendingFile[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<BriefingFormValues>({
    resolver: zodResolver(briefingSchema),
    defaultValues: defaultBriefingValues,
    mode: "onBlur",
  });

  // Restore draft
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        form.reset({ ...defaultBriefingValues, ...parsed });
      }
    } catch {
      /* ignore */
    }
  }, [form]);

  // Autosave
  useEffect(() => {
    const sub = form.watch((values) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
      } catch {
        /* ignore */
      }
    });
    return () => sub.unsubscribe();
  }, [form]);

  const step = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;
  const progress = Math.round(((stepIndex + 1) / STEPS.length) * 100);

  const stepFieldNames = useMemo(
    () => step.fields.map((f) => f.name),
    [step],
  );

  const goNext = async () => {
    const valid = await form.trigger(stepFieldNames as (keyof BriefingFormValues)[]);
    if (!valid) {
      toast.error("Preencha os campos obrigatórios desta etapa.");
      return;
    }
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goPrev = () => {
    setStepIndex((i) => Math.max(i - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = async (values: BriefingFormValues) => {
    setSubmitting(true);
    try {
      const { data: row, error } = await supabase
        .from("briefings")
        .insert({ ...values, status: "novo" })
        .select("id")
        .single();
      if (error) throw error;

      // Upload files
      if (files.length > 0 && row) {
        for (const pf of files) {
          const path = `${row.id}/${crypto.randomUUID()}-${pf.file.name}`;
          const { error: upErr } = await supabase.storage
            .from("briefing-uploads")
            .upload(path, pf.file, {
              contentType: pf.file.type || undefined,
              upsert: false,
            });
          if (upErr) throw upErr;
          await supabase.from("briefing_files").insert({
            briefing_id: row.id,
            field_key: "identidade_visual",
            file_path: path,
            file_name: pf.file.name,
            mime_type: pf.file.type || null,
            size_bytes: pf.file.size,
          });
        }
      }

      localStorage.removeItem(STORAGE_KEY);
      navigate({ to: "/briefing/sucesso" });
    } catch (e) {
      console.error(e);
      toast.error("Não foi possível enviar o briefing. Tente novamente.");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-white">
      <header className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-brand-border">
        <Link to="/" className="text-base font-semibold tracking-tight">
          BRIEFING<span className="text-brand-primary">.</span>
        </Link>
        <span className="text-xs text-brand-text-muted">
          Etapa {stepIndex + 1} de {STEPS.length} · {progress}%
        </span>
      </header>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <section className="grid lg:grid-cols-[40%_60%] min-h-[calc(100vh-72px)]">
          {/* Left context panel */}
          <aside className="bg-brand-card p-8 md:p-12 lg:p-16 flex flex-col justify-between border-r border-brand-border lg:sticky lg:top-[72px] lg:h-[calc(100vh-72px)]">
            <div>
              <div className="flex flex-wrap gap-1.5 mb-10">
                {STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 w-7 rounded-full transition-colors ${
                      i <= stepIndex ? "bg-brand-primary" : "bg-brand-border"
                    }`}
                  />
                ))}
              </div>
              <span className="text-brand-primary font-medium text-xs tracking-widest uppercase">
                Passo {step.index} / 09
              </span>
              <h2 className="text-3xl md:text-4xl font-semibold mt-4 mb-5 tracking-tight">
                {step.title}
              </h2>
              <p className="text-brand-text-muted leading-relaxed">
                {step.description}
              </p>
            </div>
            <div className="hidden lg:flex items-center gap-4 text-xs text-brand-text-muted mt-10">
              <div className="size-10 rounded-full border border-brand-border grid place-items-center">
                <HelpCircle className="size-4" />
              </div>
              <p>
                Salvamos automaticamente seu progresso neste navegador.
                <br />
                Você pode voltar a qualquer momento.
              </p>
            </div>
          </aside>

          {/* Right form panel */}
          <div className="p-6 md:p-10 lg:p-16 flex items-start lg:items-center bg-brand-bg">
            <div className="w-full max-w-xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-7"
                >
                  {step.fields.map((field) => (
                    <WizardField
                      key={field.name}
                      field={field}
                      control={form.control}
                      errors={form.formState.errors}
                    />
                  ))}

                  {step.upload && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">
                        Arquivos da identidade visual
                      </label>
                      <p className="text-xs text-brand-text-muted">
                        Envie logo, manual da marca ou outros materiais relacionados.
                      </p>
                      <FileDropzone files={files} onChange={setFiles} />
                    </div>
                  )}

                  <div className="flex gap-3 pt-6">
                    <button
                      type="button"
                      onClick={goPrev}
                      disabled={stepIndex === 0 || submitting}
                      className="flex-1 py-3.5 border border-brand-border rounded-xl font-medium hover:bg-brand-card transition-colors disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                    >
                      <ArrowLeft className="size-4" /> Anterior
                    </button>
                    {isLast ? (
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 py-3.5 bg-brand-primary rounded-xl font-medium hover:bg-brand-primary/90 transition-all inline-flex items-center justify-center gap-2 disabled:opacity-60"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="size-4 animate-spin" /> Enviando...
                          </>
                        ) : (
                          <>
                            <Check className="size-4" /> Enviar Briefing
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={goNext}
                        disabled={submitting}
                        className="flex-1 py-3.5 bg-brand-primary rounded-xl font-medium hover:bg-brand-primary/90 transition-all inline-flex items-center justify-center gap-2"
                      >
                        Próximo <ArrowRight className="size-4" />
                      </button>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>
      </form>
    </div>
  );
}
