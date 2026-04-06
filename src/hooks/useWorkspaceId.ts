import { useParams } from "next/navigation";

/**
 * Extracts workspaceId from Next.js route params.
 * Handles both string and string[] (catch-all) param shapes.
 */
export function useWorkspaceId(): string | undefined {
    const params = useParams();
    const raw = params?.workspaceId;
    return Array.isArray(raw) ? raw[0] : raw ?? undefined;
}
