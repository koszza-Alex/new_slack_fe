"use client";

import DMList from "@/components/ChannelList/DMList";
import ChannelListComponent from "@/components/ChannelList/ChannelList";
import WorkspaceHeader from "@/components/ChannelList/WorkspaceHeader";
import { useCallback, useRef, useState } from "react";

const MIN_WIDTH = 320;
const MAX_WIDTH = 480; // ≈ 1.5 × 320

export const ChannelList = () => {
  const [width, setWidth] = useState(MIN_WIDTH);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(MIN_WIDTH);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = true;
    startX.current = e.clientX;
    startWidth.current = width;

    const onMouseMove = (ev: MouseEvent) => {
      if (!dragging.current) return;
      const delta = ev.clientX - startX.current;
      const next = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startWidth.current + delta));
      setWidth(next);
    };

    const onMouseUp = () => {
      dragging.current = false;
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }, [width]);

  return (
    <div
      className="relative h-full shrink-0 bg-[rgb(92,42,92)] text-white flex flex-col"
      style={{ width: `${width}px`, minWidth: `${MIN_WIDTH}px`, maxWidth: `${MAX_WIDTH}px` }}
    >
      <WorkspaceHeader />

      <div className="flex-1 overflow-y-auto px-2">
        <ChannelListComponent />
        <DMList />
      </div>

      {/* Drag handle */}
      <div
        onMouseDown={onMouseDown}
        className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-white/20 transition-colors"
        title="Drag to resize"
      />
    </div>
  );
};
