import { useEffect, useMemo, useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import SplitPane from "./components/SplitPane.jsx";
import SummaryPanel from "./components/SummaryPanel.jsx";
import { SECTIONS } from "./config/sections.js";
import { RANGE_PRESETS, toISODate } from "./lib/dates.js";
import { useMeta } from "./hooks/useSectionData.js";

export default function App() {
  const [activeId, setActiveId] = useState(SECTIONS[0].id);
  const [presetId, setPresetId] = useState("today");
  const [range, setRange] = useState(() => RANGE_PRESETS[0].range());
  const [counts, setCounts] = useState({});
  const meta = useMeta();

  const activeSection = useMemo(
    () => SECTIONS.find((s) => s.id === activeId) || SECTIONS[0],
    [activeId]
  );

  // Pre-fetch source sections once to show action-needed counts in the sidebar.
  useEffect(() => {
    let cancelled = false;
    const sources = SECTIONS.filter((s) => !s.aggregate);
    Promise.all(
      sources.map((s) =>
        fetch(`${s.dataFile}?t=${Date.now()}`)
          .then((r) => (r.ok ? r.json() : null))
          .then((d) => [s.id, d])
          .catch(() => [s.id, null])
      )
    ).then((entries) => {
      if (cancelled) return;
      const today = toISODate(new Date());
      const next = {};
      let todayCount = 0;
      for (const [id, d] of entries) {
        if (!d?.items) continue;
        next[id] = d.items.filter((i) => i.actionNeeded).length;
        todayCount += d.items.filter((i) => i.actionNeeded && i.date === today).length;
      }
      const agg = SECTIONS.find((s) => s.aggregate);
      if (agg) next[agg.id] = todayCount;
      setCounts(next);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const handlePreset = (id) => {
    setPresetId(id);
    const preset = RANGE_PRESETS.find((p) => p.id === id);
    if (preset) setRange(preset.range());
  };

  const handleCustom = (r) => {
    setPresetId("custom");
    setRange(r);
  };

  return (
    <div className="h-screen w-screen overflow-hidden">
      <SplitPane
        initial={30}
        left={
          <Sidebar
            sections={SECTIONS}
            activeId={activeId}
            counts={counts}
            onSelect={setActiveId}
            meta={meta}
          />
        }
        right={
          <SummaryPanel
            key={activeSection.id}
            section={activeSection}
            presetId={presetId}
            range={range}
            onPreset={handlePreset}
            onCustom={handleCustom}
          />
        }
      />
    </div>
  );
}
