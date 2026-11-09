import { NavContent } from "./Nav";

/** Fixed left sidebar: hidden on phones (see MobileNav), icon-only on tablets, full from md up. */
export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-(--z-sidebar) hidden w-(--sidebar-width-collapsed) flex-col border-r border-border bg-card px-3 pt-6 pb-4 sm:flex md:w-(--sidebar-width) md:px-4">
      <NavContent collapsible />
    </aside>
  );
}
