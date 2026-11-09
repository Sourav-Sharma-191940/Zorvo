import { Sparkles } from "lucide-react";
import "./coming-soon.css";

export function ComingSoon({ title, description }: { title: string; description?: string }) {
  return (
    <div className="coming-soon">
      <span className="coming-soon-icon">
        <Sparkles size="1.625rem" />
      </span>
      <h1>{title}</h1>
      <p>{description ?? "This section is coming soon. We're building it next."}</p>
    </div>
  );
}
