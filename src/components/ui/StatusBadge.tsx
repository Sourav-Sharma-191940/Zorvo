import type { Tone } from "./primitives";

/**
 * Single source of truth for how a status label is coloured across the app.
 * Unknown statuses fall back to the neutral slate tone.
 */
const statusTones: Record<string, Tone> = {
  // positive
  Active: "emerald",
  Valid: "emerald",
  Paid: "emerald",
  // informational
  Trial: "indigo",
  Upcoming: "indigo",
  // needs attention soon
  "Expiring soon": "amber",
  "Expiring Soon": "amber",
  "Due soon": "amber",
  // negative
  Expired: "rose",
  Cancelled: "rose",
  Overdue: "rose",
  // inactive
  Paused: "slate",
  Closed: "slate",
};

export const toneForStatus = (status: string): Tone => statusTones[status] ?? "slate";

export function StatusBadge({
  status,
  tone,
  dot = true,
}: {
  status: string;
  /** Override the mapped tone for one-off cases. */
  tone?: Tone;
  dot?: boolean;
}) {
  return (
    <span className={`badge badge-${tone ?? toneForStatus(status)}`}>
      {dot && <span className="mini-status-dot" />}
      {status}
    </span>
  );
}
