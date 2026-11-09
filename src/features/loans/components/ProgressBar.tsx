/** Repayment progress bar. Uses inline width so arbitrary (user-entered) values render correctly. */
export function ProgressBar({ progress }: { progress: number }) {
  const clamped = Math.max(0, Math.min(100, progress));
  return <span className="loan-progress-fill" style={{ width: `${clamped}%` }} />;
}
