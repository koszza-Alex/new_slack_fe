const BASE_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

export async function getUserById(userId: string) {
    console.log(BASE_URL);
    
    console.log("userId======>", userId);

    const res = await fetch(`${BASE_URL}/api/user/${userId}`);

    if (!res.ok) {
        const text = await res.text();
        console.log("res====>", text);
        throw new Error(text || "Failed to fetch user");
    }

    return res.json();
}

export async function updateUser(
    userId: string,
    data: { name: string; email: string },
) {
    const res = await fetch(`${BASE_URL}/api/user/${userId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        throw new Error("Failed to update user");
    }

    return res.json();
}
import { log } from "console";

// lib/api/channel.ts

export async function getWorkspaceChannels(workspaceId: string) {
  const res = await fetch(
    `${BASE_URL}/api/channels/workspace/${workspaceId}`,
    { cache: 'no-store' }
  );
  return res.json();
}

export async function createChannel(data: {
  workspaceId: string;
  name: string;
  type: string;
  userId: string;
}) {
  const res = await fetch(
    `${BASE_URL}/api/channels/${data.workspaceId}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }
  );
  return res.json();
}

export async function joinChannel(channelId: string, userId: string) {
  const res = await fetch(
    `${BASE_URL}/api/channels/${channelId}/join`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    }
  );

  return res.json();
}

// Fetch thread (parent message + all replies) for a given messageId
export async function getThread(channelId: string, messageId: string) {
  const res = await fetch(
    `${BASE_URL}/api/channels/${channelId}/messages/${messageId}/thread`,
    { cache: 'no-store' }
  );
  if (!res.ok) throw new Error('Failed to fetch thread');
  return res.json();
}
