import Icon from "./Icon.jsx";

export default function Sidebar({ sections, activeId, counts, onSelect, meta }) {
  return (
    <aside className="flex h-full flex-col bg-white border-r border-gray-200">
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="grid place-items-center w-8 h-8 rounded-lg bg-indigo-600 text-white">
            <Icon name="spark" size={18} />
          </span>
          <div>
            <h1 className="text-[15px] font-semibold leading-tight">Daily Brief</h1>
            <p className="text-xs text-gray-500 leading-tight">
              {meta?.user?.name ? meta.user.name : "Your day at a glance"}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto scroll-thin p-3">
        <p className="px-2 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
          Sources
        </p>
        <ul className="space-y-1">
          {sections.map((s) => {
            const active = s.id === activeId;
            const count = counts?.[s.id];
            return (
              <li key={s.id}>
                <button
                  onClick={() => onSelect(s.id)}
                  className={[
                    "group w-full flex items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                    active
                      ? "bg-indigo-50 ring-1 ring-inset ring-indigo-200"
                      : "hover:bg-gray-50",
                  ].join(" ")}
                >
                  <span
                    className="mt-0.5 grid place-items-center w-8 h-8 rounded-lg shrink-0 text-white"
                    style={{ backgroundColor: s.accent }}
                  >
                    <Icon name={s.icon} size={18} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span
                        className={[
                          "text-sm font-medium",
                          active ? "text-indigo-900" : "text-gray-800",
                        ].join(" ")}
                      >
                        {s.label}
                      </span>
                      {typeof count === "number" && (
                        <span
                          className={[
                            "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold",
                            active
                              ? "bg-indigo-600 text-white"
                              : "bg-gray-100 text-gray-600",
                          ].join(" ")}
                        >
                          {count}
                        </span>
                      )}
                    </span>
                    <span className="block text-xs text-gray-500 truncate">
                      {s.description}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="px-4 py-3 border-t border-gray-100 text-[11px] text-gray-400">
        {meta?.generatedAt ? (
          <>Updated {new Date(meta.generatedAt).toLocaleString()}</>
        ) : (
          <>Awaiting first refresh</>
        )}
      </div>
    </aside>
  );
}
