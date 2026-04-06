import { IconType } from "react-icons";
import { DateHeader } from "./DraptSentDataHeader";
import { SentItem } from "./DraptSentItem";

export type DraptSentItem = {
  channelIcon: IconType;
  channelName: string;
  isthread: boolean;
  content: string;
  time: string;
  avatarUrl: string;
  dm_name: string;
};

export type DraptSentGroup = {
  day: string;
  date: string;
  list: DraptSentItem[];
};

type Props = {
  data: DraptSentGroup;
};

export default function DraptSentUnit({ data }: Props) {
  return (
    <div>
      <DateHeader date={`${data.day}, ${data.date}`} />
      <div className="mt-[10px] px-[24px]">
        <div className="rounded-[12px] border border-[#a1a1a1] overflow-hidden">
          {data.list.map((item, idx) => (
            <SentItem
              key={idx}
              icon={item.channelIcon}
              name={item.channelName ? item.channelName : item.dm_name}
              isthread={item.isthread}
              avatar={item.avatarUrl}
              time={item.time}
              email={item.content}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
