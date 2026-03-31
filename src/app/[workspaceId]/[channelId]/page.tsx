"use client";

import { ChannelList } from "./_components/ChannelList";

export default function Page({
  params,
}: {
  params: { id: string };
}) {
  const workspaceId = params.id;

  return (
    <div className="h-full flex">
      <ChannelList />
    </div>
  );
}