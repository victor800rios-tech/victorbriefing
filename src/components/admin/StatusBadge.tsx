import { STATUS_LABELS, STATUS_STYLES, type BriefingStatus } from "@/lib/status";

export function StatusBadge({ status }: { status: BriefingStatus }) {
  return (
    <span
      className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
