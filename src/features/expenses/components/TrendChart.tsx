export function TrendChart() {
  return (
    <div className="expense-chart" aria-label="Spending trend compared with the previous period">
      <div className="expense-chart-y">
        <span>₹80k</span>
        <span>₹60k</span>
        <span>₹40k</span>
        <span>₹20k</span>
        <span>₹0</span>
      </div>
      <div className="expense-chart-stage">
        <i />
        <i />
        <i />
        <i />
        <i />
        <svg viewBox="0 0 660 210" preserveAspectRatio="none" role="img">
          <defs>
            <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary-accent)" stopOpacity=".18" />
              <stop offset="100%" stopColor="var(--primary-accent)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            className="expense-previous-line"
            d="M0 132 C70 124 90 145 132 128 S205 104 264 116 S340 142 396 118 S472 94 528 102 S600 78 660 84"
          />
          <path
            className="expense-area"
            d="M0 148 C64 145 91 130 132 138 S211 155 264 121 S342 88 396 108 S475 136 528 112 S607 66 660 75 L660 210 L0 210 Z"
          />
          <path
            className="expense-current-line"
            d="M0 148 C64 145 91 130 132 138 S211 155 264 121 S342 88 396 108 S475 136 528 112 S607 66 660 75"
          />
          <circle cx="660" cy="75" r="5" className="expense-chart-dot" />
        </svg>
        <div className="expense-chart-labels">
          <span>May</span>
          <span>Jun</span>
          <span>Jul</span>
          <span>Aug</span>
          <span>Sep</span>
          <span>Oct</span>
        </div>
      </div>
    </div>
  );
}
