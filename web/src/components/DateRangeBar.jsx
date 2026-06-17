import { RANGE_PRESETS } from "../lib/dates.js";

export default function DateRangeBar({ presetId, range, onPreset, onCustom }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex flex-wrap items-center gap-1.5">
        {RANGE_PRESETS.map((p) => {
          const active = p.id === presetId;
          return (
            <button
              key={p.id}
              onClick={() => onPreset(p.id)}
              className={[
                "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                active
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-600 ring-1 ring-inset ring-gray-200 hover:bg-gray-50",
              ].join(" ")}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      <div className="ml-auto flex items-center gap-2 text-xs text-gray-600">
        <input
          type="date"
          value={range.from}
          max={range.to}
          onChange={(e) => onCustom({ ...range, from: e.target.value })}
          className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 outline-none focus:ring-2 focus:ring-indigo-300"
        />
        <span className="text-gray-400">to</span>
        <input
          type="date"
          value={range.to}
          min={range.from}
          onChange={(e) => onCustom({ ...range, to: e.target.value })}
          className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 outline-none focus:ring-2 focus:ring-indigo-300"
        />
      </div>
    </div>
  );
}
