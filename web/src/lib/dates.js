// Lightweight date helpers (no external deps) using local time.

export function toISODate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function addDays(d, n) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

export function startOfWeek(d) {
  // Monday as start of week
  const r = new Date(d);
  const day = (r.getDay() + 6) % 7;
  return addDays(r, -day);
}

export const RANGE_PRESETS = [
  {
    id: "today",
    label: "Today",
    range: () => {
      const t = toISODate(new Date());
      return { from: t, to: t };
    },
  },
  {
    id: "yesterday",
    label: "Yesterday",
    range: () => {
      const y = toISODate(addDays(new Date(), -1));
      return { from: y, to: y };
    },
  },
  {
    id: "7d",
    label: "Last 7 days",
    range: () => ({ from: toISODate(addDays(new Date(), -6)), to: toISODate(new Date()) }),
  },
  {
    id: "week",
    label: "This week",
    range: () => ({ from: toISODate(startOfWeek(new Date())), to: toISODate(new Date()) }),
  },
  {
    id: "30d",
    label: "Last 30 days",
    range: () => ({ from: toISODate(addDays(new Date(), -29)), to: toISODate(new Date()) }),
  },
];

export function inRange(dateStr, from, to) {
  if (!dateStr) return false;
  if (from && dateStr < from) return false;
  if (to && dateStr > to) return false;
  return true;
}

export function prettyDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  const today = toISODate(new Date());
  const yest = toISODate(addDays(new Date(), -1));
  if (dateStr === today) return "Today";
  if (dateStr === yest) return "Yesterday";
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}
