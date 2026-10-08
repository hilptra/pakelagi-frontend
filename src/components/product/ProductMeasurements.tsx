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
    <div className="space-y-3 p-4 rounded-xl border border-zinc-200 bg-white shadow-xs">
      <div className="flex items-center gap-2 text-xs font-bold text-zinc-950 uppercase tracking-wider">
        <Ruler className="w-4 h-4 text-emerald-700" />
        <span>Detail Ukuran (Pakaian)</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
        {items.map(([key, val]) => (
          <div
            key={key}
            className="flex flex-col p-2.5 rounded-lg bg-zinc-50 border border-zinc-200"
          >
            <span className="text-[11px] text-zinc-500 capitalize">
              {formatMeasurementKey(key)}
            </span>
            <span className="text-sm font-bold text-zinc-950 mt-0.5">
              {val} cm
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
