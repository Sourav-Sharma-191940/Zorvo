import type { ReactNode } from "react";
import "./shell.css";
import "./data-table.css";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

/**
 * App chrome shared by every authenticated page: fixed sidebar + sticky topbar,
 * with the routed page rendered inside `.content`.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main">
        <Topbar />
        <div className="content">{children}</div>
      </main>
    </div>
  );
}
