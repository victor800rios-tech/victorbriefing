import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Search, ArrowUpDown, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { STATUS_LABELS, STATUS_LIST, type BriefingStatus } from "@/lib/status";
import { StatusBadge } from "@/components/admin/StatusBadge";

type BriefingRow = {
  id: string;
  empresa: string;
  responsavel: string;
  created_at: string;
  status: BriefingStatus;
};

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Painel Administrativo" }, { name: "robots", content: "noindex" }] }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<BriefingStatus | "all">("all");
  const [sortDesc, setSortDesc] = useState(true);

  const { data, isLoading } = useQuery({
    queryKey: ["briefings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("briefings")
        .select("id, empresa, responsavel, created_at, status")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as BriefingRow[];
    },
  });

  const rows = data ?? [];

  const metrics = useMemo(() => {
    const base: Record<BriefingStatus | "total", number> = {
      total: rows.length,
      novo: 0,
      em_analise: 0,
      proposta_enviada: 0,
      em_desenvolvimento: 0,
      concluido: 0,
    };
    for (const r of rows) base[r.status]++;
    return base;
  }, [rows]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let r = rows;
    if (statusFilter !== "all") r = r.filter((x) => x.status === statusFilter);
    if (q)
      r = r.filter(
        (x) =>
          x.empresa.toLowerCase().includes(q) ||
          x.responsavel.toLowerCase().includes(q),
      );
    r = [...r].sort((a, b) =>
      sortDesc
        ? b.created_at.localeCompare(a.created_at)
        : a.created_at.localeCompare(b.created_at),
    );
    return r;
  }, [rows, search, statusFilter, sortDesc]);

  const metricItems: { key: keyof typeof metrics; label: string }[] = [
    { key: "total", label: "Total" },
    { key: "novo", label: "Novos" },
    { key: "em_analise", label: "Em Análise" },
    { key: "proposta_enviada", label: "Proposta Enviada" },
    { key: "em_desenvolvimento", label: "Em Desenvolvimento" },
    { key: "concluido", label: "Concluídos" },
  ];

  return (
    <div className="p-6 md:p-10">
      <header className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Painel Administrativo
          </h1>
          <p className="text-sm text-brand-text-muted mt-1">
            Gerencie todos os briefings recebidos.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
        {metricItems.map((m, i) => (
          <motion.div
            key={m.key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
            className="bg-brand-card border border-brand-border p-5 rounded-2xl"
          >
            <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-text-muted mb-3">
              {m.label}
            </p>
            <p className="text-3xl font-semibold tabular-nums">
              {String(metrics[m.key]).padStart(2, "0")}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 p-4 border-b border-brand-border">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por empresa ou responsável..."
              className="w-full pl-9 pr-3 py-2 bg-brand-bg border border-brand-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as BriefingStatus | "all")}
            className="px-3 py-2 bg-brand-bg border border-brand-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
          >
            <option value="all">Todos os status</option>
            {STATUS_LIST.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
          <button
            onClick={() => setSortDesc((v) => !v)}
            className="inline-flex items-center gap-2 px-3 py-2 bg-brand-bg border border-brand-border rounded-lg text-sm hover:border-brand-primary/50 transition-colors"
          >
            <ArrowUpDown className="size-3.5" />
            Data {sortDesc ? "↓" : "↑"}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-brand-border bg-brand-bg/30">
                <th className="px-6 py-3.5 text-[10px] font-semibold uppercase tracking-widest text-brand-text-muted">
                  Empresa
                </th>
                <th className="px-6 py-3.5 text-[10px] font-semibold uppercase tracking-widest text-brand-text-muted">
                  Responsável
                </th>
                <th className="px-6 py-3.5 text-[10px] font-semibold uppercase tracking-widest text-brand-text-muted">
                  Data de envio
                </th>
                <th className="px-6 py-3.5 text-[10px] font-semibold uppercase tracking-widest text-brand-text-muted">
                  Status
                </th>
                <th className="px-6 py-3.5 text-[10px] font-semibold uppercase tracking-widest text-brand-text-muted text-right">
                  Ação
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {isLoading && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-brand-text-muted">
                    Carregando...
                  </td>
                </tr>
              )}
              {!isLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-brand-text-muted">
                    Nenhum briefing encontrado.
                  </td>
                </tr>
              )}
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-brand-bg/40 transition-colors">
                  <td className="px-6 py-4 font-medium">{r.empresa}</td>
                  <td className="px-6 py-4 text-brand-text-muted">{r.responsavel}</td>
                  <td className="px-6 py-4 text-brand-text-muted">
                    {new Date(r.created_at).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to="/admin/$id"
                      params={{ id: r.id }}
                      className="inline-flex items-center gap-1.5 text-brand-primary hover:underline text-sm font-medium"
                    >
                      <Eye className="size-3.5" /> Visualizar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
