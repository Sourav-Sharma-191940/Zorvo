"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Bell, Clock3, FileText, Plus, Search } from "lucide-react";
import { currentUser, navItems, settingsNav } from "@/lib/nav";
import { Badge, Button } from "@/components/ui/primitives";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { QuickAddModal } from "./QuickAddModal";

function usePageTitle(pathname: string): string {
  if (pathname === settingsNav.href) return settingsNav.label;
  const match = navItems
    .filter((item) => item.href !== "/")
    .find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));
  return match?.label ?? "Dashboard";
}

export function Topbar() {
  const pathname = usePathname();
  const title = usePageTitle(pathname);
  const [query, setQuery] = useState("");
  const [noticesOpen, setNoticesOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  return (
    <>
      <header className="topbar">
        <div className="page-title">{title}</div>
        <div className="header-actions">
          <label className="search">
            <Search size="1.0625rem" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search anything..."
              aria-label="Global search"
            />
            <kbd>⌘ K</kbd>
          </label>
          <ThemeToggle />
          <div className="notification-wrap">
            <Button
              variant="icon"
              ariaLabel="Notifications"
              onClick={() => setNoticesOpen(!noticesOpen)}
            >
              <Bell size="1.1875rem" />
              <span className="notification-dot" />
            </Button>
            {noticesOpen && (
              <div className="notification-menu">
                <div className="notification-title">
                  Notifications <Badge tone="indigo">3 new</Badge>
                </div>
                <div className="notification-item">
                  <span className="icon-tile icon-amber">
                    <Clock3 size="1.0625rem" />
                  </span>
                  <span>
                    <strong>Electricity bill due soon</strong>
                    <small>Due in 3 days · ₹2,840</small>
                  </span>
                </div>
                <div className="notification-item">
                  <span className="icon-tile icon-rose">
                    <FileText size="1.0625rem" />
                  </span>
                  <span>
                    <strong>Passport renewal</strong>
                    <small>Expires in 32 days</small>
                  </span>
                </div>
              </div>
            )}
          </div>
          <Button onClick={() => setQuickAddOpen(true)}>
            <Plus size="1.0625rem" />
            <span>Quick add</span>
          </Button>
          <span className="avatar avatar-header">{currentUser.initials}</span>
        </div>
      </header>
      {quickAddOpen && <QuickAddModal onClose={() => setQuickAddOpen(false)} />}
    </>
  );
}
