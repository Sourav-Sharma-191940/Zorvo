import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

/*
 * List-view table used by every feature. On tablets and up it's a normal table
 * (scrolls sideways if needed); on phones each row becomes a card: the
 * `primary` cell spans the top, other cells stack with their `label` as a
 * caption, and the `actions` cell pins to the top-right corner.
 *
 *   <DataTable className="sm:min-w-205">
 *     <THead><TH>Name</TH><TH>Status</TH><TH><span className="sr-only">Actions</span></TH></THead>
 *     <TBody>
 *       <TR interactive onClick={…}>
 *         <TD primary><CellMain icon={…} title="Netflix" subtitle="Premium" /></TD>
 *         <TD label="Status"><StatusBadge status="Active" /></TD>
 *         <TD actions><ActionMenu … /></TD>
 *       </TR>
 *     </TBody>
 *   </DataTable>
 */

export function DataTable({ className, children, ...props }: ComponentProps<"table">) {
  return (
    <div className="overflow-x-auto border-t border-border max-sm:overflow-visible max-sm:bg-background">
      <table className={cn("w-full border-collapse text-xs max-sm:block", className)} {...props}>
        {children}
      </table>
    </div>
  );
}

export function THead({ children }: { children: ReactNode }) {
  return (
    <thead className="max-sm:hidden">
      <tr>{children}</tr>
    </thead>
  );
}

export function TH({ className, align = "left", ...props }: ComponentProps<"th"> & { align?: "left" | "right" }) {
  return (
    <th
      className={cn(
        "h-9.5 border-b border-border bg-muted px-3 text-2xs font-semibold whitespace-nowrap text-subtle-foreground first:pl-4",
        align === "right" ? "text-right" : "text-left",
        className,
      )}
      {...props}
    />
  );
}

export function TBody({ className, ...props }: ComponentProps<"tbody">) {
  return <tbody className={cn("max-sm:grid max-sm:gap-2 max-sm:p-2.5", className)} {...props} />;
}

export function TR({ interactive = false, className, ...props }: ComponentProps<"tr"> & { interactive?: boolean }) {
  return (
    <tr
      className={cn(
        "last:*:border-b-0",
        "max-sm:relative max-sm:grid max-sm:grid-cols-[1fr_auto] max-sm:content-start max-sm:gap-x-3 max-sm:gap-y-2.25 max-sm:rounded-md max-sm:border max-sm:border-border max-sm:bg-card max-sm:p-3 max-sm:shadow-card",
        interactive && "cursor-pointer transition-colors hover:bg-muted",
        className,
      )}
      {...props}
    />
  );
}

export function TD({
  label,
  primary = false,
  actions = false,
  hideOnMobile = false,
  align = "left",
  className,
  children,
  ...props
}: ComponentProps<"td"> & {
  /** Caption shown above the value on phones. */
  label?: string;
  /** Main cell (name/title): spans the full card width on phones. */
  primary?: boolean;
  /** Row actions: pinned to the card's top-right corner on phones. */
  actions?: boolean;
  hideOnMobile?: boolean;
  align?: "left" | "right";
}) {
  return (
    <td
      className={cn(
        "h-15.5 border-b border-border px-3 align-middle whitespace-nowrap text-muted-foreground sm:first:pl-4",
        "max-sm:block max-sm:h-auto max-sm:min-w-0 max-sm:border-0 max-sm:p-0 max-sm:whitespace-normal",
        align === "right" && "text-right",
        primary && "text-foreground max-sm:col-span-full max-sm:border-b max-sm:border-border max-sm:pr-8.5 max-sm:pb-2.25",
        actions && "w-12 text-center max-sm:absolute max-sm:top-3 max-sm:right-3 max-sm:w-auto",
        hideOnMobile && "max-sm:hidden",
        className,
      )}
      {...props}
    >
      {label && !primary && !actions && (
        <span className="mb-1 hidden text-3xs tracking-wider text-subtle-foreground uppercase max-sm:block">
          {label}
        </span>
      )}
      {children}
    </td>
  );
}

/** Icon/logo + title + subtitle, vertically centred even when other cells wrap. */
export function CellMain({ icon, title, subtitle }: { icon?: ReactNode; title: ReactNode; subtitle?: ReactNode }) {
  return (
    <span className="inline-flex max-w-full items-center gap-2.5 align-middle">
      {icon}
      <span className="inline-flex min-w-0 flex-col gap-0.5">
        <strong className="truncate text-xs font-bold text-foreground">{title}</strong>
        {subtitle && <small className="text-2xs text-subtle-foreground">{subtitle}</small>}
      </span>
    </span>
  );
}

/** Two-line value, e.g. amount + frequency. */
export function CellStack({ primary, secondary }: { primary: ReactNode; secondary?: ReactNode }) {
  return (
    <>
      <strong className="block text-xs text-foreground">{primary}</strong>
      {secondary && <small className="mt-0.5 block text-3xs text-subtle-foreground">{secondary}</small>}
    </>
  );
}
