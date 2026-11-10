"use client";

import { useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
import { Button } from "@/shared/ui/primitives";
import { NavContent } from "./Nav";

/** Phone-only menu button that slides the navigation in from the left. */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger asChild>
        <Button variant="icon" ariaLabel="Open menu" className="sm:hidden">
          <Menu size="1.25rem" />
        </Button>
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-(--z-drawer) bg-overlay-soft backdrop-blur-xs data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="fixed inset-y-0 left-0 z-(--z-drawer) flex w-(--sidebar-width) max-w-[85vw] flex-col border-r border-border bg-card px-4 pt-[calc(1.5rem+env(safe-area-inset-top))] pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-drawer outline-none data-[state=open]:animate-in data-[state=open]:slide-in-from-left-5"
        >
          <DialogPrimitive.Title className="sr-only">Menu</DialogPrimitive.Title>
          <DialogPrimitive.Close asChild>
            <Button variant="icon" ariaLabel="Close menu" className="absolute top-3 right-3">
              <X size="1.125rem" />
            </Button>
          </DialogPrimitive.Close>
          <NavContent onNavigate={() => setOpen(false)} />
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
