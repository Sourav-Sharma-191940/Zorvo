import type { ComponentProps, ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/shared/lib/utils";

/*
 * Form building blocks. Every form in the app is composed from these, so a
 * field's look (height, border, focus ring, error state) is defined once here.
 *
 *   <FormGrid>
 *     <FormRow>
 *       <Field label="Loan name" required error={errors.name}>
 *         <Input invalid={!!errors.name} … />
 *       </Field>
 *       <Field label="Rate" required><AffixInput suffix="%" … /></Field>
 *     </FormRow>
 *   </FormGrid>
 *
 * Works with plain state or React Hook Form (spread `register(...)` onto the control).
 */

/** Vertical stack of fields. */
export function FormGrid({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("grid gap-3", className)}>{children}</div>;
}

/** Two fields side by side on tablets and up; stacked on phones. */
export function FormRow({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("grid grid-cols-1 gap-3 sm:grid-cols-2", className)}>{children}</div>;
}

/** Label + control + error message. Wrapping in <label> links them for screen readers. */
export function Field({
  label,
  required = false,
  optional = false,
  error,
  hint,
  className,
  children,
}: {
  label: ReactNode;
  required?: boolean;
  optional?: boolean;
  /** Error text; shown in red below the control. */
  error?: string | false | null;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={cn("grid content-start gap-1.5 text-2xs font-semibold text-muted-foreground", className)}>
      <span>
        {label}
        {required && <b className="text-destructive"> *</b>}
        {optional && <small className="ml-0.75 font-normal text-subtle-foreground">Optional</small>}
      </span>
      {children}
      {error ? (
        <em role="alert" className="text-3xs font-medium text-destructive not-italic">
          {error}
        </em>
      ) : hint ? (
        <span className="text-3xs font-normal text-subtle-foreground">{hint}</span>
      ) : null}
    </label>
  );
}

const controlClass =
  "h-9.25 w-full min-w-0 rounded-sm border border-input bg-card px-2.5 text-xs text-foreground outline-none transition placeholder:text-subtle-foreground focus:border-primary-accent focus:ring-3 focus:ring-ring disabled:opacity-60 aria-invalid:border-destructive aria-invalid:bg-destructive-soft";

type InvalidProp = { invalid?: boolean };

export function Input({ invalid, className, ...props }: ComponentProps<"input"> & InvalidProp) {
  return <input aria-invalid={invalid || undefined} className={cn(controlClass, className)} {...props} />;
}

export function Textarea({ invalid, className, rows = 3, ...props }: ComponentProps<"textarea"> & InvalidProp) {
  return (
    <textarea
      rows={rows}
      aria-invalid={invalid || undefined}
      className={cn(controlClass, "h-auto resize-y py-2.25", className)}
      {...props}
    />
  );
}

/** Full-width native select for forms (filter toolbars use ui/Select instead). */
export function FormSelect({ invalid, className, children, ...props }: ComponentProps<"select"> & InvalidProp) {
  return (
    <span className="relative flex items-center">
      <select
        aria-invalid={invalid || undefined}
        className={cn(controlClass, "cursor-pointer appearance-none pr-8", className)}
        {...props}
      >
        {children}
      </select>
      <ChevronDown size="0.875rem" className="pointer-events-none absolute right-2.5 text-subtle-foreground" />
    </span>
  );
}

/** Input with a fixed prefix and/or suffix, e.g. "₹" or "% p.a.". */
export function AffixInput({
  prefix,
  suffix,
  invalid,
  className,
  ...props
}: Omit<ComponentProps<"input">, "prefix"> & InvalidProp & { prefix?: ReactNode; suffix?: ReactNode }) {
  return (
    <span
      className={cn(
        "flex h-9.25 items-center overflow-hidden rounded-sm border border-input bg-card text-xs transition focus-within:border-primary-accent focus-within:ring-3 focus-within:ring-ring",
        invalid && "border-destructive bg-destructive-soft",
        className,
      )}
    >
      {prefix && <span className="pl-2.5 text-muted-foreground">{prefix}</span>}
      <input
        aria-invalid={invalid || undefined}
        className="h-full w-full min-w-0 bg-transparent px-2.5 text-foreground outline-none placeholder:text-subtle-foreground"
        {...props}
      />
      {suffix && <span className="pr-2.5 text-muted-foreground">{suffix}</span>}
    </span>
  );
}

/** Checkbox presented as a bordered tile with a title and description. */
export function CheckTile({
  title,
  description,
  checked,
  onChange,
  className,
}: {
  title: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}) {
  return (
    <label
      className={cn(
        "flex min-h-13.5 cursor-pointer items-center gap-2.25 self-end rounded-sm border border-border bg-muted px-2.75 py-2",
        className,
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="size-3.75 shrink-0 accent-primary"
      />
      <span className="flex flex-col gap-0.5">
        <strong className="text-xs text-foreground">{title}</strong>
        {description && <small className="text-3xs font-normal text-subtle-foreground">{description}</small>}
      </span>
    </label>
  );
}
