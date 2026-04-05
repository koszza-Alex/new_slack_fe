export interface ReactionView {
  emoji: string;
  count: number;
  reactedUserIds: string[];
  /** Minimal user info for tooltip display — populated by the backend */
  reactedUsers?: { id: string; dispname: string | null; email: string | null }[];
}

export interface ToggleReactionResponse {
  messageId: string;
  /** Full updated reactions array for the message after the toggle */
  reactions: ReactionView[];
}

/**
 * Toggle a reaction on a message.
 * Calls PATCH /api/channels/:channelId/messages/:messageId/reaction
 * Returns { messageId, reactions: ReactionView[] } — the authoritative full state.
 */
export const toggleReaction = async (
  channelId: string,
  messageId: string,
  emoji: string,
  userId: string,
): Promise<ToggleReactionResponse> => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SOCKET_URL}/api/channels/${channelId}/messages/${messageId}/reaction`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ emoji, userId }),
    }
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || "Failed to toggle reaction");
  }

  return res.json();
};

// Keep old export name so any other callers don't break
export const addReaction = toggleReaction;
