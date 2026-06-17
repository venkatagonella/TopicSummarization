import { useMemo } from "react";
import DateRangeBar from "./DateRangeBar.jsx";
import SummaryItem from "./SummaryItem.jsx";
import Icon from "./Icon.jsx";
import { inRange, prettyDate } from "../lib/dates.js";
import { useSectionData } from "../hooks/useSectionData.js";

function groupByDate(items) {
  const map = new Map();
  for (const it of items) {
    const key = it.date || "undated";
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(it);
  }
  return [...map.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1));
}

export default function SummaryPanel({ section, presetId, range, onPreset, onCustom }) {
  const { status, data, error } = useSectionData(section);

  const visible = useMemo(() => {
    if (!data?.items) return [];
    const rank = { high: 0, medium: 1, low: 2 };
    return data.items
      .filter((it) => inRange(it.date, range.from, range.to))
      .sort((a, b) => {
        if (a.date !== b.date) return a.date < b.date ? 1 : -1;
        const ra = rank[(a.priority || "low").toLowerCase()] ?? 3;
        const rb = rank[(b.priority || "low").toLowerCase()] ?? 3;
        if (ra !== rb) return ra - rb;
        return (b.actionNeeded ? 1 : 0) - (a.actionNeeded ? 1 : 0);
      });
  }, [data, range]);

  const grouped = useMemo(() => groupByDate(visible), [visible]);
  const actionCount = visible.filter((i) => i.actionNeeded).length;
  const isPlaceholder = data?.status === "placeholder";

  return (
    <section className="flex h-full flex-col bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center gap-3">
          <span
            className="grid place-items-center w-9 h-9 rounded-lg text-white"
            style={{ backgroundColor: section.accent }}
          >
            <Icon name={section.icon} size={20} />
          </span>
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-gray-900 leading-tight">
              {section.label} summary
            </h2>
            <p className="text-xs text-gray-500">
              {visible.length} item{visible.length === 1 ? "" : "s"}
              {actionCount > 0 && (
                <span className="text-indigo-600 font-medium">
                  {" "}· {actionCount} need a response
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <DateRangeBar
            presetId={presetId}
            range={range}
            onPreset={onPreset}
            onCustom={onCustom}
          />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto scroll-thin px-6 py-5">
        {status === "loading" && <SkeletonList />}

        {status === "error" && (
          <EmptyState
            title="Couldn't load data"
            body={`No data file found for "${section.label}". Run a refresh to generate it. (${error})`}
          />
        )}

        {status === "ready" && isPlaceholder && (
          <EmptyState
            title={`${section.label} not connected yet`}
            body={
              data?.message ||
              "This section is a placeholder. It will populate once a connector is wired up."
            }
          />
        )}

        {status === "ready" && !isPlaceholder && visible.length === 0 && (
          <EmptyState
            title="Nothing in this range"
            body="Try a wider date range or pick a different source on the left."
          />
        )}

        {status === "ready" && !isPlaceholder && grouped.length > 0 && (
          <div className="space-y-6">
            {grouped.map(([date, items]) => (
              <div key={date}>
                <div className="sticky top-0 z-[1] -mx-1 mb-2 bg-gray-50/90 px-1 py-1 backdrop-blur">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {date === "undated" ? "Undated" : prettyDate(date)}
                  </h3>
                </div>
                <div className="space-y-3">
                  {items.map((it) => (
                    <SummaryItem
                      key={it.id}
                      item={it}
                      accent={it._accent || section.accent}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function SkeletonList() {
  return (
    <div className="space-y-3">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="h-24 animate-pulse rounded-xl bg-gray-200/70" />
      ))}
    </div>
  );
}

function EmptyState({ title, body }) {
  return (
    <div className="grid h-full place-items-center">
      <div className="max-w-sm text-center">
        <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-gray-100 text-gray-400">
          <Icon name="spark" size={22} />
        </div>
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        <p className="mt-1 text-sm text-gray-500">{body}</p>
      </div>
    </div>
  );
}
