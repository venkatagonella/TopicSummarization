import { useCallback, useEffect, useRef, useState } from "react";

// Two-pane horizontal layout with a draggable vertical divider.
// `initial` and the clamp bounds are percentages of total width.
export default function SplitPane({ left, right, initial = 30, min = 18, max = 55 }) {
  const containerRef = useRef(null);
  const [pct, setPct] = useState(initial);
  const dragging = useRef(false);

  const onMove = useCallback(
    (clientX) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const raw = ((clientX - rect.left) / rect.width) * 100;
      setPct(Math.min(max, Math.max(min, raw)));
    },
    [min, max]
  );

  useEffect(() => {
    const handleMouse = (e) => dragging.current && onMove(e.clientX);
    const handleTouch = (e) =>
      dragging.current && e.touches[0] && onMove(e.touches[0].clientX);
    const stop = () => {
      if (dragging.current) {
        dragging.current = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      }
    };
    window.addEventListener("mousemove", handleMouse);
    window.addEventListener("mouseup", stop);
    window.addEventListener("touchmove", handleTouch, { passive: false });
    window.addEventListener("touchend", stop);
    return () => {
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("mouseup", stop);
      window.removeEventListener("touchmove", handleTouch);
      window.removeEventListener("touchend", stop);
    };
  }, [onMove]);

  const start = () => {
    dragging.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  return (
    <div ref={containerRef} className="flex h-full w-full">
      <div style={{ width: `${pct}%` }} className="h-full min-w-0">
        {left}
      </div>

      <div
        role="separator"
        aria-orientation="vertical"
        aria-valuenow={Math.round(pct)}
        tabIndex={0}
        onMouseDown={start}
        onTouchStart={start}
        onDoubleClick={() => setPct(initial)}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") setPct((p) => Math.max(min, p - 2));
          if (e.key === "ArrowRight") setPct((p) => Math.min(max, p + 2));
        }}
        className="group relative w-1.5 shrink-0 cursor-col-resize bg-gray-200 hover:bg-indigo-400 transition-colors"
        title="Drag to resize (double-click to reset)"
      >
        <span className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-1 rounded-full bg-gray-400 group-hover:bg-white" />
      </div>

      <div style={{ width: `${100 - pct}%` }} className="h-full min-w-0">
        {right}
      </div>
    </div>
  );
}
