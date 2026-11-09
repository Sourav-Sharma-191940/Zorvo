"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";

/** Transient success message state. Pair with `<Toast message={toast} />`. */
export function useToast(duration = 2800) {
  const [toast, setToast] = useState("");
  const timer = useRef<number | undefined>(undefined);

  const notify = useCallback(
    (message: string) => {
      window.clearTimeout(timer.current);
      setToast(message);
      timer.current = window.setTimeout(() => setToast(""), duration);
    },
    [duration],
  );

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return { toast, notify };
}

export function Toast({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="success-toast" role="status">
      <span>
        <Check size="0.875rem" />
      </span>
      {message}
    </div>
  );
}
