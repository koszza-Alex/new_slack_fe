import Image from "next/image";
import { HuddleCustomButton } from "./HuddleCustomButton";

export function ChannelRow({ name, height, width, avatarUrl, user, time }: Props) {
  return (
    <div
      className={`group w-full h-[60px] flex items-center justify-between
        px-[12px] transition-all duration-[120ms] cursor-pointer
        border-[1px] border-[#767676]
      `}
    >
      <div className="flex items-center gap-[10px]">
        <div className="w-[55px] h-[55px] rounded-[8px] 
          flex items-center justify-center text-[#ffffff] text-[18px]"
        >
        
            <div className="w-[38px] text-[#313131] text-[30px] flex justify-center items-center h-[38px] rounded-[6px] bg-[#e1e1e1]">
              #
            </div>
     
        </div>

        <div className="flex items-center">
          <div className="text-[#313131] text-[14px] font-[500]">
            {time}
          </div>
          <div className="text-[#414141] text-[12px]">
            {"      ." + name}
          </div>
        </div>
      </div>

      <div
        className="flex items-center gap-[12px]
          opacity-0 group-hover:opacity-100
          transition-opacity duration-150"
      >
        <HuddleCustomButton
          label="Start Huddle"
          bgColor="#ffffff"
          textColor="#1d1c1d"
          hoverColor="#f4f4f4"
          border="1px solid #d1d2d3"
          height="28px"
          px="10px"
          rounded="6px"
          fontSize="12px"
        />
      </div>
    </div>
  );
}