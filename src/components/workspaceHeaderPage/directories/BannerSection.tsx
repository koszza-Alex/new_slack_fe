"use client";

import { useState } from "react";
import CustomButton from "../component/channel_button";

export default function BannerSection() {
  const [showBanner, setShowBanner] = useState(true);

  return (
    <>
      {showBanner && (
        <div className="w-full h-[300px] border-y border-[#e1e1e1]  mb-[20px]">
          <div className="relative w-full pt-[60px] h-full bg-[#e3f8ff] pl-[250px] rounded-[10px] px-[24px] py-[20px] flex justify-between">
            
            {/* Close Button */}
            <a
              onClick={() => setShowBanner(false)}
              className="absolute top-[12px] right-[12px] text-[#f4ede4] hover:text-[white] text-[18px]"
            >
              ×
            </a>

            {/* Content */}
            <div className="max-w-[600px]">
              <h2 className="text-[25px] font-b font-[600] text-[#212121] mb-[6px]">
                Organize your team’s conversations
              </h2>
              <p className="text-[18px] text-[#414141] mb-[14px] leading-[1.4]">
                Channels are spaces for gathering all the right people, messages,
                files and tools. Organize them by any project, group, initiative
                or topic of your choosing.
              </p>

              <CustomButton
                label="Create a channel"
                showIcon={false}
                bgColor="bg-transparent"
                hoverColor="hover:bg-[#e1e1e1]"
                activeColor="active:bg-[#c1c11]"
                textColor="text-[#white]"
            
                height="h-[32px]"
                paddingX="px-[12px]"
                radius="rounded-[6px]"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}