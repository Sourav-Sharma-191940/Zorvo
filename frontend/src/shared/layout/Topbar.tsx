"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Bell, Clock3, FileText, Plus, Search } from "lucide-react";
import { currentUser, navItems, settingsNav } from "@/shared/config/nav";
import { Badge, Button, IconTile } from "@/shared/ui/primitives";
import { ThemeToggle } from "@/shared/theme/ThemeToggle";
import { Avatar } from "./Nav";
import { MobileNav } from "./MobileNav";
import { QuickAddModal } from "./QuickAddModal";

function usePageTitle(pathname: string): string {
  if (pathname === settingsNav.href) return settingsNav.label;
  const match = navItems
    .filter((item) => item.href !== "/")
    .find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));
  return match?.label ?? "Dashboard";
}

const notifications = [
  { icon: Clock3, tone: "amber", title: "Electricity bill due soon", meta: "Due in 3 days · ₹2,840" },
  { icon: FileText, tone: "rose", title: "Passport renewal", meta: "Expires in 32 days" },
] as const;

export function Topbar() {
  const title = usePageTitle(usePathname());
  const [query, setQuery] = useState("");
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-(--z-topbar) flex h-(--topbar-height) items-center justify-between gap-3 border-b border-border bg-card/92 px-3.5 backdrop-blur-md sm:px-8">
        <div className="flex min-w-0 items-center gap-2.5">
          <MobileNav />
          <div className="truncate text-xl font-bold tracking-tight sm:text-2xl">{title}</div>
        </div>
        <div className="flex items-center gap-1.75 sm:gap-2.5">
          <label className="hidden h-9.5 w-55 items-center gap-2 rounded-md border border-border bg-muted px-2.5 text-subtle-foreground transition focus-within:border-primary-accent focus-within:bg-card focus-within:ring-3 focus-within:ring-ring sm:flex lg:w-70">
            <Search size="1.0625rem" className="shrink-0" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search anything..."
              aria-label="Global search"
              className="w-full min-w-0 bg-transparent text-md text-foreground outline-none placeholder:text-subtle-foreground [&::-webkit-search-cancel-button]:hidden"
            />
            <kbd className="rounded-xs border border-border bg-card px-1.25 py-0.5 text-xs whitespace-nowrap">⌘ K</kbd>
          </label>

          <ThemeToggle />

          <DropdownMenu.Root modal={false}>
            <DropdownMenu.Trigger asChild>
              <Button variant="icon" ariaLabel="Notifications">
                <Bell size="1.1875rem" />
                <span aria-hidden className="absolute top-2 right-2 size-1.5 rounded-full border border-card bg-destructive" />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="end"
                sideOffset={8}
                collisionPadding={8}
                className="z-(--z-dropdown) w-80 max-w-[calc(100vw-1rem)] rounded-lg border border-border bg-popover p-2 text-popover-foreground shadow-menu data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
              >
                <div className="flex items-center justify-between px-2.5 pt-2.25 pb-3 text-base font-bold">
                  Notifications <Badge tone="indigo">3 new</Badge>
                </div>
                {notifications.map(({ icon: Icon, tone, title: itemTitle, meta }) => (
                  <DropdownMenu.Item
                    key={itemTitle}
                    className="flex cursor-pointer items-center gap-2.5 rounded-xs border-t border-border p-2.5 outline-none data-highlighted:bg-accent"
                  >
                    <IconTile tone={tone}>
                      <Icon size="1.0625rem" />
                    </IconTile>
                    <span className="flex flex-col gap-0.75">
                      <strong className="text-sm">{itemTitle}</strong>
                      <small className="text-xs text-muted-foreground">{meta}</small>
                    </span>
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>

          <Button onClick={() => setQuickAddOpen(true)} aria-label="Quick add" className="max-sm:size-11 max-sm:px-0">
            <Plus size="1.0625rem" />
            <span className="max-sm:sr-only">Quick add</span>
          </Button>
          <Avatar initials={currentUser.initials} className="hidden sm:grid" />
        </div>
      </header>
      {quickAddOpen && <QuickAddModal onClose={() => setQuickAddOpen(false)} />}
    </>
  );
}
