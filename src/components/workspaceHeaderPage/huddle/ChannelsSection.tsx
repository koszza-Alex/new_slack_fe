import { ChannelRow } from "./ChannelRow";
import { channelName } from "./huddleDomi";

export function ChannelsSection() {
    return (
        <div>
            <h3 className="text-[15px] font-[700] text-[#1d1c1d]">
                Channels
                <span className="text-[#616061] font-[400] ml-[6px]">
                    — Meet with a whole team, or just let people drop in and out
                </span>
            </h3>
            <div className="mt-[12px] bg-white border border-[#e8e8e8] rounded-[8px] overflow-hidden">
                {channelName.map((item, idx) => (
                    <ChannelRow key={idx} time={item.time} avatarUrl={item.avatarUrl} name={item.name} />
                ))}
            </div>
        </div>
    );
}