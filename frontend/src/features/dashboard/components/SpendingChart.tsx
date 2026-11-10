const yLabels = ["₹80k", "₹60k", "₹40k", "₹20k", "₹0"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
/** Horizontal grid lines; the last one sits on the x-axis, above the month labels. */
const gridLines = ["top-0", "top-1/4", "top-1/2", "top-3/4", "bottom-6"];

export function SpendingChart() {
  return (
    <div
      className="mt-2.5 flex h-47.5 sm:mt-3.75 sm:h-57"
      aria-label="Monthly spending from January to June"
    >
      <div className="flex w-10.5 flex-col justify-between pb-6 text-2xs text-subtle-foreground">
        {yLabels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <div className="relative flex-1">
        {gridLines.map((position) => (
          <div
            key={position}
            className={`absolute inset-x-0 border-t border-dashed border-border ${position}`}
          />
        ))}
        <svg
          viewBox="0 0 680 220"
          preserveAspectRatio="none"
          role="img"
          aria-label="Spending trend chart"
          className="absolute inset-x-0 top-0 h-[calc(100%-1.5rem)] w-full overflow-visible"
        >
          <defs>
            <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary-accent)" stopOpacity="0.18" />
              <stop offset="100%" stopColor="var(--primary-accent)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            className="fill-[url(#chartFill)]"
            d="M0 146 C50 140,75 130,112 135 S190 155,226 116 S300 88,340 104 S415 145,454 124 S525 72,568 82 S635 98,680 54 L680 220 L0 220 Z"
          />
          <path
            className="fill-none stroke-primary-accent stroke-[2.5] [vector-effect:non-scaling-stroke]"
            d="M0 146 C50 140,75 130,112 135 S190 155,226 116 S300 88,340 104 S415 145,454 124 S525 72,568 82 S635 98,680 54"
          />
          <circle
            cx="680"
            cy="54"
            r="5"
            className="fill-card stroke-primary-accent stroke-3 [vector-effect:non-scaling-stroke]"
          />
        </svg>
        <div className="absolute -right-1.25 top-4.5 z-2 hidden flex-col rounded-sm bg-foreground px-2.25 py-1.75 text-background shadow-menu sm:flex">
          <strong className="text-2xs">₹67,240</strong>
          <span className="mt-px text-3xs opacity-70">June</span>
          <i
            aria-hidden
            className="absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rotate-45 bg-foreground"
          />
        </div>
        <div className="absolute inset-x-0 bottom-0 flex justify-between text-2xs text-subtle-foreground">
          {months.map((month) => (
            <span key={month}>{month}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
