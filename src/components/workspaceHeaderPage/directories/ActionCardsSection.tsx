"use client";

import CustomButton from "../component/channel_button";


export default function ActionCardsSection() {
  return (
    <section className="w-full bg-[#f4ede4] py-[40px]">
      <div className="max-w-[1100px] mx-auto flex gap-[20px] px-[20px]">
        <div className="flex-1 bg-[#ffffff] shadow-[0px_0px_1px_0px_gray] rounded-[12px] p-[20px]">
          <h3 className="text-[14px] font-[600] text-[#313131] mb-[6px]">
            Create a channel with external people
          </h3>

          <p className="text-[13px] text-[#313131] mb-[16px]">
            Work with multiple people and organizations outside of 2-MS
          </p>
          <CustomButton
            label="Create Channel"
            showIcon={false}
            width="w-auto"
            height="h-[36px]"
            paddingX="px-[16px]"
          />
        </div>
        <div className="flex-1 bg-[#ffffff] shadow-[0px_0px_1px_0px_gray]  rounded-[12px] p-[20px]">
          <h3 className="text-[14px] font-[600] text-[#313131] mb-[6px]">
            Talk one-on-one
          </h3>

          <p className="text-[13px] text-[#313131] mb-[16px]">
            Talk one-on-one with anyone outside of 2-MS
          </p>
          <CustomButton
            label="Start a DM"
            showIcon={false}
            bgColor="bg-transparent"
            hoverColor="hover:bg-[#e1e1e1]"
            activeColor="active:bg-[#a1a1a1]"
            textColor="text-[#313131]"
            width="w-auto"
            height="h-[36px]"
            paddingX="px-[16px]"
          />
        </div>

      </div>
    </section>
  );
}