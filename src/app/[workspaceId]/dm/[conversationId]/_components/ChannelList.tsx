import DMList from "@/components/ChannelList/DMList";
import ChannelListComponent from "@/components/ChannelList/ChannelList";
import WorkspaceHeader from "@/components/ChannelList/WorkspaceHeader";

export const ChannelList = () => {
  return (
    <div className="min-w-[320px] w-1/4 h-full px-2 bg-[rgb(92,42,92)] text-white">
      <WorkspaceHeader />
      <div className="flex-1 overflow-y-auto">
        <ChannelListComponent />
        <DMList />
      </div>
    </div>
  );
};
