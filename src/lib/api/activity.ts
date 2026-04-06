const BASE = process.env.NEXT_PUBLIC_SOCKET_URL ?? '';

export type ActivityType = 'mention' | 'reply' | 'reaction' | 'thread';

export interface ActivityItem {
    id: string;
    type: ActivityType;
    actorId: string;
    actorUsername: string;
    actorAvatar: string;
    messagePreview: string;
    messageId?: string;
    channelId?: string;
    workspaceId?: string;
    conversationId?: string;
    isRead: boolean;
    createdAt: string;
}

function authHeaders() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
}

export async function fetchActivities(userId: string): Promise<ActivityItem[]> {
    const res = await fetch(`${BASE}/api/activity?userId=${userId}`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Failed to fetch activities');
    return res.json();
}

export async function markAllActivitiesRead(userId: string): Promise<void> {
    await fetch(`${BASE}/api/activity/read-all?userId=${userId}`, {
        method: 'PATCH',
        headers: authHeaders(),
    });
}

export async function markActivityRead(activityId: string, userId: string): Promise<void> {
    await fetch(`${BASE}/api/activity/${activityId}/read?userId=${userId}`, {
        method: 'PATCH',
        headers: authHeaders(),
    });
}
