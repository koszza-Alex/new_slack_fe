/**
 * Shared message utilities used by MainPage, DmPage, and Thread.
 * Extracted to eliminate duplication across those three components.
 */

const BASE = process.env.NEXT_PUBLIC_SOCKET_URL ?? "";

/** Build a full avatar URL from a server-relative path */
export function getAvatarUrl(avatar: string | null | undefined): string {
    return `${BASE}${avatar ?? "/uploads/avatar.png"}`;
}

/** Resolve a display name from a sender object */
export function getDisplayName(
    sender: { dispname?: string | null; email?: string | null } | null | undefined,
    fallback = "Slack_User",
): string {
    return sender?.dispname || sender?.email || fallback;
}

/** Format a lastReplyAt ISO string into a human-readable relative time */
export function formatLastReply(lastReplyAt: string | null | undefined): string {
    if (!lastReplyAt) return "";
    const diff = Date.now() - new Date(lastReplyAt).getTime();
    const hours = Math.floor(diff / 3_600_000);
    if (hours < 1) return "just now";
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
}

/** Group an array of messages by their calendar date string */
export function groupMessagesByDate<T extends { createdAt: string }>(
    messages: T[],
): Record<string, T[]> {
    const groups: Record<string, T[]> = {};
    for (const m of messages) {
        const date = new Date(m.createdAt).toDateString();
        if (!groups[date]) groups[date] = [];
        groups[date].push(m);
    }
    return groups;
}

/** Sort messages oldest → newest */
export function sortByDate<T extends { createdAt: string }>(messages: T[]): T[] {
    return [...messages].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
}
