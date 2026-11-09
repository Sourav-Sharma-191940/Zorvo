"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";
import { currentUser, navItems, settingsNav } from "@/lib/nav";

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar() {
  const pathname = usePathname();
  const SettingsIcon = settingsNav.icon;

  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark">
          <Sparkles size="1.1875rem" fill="currentColor" />
        </span>
        <span>
          <strong>Personal</strong>
          <small>Command Center</small>
        </span>
      </div>

      <nav className="nav" aria-label="Primary navigation">
        <div className="nav-label">Workspace</div>
        {navItems.map(({ label, icon: Icon, href, count }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={label}
              href={href}
              className={`nav-item ${active ? "active" : ""}`.trim()}
              aria-current={active ? "page" : undefined}
            >
              <Icon size="1.125rem" strokeWidth={1.8} />
              <span>{label}</span>
              {count ? <span className="nav-count">{count}</span> : null}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        <Link
          href={settingsNav.href}
          className={`nav-item ${isActive(pathname, settingsNav.href) ? "active" : ""}`.trim()}
        >
          <SettingsIcon size="1.125rem" />
          <span>Settings</span>
        </Link>
        <div className="profile">
          <span className="avatar">{currentUser.initials}</span>
          <span className="profile-copy">
            <strong>{currentUser.name}</strong>
            <small>{currentUser.email}</small>
          </span>
        </div>
      </div>
    </aside>
  );
}
