type UserCardProps = {
  type: "away" | "active" | "awayWithButton";
};

import Image from "next/image";
import { HuddleCustomButton } from "./HuddleCustomButton";

export function UserCard({ type }: UserCardProps) {
  return (
    <div className="bg-white border border-[#a1a1a1] rounded-[8px] overflow-hidden">
      
      {/* TOP VISUAL AREA */}
      <div className="relative h-[180px] w-full bg-[#1d1c1d]">

        <Image
          src="/Newimg/JPG/LiskFeng-Star_Gazing.jpg"
          alt=""
          fill
          className="object-cover opacity-[0.9]"
        />

        {/* Avatar Stack */}
        <div className="absolute absolute left-[50%] top-[50%] transform -translate-x-[50%] -translate-y-[50%] bottom-[10px] left-[12px] w-[150px] flex justify-between items-center">
          
          <div className="w-[70px] h-[70px] rounded-[8px] overflow-hidden border border-[white] z-[2]">
            <Image src="/Untitled.png" alt="" width={70} height={70} />
          </div>

          <div className="w-[70px] h-[70px] rounded-[8px] overflow-hidden border border-[white] -ml-[12px] z-[1] bg-[#e8e8e8] flex items-center justify-center">
            <Image src="/Newimg/Other/T0ALZFNE9PH-U0APFLBG21M-gf3ba4380556-192.png" alt="" width={70} height={70} />
          </div>

        </div>
      </div>

      {/* BOTTOM */}
      <div className="px-[12px] py-[10px] h-[80px] flex items-center justify-between">
        
        <div>
          <div className="flex items-center gap-[6px]">
            <p className="text-[14px] font-[600] text-[#313131]">
              NewtonA912
            </p>

            {type === "active" && (
              <span className="w-[8px] text-[#313131] h-[8px] bg-[#2bac76] rounded-full" />
            )}
          </div>

          <p className="text-[12px] text-[#313131] text-[#616061] mt-[2px]">
            {type === "active" ? "Active" : "Away"}
          </p>
        </div>

        {type === "awayWithButton" && (
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
        )}
      </div>
    </div>
  );
}