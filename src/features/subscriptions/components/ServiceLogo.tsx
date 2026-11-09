import type { Subscription } from "../data";

export function ServiceLogo({ item, small = false }: { item: Subscription; small?: boolean }) {
  return (
    <span className={`service-logo service-${item.brand} ${small ? "small" : ""}`.trim()}>
      {item.initials}
    </span>
  );
}
