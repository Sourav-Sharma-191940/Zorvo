import { categoryBreakdown, formatCurrency } from "../data";

/** Theme colour for each category colour name in the data. */
const colorVar: Record<string, string> = {
  indigo: "var(--primary-accent)",
  emerald: "var(--success)",
  amber: "var(--chart-amber)",
  blue: "var(--chart-blue)",
  rose: "var(--chart-rose)",
  slate: "var(--chart-slate)",
};

const colorFor = (name: string) => colorVar[name] ?? colorVar.slate;

/** Builds a conic-gradient with one slice per category, sized by its share of the total. */
function donutGradient(total: number) {
  let start = 0;
  const stops = categoryBreakdown.map((item) => {
    const end = start + (item.amount / total) * 100;
    const stop = `${colorFor(item.color)} ${start.toFixed(2)}% ${end.toFixed(2)}%`;
    start = end;
    return stop;
  });
  return `conic-gradient(${stops.join(", ")})`;
}

export function CategoryDonut() {
  const total = categoryBreakdown.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="flex flex-col items-center gap-4.5 pt-7 pb-3.75 xs:flex-row sm:h-61.25 sm:justify-center sm:gap-6.5 sm:py-0 lg:h-68.75 lg:justify-start">
      <div
        role="img"
        aria-label={`Spending by category, ${formatCurrency(total)} in total`}
        className="relative grid size-27 shrink-0 place-items-center rounded-full xs:size-30.5 sm:size-35.5"
        style={{ background: donutGradient(total) }}
      >
        <span aria-hidden className="absolute inset-3.75 rounded-full bg-card sm:inset-4.5" />
        <div className="z-1 flex flex-col items-center">
          <strong className="text-base tracking-tight xs:text-2xl">{formatCurrency(total)}</strong>
          <span className="mt-0.5 text-3xs text-subtle-foreground">Total spent</span>
        </div>
      </div>
      <ul className="grid w-full gap-2.25 xs:w-auto xs:flex-1 sm:max-w-77.5 sm:gap-3 lg:max-w-none">
        {categoryBreakdown.map((item) => (
          <li
            key={item.name}
            className="grid grid-cols-[0.4375rem_minmax(0,1fr)_auto] items-center gap-1.75 text-2xs text-muted-foreground"
          >
            <i
              aria-hidden
              className="size-1.75 rounded-xs"
              style={{ background: colorFor(item.color) }}
            />
            <span>{item.name}</span>
            <strong className="text-2xs font-semibold text-foreground">
              {formatCurrency(item.amount)}
            </strong>
          </li>
        ))}
      </ul>
    </div>
  );
}
