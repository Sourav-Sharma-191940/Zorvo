"use client";

import { Fragment } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { MoreHorizontal, type LucideIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export interface ActionMenuItem {
  label: string;
  icon: LucideIcon;
  onSelect: () => void;
  /** Destructive items render in red and are separated by a divider. */
  danger?: boolean;
}

/**
 * Row "..." menu, built on Radix: rendered in a portal (never clipped by a
 * scrolling table), flips to stay on screen, and has full keyboard support
 * (arrows, Home/End, typeahead, Escape) with focus returned to the trigger.
 */
export function ActionMenu({ label, items }: { label: string; items: ActionMenuItem[] }) {
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger
        aria-label={label}
        // The menu usually sits inside a clickable table row.
        onClick={(event) => event.stopPropagation()}
        className="grid size-7.5 place-items-center rounded-sm text-subtle-foreground transition outline-none hover:bg-secondary hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring data-[state=open]:bg-secondary data-[state=open]:text-foreground max-sm:size-10"
      >
        <MoreHorizontal size="1.125rem" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={6}
          collisionPadding={8}
          // React events bubble through portals; keep clicks from reaching the row.
          onClick={(event) => event.stopPropagation()}
          className="z-(--z-menu) w-44 rounded-md border border-border bg-popover p-1.25 text-popover-foreground shadow-menu data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1"
        >
          {items.map((item, index) => {
            const Icon = item.icon;
            const needsDivider = item.danger && index > 0 && !items[index - 1].danger;
            return (
              <Fragment key={item.label}>
                {needsDivider && <DropdownMenu.Separator className="-mx-1.25 my-1 h-px bg-border" />}
                <DropdownMenu.Item
                  onSelect={item.onSelect}
                  className={cn(
                    "flex h-7.75 cursor-pointer items-center gap-2 rounded-xs px-2.25 text-2xs text-muted-foreground outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground max-sm:h-10",
                    item.danger && "text-destructive data-highlighted:text-destructive",
                  )}
                >
                  <Icon size="0.875rem" />
                  {item.label}
                </DropdownMenu.Item>
              </Fragment>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
