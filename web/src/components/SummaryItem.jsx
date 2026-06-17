const PRIORITY_STYLES = {
  high: "bg-red-50 text-red-700 ring-red-200",
  medium: "bg-amber-50 text-amber-700 ring-amber-200",
  low: "bg-gray-50 text-gray-600 ring-gray-200",
};

export default function SummaryItem({ item, accent }) {
  const priority = (item.priority || "low").toLowerCase();
  return (
    <article
      className="rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-sm"
      style={{ borderLeft: `3px solid ${accent}` }}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold text-gray-900 leading-snug">
          {item.link ? (
            <a
              href={item.link}
              target="_blank"
              rel="noreferrer"
              className="hover:text-indigo-700 hover:underline"
            >
              {item.title}
            </a>
          ) : (
            item.title
          )}
        </h3>
        <div className="flex shrink-0 items-center gap-1.5">
          {item._sourceLabel && (
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white"
              style={{ backgroundColor: accent }}
            >
              {item._sourceLabel}
            </span>
          )}
          {item.actionNeeded && (
            <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
              Action
            </span>
          )}
          <span
            className={[
              "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ring-inset",
              PRIORITY_STYLES[priority] || PRIORITY_STYLES.low,
            ].join(" ")}
          >
            {priority}
          </span>
        </div>
      </div>

      {item.summary && (
        <p className="mt-1.5 text-sm text-gray-600 leading-relaxed">{item.summary}</p>
      )}

      {item.meta && (
        <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-gray-500">
          {Object.entries(item.meta).map(([k, v]) => (
            <span key={k} className="inline-flex items-center gap-1">
              <span className="text-gray-400">{k}:</span>
              <span className="font-medium text-gray-600">{String(v)}</span>
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
