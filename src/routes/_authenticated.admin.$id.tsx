import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Download, Loader2, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { STEPS, FIELD_LABELS } from "@/lib/briefing-schema";
import { STATUS_LABELS, STATUS_LIST, type BriefingStatus } from "@/lib/status";
import { StatusBadge } from "@/components/admin/StatusBadge";

export const Route = createFileRoute("/_authenticated/admin/$id")({
  head: () => ({ meta: [{ title: "Detalhe do briefing" }, { name: "robots", content: "noindex" }] }),
  component: BriefingDetail,
});

type BriefingRecord = Record<string, unknown> & {
  id: string;
  status: BriefingStatus;
  empresa: string;
  responsavel: string;
  data_briefing: string;
  created_at: string;
};
type FileRow = {
  id: string;
  file_path: string;
  file_name: string;
  mime_type: string | null;
  size_bytes: number | null;
};

function BriefingDetail() {
  const { id } = useParams({ from: "/_authenticated/admin/$id" });
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["briefing", id],
    queryFn: async () => {
      const [{ data: b, error: bErr }, { data: files, error: fErr }] = await Promise.all([
        supabase.from("briefings").select("*").eq("id", id).single(),
        supabase.from("briefing_files").select("*").eq("briefing_id", id),
      ]);
      if (bErr) throw bErr;
      if (fErr) throw fErr;
      return { briefing: b as BriefingRecord, files: (files ?? []) as FileRow[] };
    },
  });

  useEffect(() => {
    if (data?.briefing) {
      const v: Record<string, string> = {};
      for (const [k, val] of Object.entries(data.briefing)) {
        if (typeof val === "string") v[k] = val;
        else if (val == null) v[k] = "";
        else v[k] = String(val);
      }
      setValues(v);
    }
  }, [data]);

  const save = async () => {
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {};
      const allKeys = [
        "empresa",
        "responsavel",
        "data_briefing",
        ...STEPS.flatMap((s) => s.fields.map((f) => f.name as string)),
      ];
      for (const k of allKeys) payload[k] = values[k] ?? "";
      const { error } = await supabase.from("briefings").update(payload).eq("id", id);
      if (error) throw error;
      toast.success("Respostas atualizadas.");
      qc.invalidateQueries({ queryKey: ["briefing", id] });
      qc.invalidateQueries({ queryKey: ["briefings"] });
    } catch (e) {
      console.error(e);
      toast.error("Falha ao salvar.");
    } finally {
      setSaving(false);
    }
  };

  const changeStatus = async (status: BriefingStatus) => {
    const { error } = await supabase.from("briefings").update({ status }).eq("id", id);
    if (error) {
      toast.error("Não foi possível alterar o status.");
      return;
    }
    toast.success(`Status alterado para ${STATUS_LABELS[status]}.`);
    qc.invalidateQueries({ queryKey: ["briefing", id] });
    qc.invalidateQueries({ queryKey: ["briefings"] });
  };

  const handleDelete = async () => {
    try {
      if (data?.files?.length) {
        await supabase.storage.from("briefing-uploads").remove(data.files.map((f) => f.file_path));
      }
      const { error } = await supabase.from("briefings").delete().eq("id", id);
      if (error) throw error;
      toast.success("Briefing excluído.");
      qc.invalidateQueries({ queryKey: ["briefings"] });
      navigate({ to: "/admin" });
    } catch (e) {
      console.error(e);
      toast.error("Falha ao excluir.");
    }
  };

  const downloadFile = async (path: string) => {
    const { data: signed, error } = await supabase.storage
      .from("briefing-uploads")
      .createSignedUrl(path, 60);
    if (error || !signed) {
      toast.error("Não foi possível gerar o link.");
      return;
    }
    window.open(signed.signedUrl, "_blank");
  };

  if (isLoading || !data) {
    return (
      <div className="p-10 text-brand-text-muted flex items-center gap-2">
        <Loader2 className="size-4 animate-spin" /> Carregando...
      </div>
    );
  }

  const b = data.briefing;

  return (
    <div className="p-6 md:p-10 max-w-5xl">
      <Link
        to="/admin"
        className="inline-flex items-center gap-2 text-sm text-brand-text-muted hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="size-4" /> Voltar
      </Link>

      <header className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight truncate">
            {b.empresa}
          </h1>
          <p className="text-sm text-brand-text-muted mt-1">
            {b.responsavel} ·{" "}
            {new Date(b.created_at).toLocaleString("pt-BR", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <div className="mt-3">
            <StatusBadge status={b.status} />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={b.status}
            onChange={(e) => changeStatus(e.target.value as BriefingStatus)}
            className="px-3 py-2 bg-brand-card border border-brand-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
          >
            {STATUS_LIST.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
          <button
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary hover:bg-brand-primary/90 rounded-lg text-sm font-medium disabled:opacity-60"
          >
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            Salvar
          </button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive border border-destructive/30 hover:bg-destructive/20 rounded-lg text-sm font-medium">
                <Trash2 className="size-4" /> Excluir
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir este briefing?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. Todas as respostas e arquivos
                  serão removidos.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-white hover:bg-destructive/90"
                >
                  Sim, excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </header>

      <div className="space-y-6">
        {STEPS.map((step) => (
          <section
            key={step.id}
            className="bg-brand-card border border-brand-border rounded-2xl p-6 md:p-8"
          >
            <div className="flex items-baseline gap-3 mb-5">
              <span className="text-xs font-semibold tracking-widest text-brand-primary uppercase">
                {step.index}
              </span>
              <h2 className="text-lg font-semibold tracking-tight">{step.title}</h2>
            </div>
            <div className="space-y-5">
              {step.fields.map((f) => (
                <div key={f.name} className="space-y-1.5">
                  <label className="block text-xs font-medium uppercase tracking-wider text-brand-text-muted">
                    {FIELD_LABELS[f.name as string] ?? f.label}
                  </label>
                  {f.type === "textarea" ? (
                    <textarea
                      value={values[f.name as string] ?? ""}
                      onChange={(e) =>
                        setValues((v) => ({ ...v, [f.name as string]: e.target.value }))
                      }
                      rows={3}
                      className="w-full px-3 py-2 bg-brand-bg border border-brand-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary resize-y"
                    />
                  ) : (
                    <input
                      type={f.type === "date" ? "date" : "text"}
                      value={values[f.name as string] ?? ""}
                      onChange={(e) =>
                        setValues((v) => ({ ...v, [f.name as string]: e.target.value }))
                      }
                      className="w-full px-3 py-2 bg-brand-bg border border-brand-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
                    />
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}

        <section className="bg-brand-card border border-brand-border rounded-2xl p-6 md:p-8">
          <h2 className="text-lg font-semibold tracking-tight mb-5">Anexos</h2>
          {data.files.length === 0 ? (
            <p className="text-sm text-brand-text-muted">Nenhum arquivo enviado.</p>
          ) : (
            <ul className="space-y-2">
              {data.files.map((f) => (
                <li
                  key={f.id}
                  className="flex items-center gap-3 px-3 py-2.5 bg-brand-bg border border-brand-border rounded-lg text-sm"
                >
                  <span className="truncate flex-1">{f.file_name}</span>
                  {f.size_bytes && (
                    <span className="text-xs text-brand-text-muted shrink-0">
                      {(f.size_bytes / 1024).toFixed(0)} KB
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => downloadFile(f.file_path)}
                    className="inline-flex items-center gap-1.5 text-brand-primary hover:underline text-xs font-medium"
                  >
                    <Download className="size-3.5" /> Baixar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
