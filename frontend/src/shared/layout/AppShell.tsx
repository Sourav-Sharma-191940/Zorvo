import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

/**
 * App chrome shared by every authenticated page: fixed sidebar (or phone menu)
 * + sticky topbar, with the routed page in a width-limited content column.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh bg-background">
      <Sidebar />
      <main className="min-w-0 flex-1 sm:ml-(--sidebar-width-collapsed) md:ml-(--sidebar-width)">
        <Topbar />
        <div className="mx-auto max-w-(--content-max-width) px-3 pt-4.5 pb-7 sm:px-8 sm:pt-7.5 sm:pb-11">
          {children}
        </div>
      </main>
    </div>
  );
}
