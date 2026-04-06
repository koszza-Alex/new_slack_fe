"use client";

import CustomButton from "../component/channel_button";

export default function DirectoriesInvitation() {
  return (
    <section className="w-full flex justify-center py-[80px]">
      <div className="w-full max-w-[420px] flex flex-col items-center text-center">
        <div className="w-[120px] h-[120px] mb-[20px]">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <rect x="20" y="20" width="160" height="160" rx="28" fill="#38bdf8" />
            <rect x="50" y="80" width="100" height="60" rx="6" fill="#e5e7eb" />
            <polygon points="50,80 100,110 150,80" fill="#d1d5db" />
            <rect x="75" y="50" width="50" height="40" rx="4" fill="white" />
            <rect x="88" y="62" width="10" height="10" fill="#38bdf8" />
            <rect x="100" y="62" width="10" height="10" fill="#ec4899" />
            <path
              d="M40 120 C60 100, 70 100, 80 120 L70 140 L40 140 Z"
              fill="#7c3f1d"
            />
          </svg>
        </div>
        <h2 className="text-[18px] font-[600] text-[#313131] mb-[10px]">
          Track your invitations
        </h2>
        <p className="text-[14px] text-[#313131] leading-[1.6] mb-[20px] max-w-[320px]">
          You'll see the status of invitations you've sent and received here.
        </p>
        <CustomButton
          label="Learn more"
          showIcon={false}
          bgColor="bg-transparent"
          hoverColor="hover:bg-[#e1e1e1]"
          activeColor="active:bg-[#a1a1a1]"
          textColor="text-[#313131]"
          width="w-auto"
          height="h-[36px]"
          paddingX="px-[16px]"
          radius="rounded-[6px]"
        />
        <p className="text-[13px] text-[#38bdf8] mt-[14px] cursor-pointer hover:underline">
          Contact an admin to use Slack Connect
        </p>
        <div className="w-[60%] border-t border-[#374151] my-[24px]" />
        <ol className="text-left text-[13px] text-[#313131] space-y-[10px]">
          <li>1. Invite someone to join a channel via email or link.</li>
          <li>2. Depending on your company, admins may need to sign off.</li>
          <li>3. They’re in! And they can add their coworkers, too.</li>
        </ol>
      </div>
    </section>
  );
}