"use client";

import { useParams } from "next/navigation";
import DmPage from "@/components/DmPage/DmPage";
import { ChannelList } from "./_components/ChannelList";

export default function Page() {
    const params = useParams();
    const conversationId = Array.isArray(params.conversationId)
        ? params.conversationId[0]
        : params.conversationId;

    if (!conversationId) return null;

    return (
        <div className="h-full flex">
            {/* Left sidebar — same structure as channel pages */}
            <ChannelList />

            {/* Main DM conversation area */}
            <div className="flex-1 h-full overflow-hidden">
                <DmPage conversationId={conversationId} />
            </div>
        </div>
    );
}
