const yLabels = ["₹80k", "₹60k", "₹40k", "₹20k", "₹0"];
const months = ["May", "Jun", "Jul", "Aug", "Sep", "Oct"];
/** Horizontal grid lines; the last one sits on the x-axis, above the month labels. */
const gridLines = ["top-0", "top-1/4", "top-1/2", "top-3/4", "bottom-5.5"];

export function TrendChart() {
  return (
    <div
      className="mt-2.5 flex h-47.5 sm:h-55"
      aria-label="Spending trend compared with the previous period"
    >
      <div className="flex w-9.75 flex-col justify-between pb-5.5 text-3xs text-subtle-foreground">
        {yLabels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <div className="relative flex-1">
        {gridLines.map((position) => (
          <i
            key={position}
            className={`absolute left-0 w-full border-t border-dashed border-border ${position}`}
          />
        ))}
        <svg
          viewBox="0 0 660 210"
          preserveAspectRatio="none"
          role="img"
          aria-label="Spending trend chart"
          className="absolute inset-x-0 top-0 h-[calc(100%-1.375rem)] w-full overflow-visible"
        >
          <defs>
            <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary-accent)" stopOpacity=".18" />
              <stop offset="100%" stopColor="var(--primary-accent)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            className="fill-none stroke-border-strong stroke-[1.5] [stroke-dasharray:5_5] [vector-effect:non-scaling-stroke]"
            d="M0 132 C70 124 90 145 132 128 S205 104 264 116 S340 142 396 118 S472 94 528 102 S600 78 660 84"
          />
          <path
            className="fill-[url(#expenseFill)]"
            d="M0 148 C64 145 91 130 132 138 S211 155 264 121 S342 88 396 108 S475 136 528 112 S607 66 660 75 L660 210 L0 210 Z"
          />
          <path
            className="fill-none stroke-primary-accent stroke-[2.3] [vector-effect:non-scaling-stroke]"
            d="M0 148 C64 145 91 130 132 138 S211 155 264 121 S342 88 396 108 S475 136 528 112 S607 66 660 75"
          />
          <circle
            cx="660"
            cy="75"
            r="5"
            className="fill-card stroke-primary-accent stroke-3 [vector-effect:non-scaling-stroke]"
          />
        </svg>
        <div className="absolute inset-x-0 bottom-0 flex justify-between text-3xs text-subtle-foreground">
          {months.map((month) => (
            <span key={month}>{month}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
