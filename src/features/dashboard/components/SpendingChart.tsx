export function SpendingChart() {
  return (
    <div className="chart-wrap" aria-label="Monthly spending from January to June">
      <div className="chart-y-axis">
        <span>₹80k</span>
        <span>₹60k</span>
        <span>₹40k</span>
        <span>₹20k</span>
        <span>₹0</span>
      </div>
      <div className="chart-stage">
        <div className="grid-line grid-1" />
        <div className="grid-line grid-2" />
        <div className="grid-line grid-3" />
        <div className="grid-line grid-4" />
        <div className="grid-line grid-5" />
        <svg viewBox="0 0 680 220" preserveAspectRatio="none" role="img">
          <defs>
            <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary-accent)" stopOpacity="0.18" />
              <stop offset="100%" stopColor="var(--primary-accent)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            className="chart-area"
            d="M0 146 C50 140,75 130,112 135 S190 155,226 116 S300 88,340 104 S415 145,454 124 S525 72,568 82 S635 98,680 54 L680 220 L0 220 Z"
          />
          <path
            className="chart-line"
            d="M0 146 C50 140,75 130,112 135 S190 155,226 116 S300 88,340 104 S415 145,454 124 S525 72,568 82 S635 98,680 54"
          />
          <circle cx="680" cy="54" r="5" className="chart-dot" />
        </svg>
        <div className="chart-tooltip">
          <strong>₹67,240</strong>
          <span>June</span>
        </div>
        <div className="chart-x-axis">
          <span>Jan</span>
          <span>Feb</span>
          <span>Mar</span>
          <span>Apr</span>
          <span>May</span>
          <span>Jun</span>
        </div>
      </div>
    </div>
  );
}
