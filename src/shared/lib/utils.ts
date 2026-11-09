import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge must know our theme's scale names (src/styles/theme.css) so
 * that e.g. `text-2xs` is treated as a font size, not a colour, when merging.
 * Keep these lists in sync when adding a size to the theme.
 */
const twMerge = extendTailwindMerge({
  override: {
    theme: {
      text: ["3xs", "2xs", "xs", "sm", "md", "base", "lg", "xl", "2xl", "3xl", "4xl", "5xl"],
      radius: ["xs", "sm", "md", "lg", "xl"],
      shadow: ["card", "raised", "menu", "toast", "drawer", "modal"],
    },
  },
});

/** Join class names, letting later Tailwind classes override earlier ones. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
