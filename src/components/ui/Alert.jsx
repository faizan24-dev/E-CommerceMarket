import { CircleAlert, CircleCheck, Info, TriangleAlert } from "lucide-react";

const TONES = {
  error: { icon: CircleAlert, classes: "border-danger/20 bg-danger/5 text-danger", role: "alert" },
  success: { icon: CircleCheck, classes: "border-success/20 bg-success/5 text-success", role: "status" },
  warning: { icon: TriangleAlert, classes: "border-warning/20 bg-warning/5 text-warning", role: "status" },
  info: { icon: Info, classes: "border-info/20 bg-info/5 text-info", role: "status" },
};

/** An inline message box. Renders nothing when there is no content. */
export default function Alert({ tone = "info", title, children, className = "" }) {
  if (!children && !title) return null;
  const { icon: Icon, classes, role } = TONES[tone];
  return (
    <div role={role} className={`flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm ${classes} ${className}`}>
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <div className="min-w-0">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className={title ? "mt-0.5" : ""}>{children}</div>}
      </div>
    </div>
  );
}
