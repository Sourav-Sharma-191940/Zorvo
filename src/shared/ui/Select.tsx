import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";

/**
 * Compact native-select control used across feature toolbars. Styling lives in
 * shell.css (`.ui-select`) so it ships on every route.
 */
export function Select({
  value,
  onChange,
  children,
  label,
  className = "",
}: {
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  label: string;
  className?: string;
}) {
  return (
    <label className={`ui-select ${className}`.trim()}>
      <select value={value} onChange={(event) => onChange(event.target.value)} aria-label={label}>
        {children}
      </select>
      <ChevronDown size="0.875rem" />
    </label>
  );
}
