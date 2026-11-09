"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { currentUser, navItems, settingsNav, type NavItem } from "@/shared/config/nav";

/*
 * Navigation shared by the desktop sidebar and the phone menu sheet.
 * `collapsible` = sidebar mode: icon-only on tablets, full labels from md up.
 * Without it (phone sheet) labels always show.
 */

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Brand({ collapsible = false }: { collapsible?: boolean }) {
  return (
    <div className={cn("flex h-12 items-center gap-2.75 px-2", collapsible && "max-md:justify-center max-md:px-0")}>
      <span className="grid size-8.5 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground shadow-raised">
        <Sparkles size="1.1875rem" fill="currentColor" />
      </span>
      <span className={cn("flex flex-col gap-0.5", collapsible && "max-md:hidden")}>
        <strong className="text-lg leading-4 tracking-tight">Personal</strong>
        <small className="text-sm leading-3.5 text-muted-foreground">Command Center</small>
      </span>
    </div>
  );
}

function NavLink({
  item,
  active,
  collapsible,
  onNavigate,
}: {
  item: Pick<NavItem, "label" | "icon" | "href" | "count">;
  active: boolean;
  collapsible: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      title={collapsible ? item.label : undefined}
      className={cn(
        "relative flex h-10.5 items-center gap-3 rounded-md px-2.75 text-base font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground",
        collapsible && "max-md:justify-center max-md:px-0",
        active && "bg-primary-soft font-semibold text-primary-strong hover:bg-primary-soft hover:text-primary-strong",
      )}
    >
      <Icon size="1.125rem" strokeWidth={1.8} className="shrink-0" />
      <span className={cn(collapsible && "max-md:sr-only")}>{item.label}</span>
      {item.count ? (
        <span
          className={cn(
            "ml-auto grid h-5 min-w-5 place-items-center rounded-md bg-primary-muted text-xs font-bold text-primary-strong",
            collapsible && "max-md:absolute max-md:top-0.5 max-md:right-1 max-md:h-3.75 max-md:min-w-3.75 max-md:text-3xs",
          )}
        >
          {item.count}
        </span>
      ) : null}
    </Link>
  );
}

export function Avatar({ initials, className }: { initials: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-8.5 shrink-0 place-items-center rounded-full border-2 border-card bg-primary-muted text-sm font-bold text-primary-strong ring-1 ring-border",
        className,
      )}
    >
      {initials}
    </span>
  );
}

export function NavContent({ collapsible = false, onNavigate }: { collapsible?: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <>
      <Brand collapsible={collapsible} />
      <nav className="mt-7 flex flex-col gap-1" aria-label="Primary navigation">
        <h6 className={cn("px-2.75 pb-2", collapsible && "max-md:hidden")}>Workspace</h6>
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            active={isActive(pathname, item.href)}
            collapsible={collapsible}
            onNavigate={onNavigate}
          />
        ))}
      </nav>
      <div className="mt-auto border-t border-border pt-2">
        <NavLink
          item={settingsNav}
          active={isActive(pathname, settingsNav.href)}
          collapsible={collapsible}
          onNavigate={onNavigate}
        />
        <div
          className={cn(
            "mt-2.25 flex items-center gap-2.5 px-2 pt-2.5 pb-0.5",
            collapsible && "max-md:justify-center max-md:px-0",
          )}
        >
          <Avatar initials={currentUser.initials} />
          <span className={cn("flex min-w-0 flex-1 flex-col gap-0.5", collapsible && "max-md:hidden")}>
            <strong className="text-md font-semibold text-foreground">{currentUser.name}</strong>
            <small className="truncate text-xs text-subtle-foreground">{currentUser.email}</small>
          </span>
        </div>
      </div>
    </>
  );
}
