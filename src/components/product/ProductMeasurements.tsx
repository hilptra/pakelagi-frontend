import { formatMeasurementKey } from "@/lib/utils";
import { Ruler } from "lucide-react";

interface ProductMeasurementsProps {
  measurements: Record<string, string | number> | null;
}

export function ProductMeasurements({ measurements }: ProductMeasurementsProps) {
  if (!measurements || Object.keys(measurements).length === 0) {
    return null;
  }

  const items = Object.entries(measurements).filter(
    ([, value]) => value !== null && value !== undefined && value !== ""
  );

  if (items.length === 0) return null;

  return (
    <div className="space-y-3 p-4 rounded-xl border border-brand-border bg-surface shadow-xs">
      <div className="flex items-center gap-2 text-xs font-bold text-foreground uppercase tracking-wider">
        <Ruler className="w-4 h-4 text-brand-secondary" />
        <span>Detail Ukuran (Pakaian)</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
        {items.map(([key, val]) => (
          <div
            key={key}
            className="flex flex-col p-2.5 rounded-lg bg-background border border-brand-border"
          >
            <span className="text-[11px] text-brand-muted capitalize">
              {formatMeasurementKey(key)}
            </span>
            <span className="text-sm font-bold text-foreground mt-0.5">
              {val} cm
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
