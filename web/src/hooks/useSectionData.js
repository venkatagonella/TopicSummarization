import { useEffect, useState } from "react";
import { SECTIONS } from "../config/sections.js";

// Caches fetched JSON per section so switching tabs is instant.
const cache = new Map();

function fetchJson(url) {
  return fetch(`${url}?t=${Date.now()}`)
    .then((r) => (r.ok ? r.json() : null))
    .catch(() => null);
}

// Build the "Today" overview by merging every non-aggregate source. Each item
// is annotated with its source so the UI can color/label it.
async function loadAggregate() {
  const sources = SECTIONS.filter((s) => !s.aggregate);
  const results = await Promise.all(
    sources.map((s) => fetchJson(s.dataFile).then((d) => ({ s, d })))
  );
  const items = [];
  for (const { s, d } of results) {
    if (!d?.items) continue;
    for (const it of d.items) {
      items.push({
        ...it,
        id: `${s.id}:${it.id}`,
        _source: s.id,
        _accent: s.accent,
        _sourceLabel: s.label,
        _icon: s.icon,
      });
    }
  }
  return { source: "today", label: "Today", status: "live", items };
}

export function useSectionData(section) {
  // Initialize from cache so switching back to a loaded section never shows a
  // stale frame from the previously selected section.
  const [state, setState] = useState(() =>
    section && cache.has(section.id)
      ? { status: "ready", data: cache.get(section.id), error: null }
      : { status: "loading", data: null, error: null }
  );

  useEffect(() => {
    if (!section) return;
    let cancelled = false;

    if (cache.has(section.id)) {
      setState({ status: "ready", data: cache.get(section.id), error: null });
      return;
    }

    setState({ status: "loading", data: null, error: null });

    const loader = section.aggregate
      ? loadAggregate()
      : fetch(`${section.dataFile}?t=${Date.now()}`).then((r) => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          return r.json();
        });

    loader
      .then((data) => {
        if (cancelled) return;
        cache.set(section.id, data);
        setState({ status: "ready", data, error: null });
      })
      .catch((error) => {
        if (cancelled) return;
        setState({ status: "error", data: null, error: error.message });
      });

    return () => {
      cancelled = true;
    };
  }, [section]);

  return state;
}

export function useMeta() {
  const [meta, setMeta] = useState(null);
  useEffect(() => {
    fetch(`/data/meta.json?t=${Date.now()}`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setMeta)
      .catch(() => setMeta(null));
  }, []);
  return meta;
}
