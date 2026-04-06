import { HuddleCustomButton } from "../huddle/HuddleCustomButton";

export function Drapt1Page() {
  return (
<>
 
    {/* <DraptSection/> */}
    <div className="w-full  flex items-center justify-center ">
      <div className="flex flex-col items-center gap-[16px] text-center">
        
        {/* Pencil Icon (Large) */}
        <div className="text-[#7c3aed]">
         <img src="/Newimg/SVG/empty-drafts-light-c36122e.svg" alt="" />
        </div>

        <h2 className="text-[18px] font-[600] text-[#1d1c1d]">
          Draft messages to send when you're ready
        </h2>

        <p className="text-[14px] text-[#616061] max-w-[400px]">
          Start typing a message anywhere, then find it here. Re-read,
          revise, and send whenever you'd like.
        </p>
      <HuddleCustomButton
                        label="Start New Message"
                        bgColor="#e8e8e8"
                        textColor="#1d1c1d"
                        hoverColor="#dcdcdc"
                        activeColor="#cfcfcf"
                        height="36px"
                        px="16px"
                        rounded="6px"
                        fontSize="14px"
                        border="1px solid #cfcfcf"
                    />
      </div>
    </div>
</>
   
  );
}