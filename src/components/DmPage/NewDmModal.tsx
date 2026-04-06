"use client";

import { useAuth } from "@/context/Authcontext";
import { getDmCandidates, getOrCreateDmConversation, DmCandidate } from "@/lib/api/dm";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { getAvatarUrl } from "@/lib/messageUtils";

interface NewDmModalProps {
    onClose: () => void;
}

export default function NewDmModal({ onClose }: NewDmModalProps) {
    const { user } = useAuth();
    const router = useRouter();
    const workspaceId = useWorkspaceId();

    const [candidates, setCandidates] = useState<DmCandidate[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        if (!workspaceId || !user?.id) return;
        getDmCandidates(workspaceId, user.id)
            .then(setCandidates)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [workspaceId, user?.id]);

    const filtered = candidates.filter((c) => {
        const q = search.toLowerCase();
        return (
            c.dispname?.toLowerCase().includes(q) ||
            c.email.toLowerCase().includes(q)
        );
    });

    const handleSelect = async (candidate: DmCandidate) => {
        if (!workspaceId || !user?.id || creating) return;
        setCreating(true);
        try {
            const conv = await getOrCreateDmConversation(workspaceId, user.id, candidate.id);
            onClose();
            router.push(`/${workspaceId}/dm/${conv.id}`);
        } catch (err) {
            console.error("Failed to open DM:", err);
        } finally {
            setCreating(false);
        }
    };

    const getAvatarUrlForCandidate = (avatar: string) => getAvatarUrl(avatar);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-2xl w-[420px] max-h-[520px] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                    <h2 className="font-semibold text-gray-800">New Direct Message</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <FaTimes size={14} />
                    </button>
                </div>

                {/* Search */}
                <div className="px-4 py-3 border-b border-gray-100">
                    <input
                        type="text"
                        placeholder="Search workspace members..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full text-black text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400"
                        autoFocus
                    />
                </div>

                {/* Candidate list */}
                <div className="flex-1 overflow-y-auto py-2">
                    {loading ? (
                        <p className="text-center text-sm text-gray-400 py-6">Loading...</p>
                    ) : filtered.length === 0 ? (
                        <p className="text-center text-sm text-gray-400 py-6">
                            {search ? "No members found" : "No other members in this workspace"}
                        </p>
                    ) : (
                        filtered.map((c) => (
                            <button
                                key={c.id}
                                onClick={() => handleSelect(c)}
                                disabled={creating}
                                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-left transition"
                            >
                                <img
                                    src={getAvatarUrlForCandidate(c.avatar)}
                                    alt={c.dispname ?? c.email}
                                    className="w-8 h-8 rounded-lg shrink-0"
                                />
                                <div className="flex flex-col min-w-0">
                                    <span className="text-sm font-medium text-gray-800 truncate">
                                        {c.dispname || c.email}
                                    </span>
                                    {c.dispname && (
                                        <span className="text-xs text-gray-400 truncate">{c.email}</span>
                                    )}
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
