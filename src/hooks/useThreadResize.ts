import { useRef, useState } from "react";

const THREAD_MIN = 550;
const THREAD_MAX = 825;

/**
 * Encapsulates the resizable thread panel drag logic.
 * Used by both MainPage and DmPage to avoid duplication.
 */
export function useThreadResize() {
    const [threadWidth, setThreadWidth] = useState(THREAD_MIN);
    const dragging = useRef(false);
    const startX = useRef(0);
    const startWidth = useRef(THREAD_MIN);

    const onDragStart = (e: React.MouseEvent) => {
        e.preventDefault();
        dragging.current = true;
        startX.current = e.clientX;
        startWidth.current = threadWidth;

        const onMove = (ev: MouseEvent) => {
            if (!dragging.current) return;
            const delta = startX.current - ev.clientX;
            const next = Math.min(THREAD_MAX, Math.max(THREAD_MIN, startWidth.current + delta));
            setThreadWidth(next);
        };

        const onUp = () => {
            dragging.current = false;
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
        };

        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
    };

    return { threadWidth, onDragStart, THREAD_MIN, THREAD_MAX };
}
