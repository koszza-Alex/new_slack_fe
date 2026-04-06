import { FiFile } from "react-icons/fi";
import Image from "next/image";

type Props = {
  name?: string;
  avatarUrl?: string;
  time?: string;
};

export function DraptItem({ name, avatarUrl, time }: Props) {
  return (
    <div className="group w-full h-[60px] flex items-center justify-between px-[12px] hover:bg-[#e6e6e6] transition-all duration-[120ms] cursor-pointer border-[1px] border-[#767676]">
      <div className="flex items-center gap-[10px]">
        <div className="w-[55px] h-[55px] flex items-center justify-center">
          {avatarUrl ? (
            <Image src={avatarUrl} alt="avatar" width={45} height={45} className="rounded-[6px] object-cover" />
          ) : (
            <div className="w-[28px] h-[28px] rounded-[6px] bg-[#3f3f3f] flex items-center justify-center text-gray">
              <FiFile />
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center">
          <div className="text-[#313131] text-[14px] font-[500]">{name}</div>
          <div className="text-[#9ca3af] text-[12px]">{time}</div>
        </div>
      </div>
      <div className="mr-[30px] translate-x-[6px] transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0">
        4:15
      </div>
    </div>
  );
}
