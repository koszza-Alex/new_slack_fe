import Image from "next/image";
import { HuddleCustomButton } from "./HuddleCustomButton";

type Props = {
  onClose: () => void;
};

export function HuddleHeroSection({ onClose }: Props) {
  return (
    <div className="relative w-full h-[250px] bg-[#cfe8d6] rounded-[8px] px-[100px] py-[24px] flex items-center justify-between">

      {/* CLOSE BUTTON */}
      <a
        onClick={onClose}
        className="absolute top-[16px] right-[16px] w-[24px] h-[24px] flex items-center justify-center text-[#616061] hover:text-[#1d1c1d]"
      >
        ✕
      </a>

      {/* LEFT */}
      <div className="max-w-[520px]">
        <h2 className="text-[22px] leading-[28px] font-[700] text-[#1d1c1d]">
          Instantly connect over audio or video
        </h2>

        <p className="text-[15px] leading-[22px] text-[#616061] mt-[8px]">
          Talk it out in real time on a huddle, with screen-sharing, expressive reactions and a message thread that automatically saves for later reference.
        </p>

        <div className="mt-[16px]">
          <HuddleCustomButton
            label="Start a Huddle"
            bgColor="#007a5a"
            textColor="#ffffff"
            hoverColor="#006c4f"
            height="36px"
            px="16px"
            border="none"
            rounded="6px"
            fontSize="14px"
          />
        </div>
      </div>

      {/* RIGHT IMAGE */}
      <div className="w-[280px] h-[160px] bg-[#cfe8d6] flex items-center overflow-hidden justify-center">
    <Image
             src="/Newimg/SVG/huddles_onboarding_tip_ia4-1ccf85d.gif"
             alt=""
            width={290}
            height={219}

             className="object-cover    opacity-[0.9]"
           />
      </div>
    </div>
  );
}