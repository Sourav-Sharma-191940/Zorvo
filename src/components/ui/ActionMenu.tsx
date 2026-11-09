"use client";

import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MoreHorizontal, type LucideIcon } from "lucide-react";

export interface ActionMenuItem {
  label: string;
  icon: LucideIcon;
  onSelect: () => void;
  /** Destructive items render in rose and are separated by a divider. */
  danger?: boolean;
}

const MENU_WIDTH = 176;
const GAP = 6;
const EDGE = 8;

/**
 * Row "..." menu. The menu is portalled to <body> with fixed positioning so it
 * can never be clipped by a scrolling table container, and it flips upward when
 * there is not enough room below the trigger.
 */
export function ActionMenu({ label, items }: { label: string; items: ActionMenuItem[] }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Position before paint, writing styles directly to avoid a second render.
  useLayoutEffect(() => {
    const trigger = triggerRef.current;
    const menu = menuRef.current;
    if (!open || !trigger || !menu) return;
    const rect = trigger.getBoundingClientRect();
    const height = menu.offsetHeight;
    const fitsBelow = window.innerHeight - rect.bottom >= height + GAP + EDGE;
    const top = fitsBelow || rect.top < height + GAP ? rect.bottom + GAP : rect.top - height - GAP;
    const left = Math.min(
      Math.max(EDGE, rect.right - MENU_WIDTH),
      window.innerWidth - MENU_WIDTH - EDGE,
    );
    menu.style.top = `${top}px`;
    menu.style.left = `${left}px`;
  }, [open]);

  // Close on outside click, Escape, scroll, or resize.
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (menuRef.current?.contains(target) || triggerRef.current?.contains(target)) return;
      close();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      close();
      triggerRef.current?.focus();
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", close);
    window.addEventListener("scroll", close, true);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", close);
      window.removeEventListener("scroll", close, true);
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="row-action"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={(event) => {
          event.stopPropagation();
          setOpen((value) => !value);
        }}
      >
        <MoreHorizontal size="1.125rem" />
      </button>
      {open &&
        createPortal(
          // React events bubble through portals, so stop clicks reaching the row.
          <div
            ref={menuRef}
            className="ui-menu"
            role="menu"
            onClick={(event) => event.stopPropagation()}
          >
            {items.map((item, index) => {
              const Icon = item.icon;
              const needsDivider = item.danger && index > 0 && !items[index - 1].danger;
              return (
                <Fragment key={item.label}>
                  {needsDivider && <div className="menu-divider" />}
                  <button
                    type="button"
                    role="menuitem"
                    className={item.danger ? "danger-action" : undefined}
                    onClick={() => {
                      setOpen(false);
                      item.onSelect();
                    }}
                  >
                    <Icon size="0.875rem" />
                    {item.label}
                  </button>
                </Fragment>
              );
            })}
          </div>,
          document.body,
        )}
    </>
  );
}
