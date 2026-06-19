export type BriefingStatus =
  | "novo"
  | "em_analise"
  | "proposta_enviada"
  | "em_desenvolvimento"
  | "concluido";

export const STATUS_LABELS: Record<BriefingStatus, string> = {
  novo: "Novo",
  em_analise: "Em Análise",
  proposta_enviada: "Proposta Enviada",
  em_desenvolvimento: "Em Desenvolvimento",
  concluido: "Concluído",
};

export const STATUS_LIST: BriefingStatus[] = [
  "novo",
  "em_analise",
  "proposta_enviada",
  "em_desenvolvimento",
  "concluido",
];

export const STATUS_STYLES: Record<BriefingStatus, string> = {
  novo: "bg-primary/10 text-primary border-primary/20",
  em_analise: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  proposta_enviada: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  em_desenvolvimento: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  concluido: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};
