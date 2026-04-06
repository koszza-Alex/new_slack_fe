"use client";

export default function HeroSection() {
  return (
    <section className="w-full bg-[#f4ede4] py-[60px]">
      <div className="max-w-[1100px] mx-auto flex items-center justify-between px-[20px]">

        {/* LEFT: TEXT */}
        <div className="max-w-[520px]">
          <h1 className="text-[24px] font-[600] text-[#212121] mb-[12px]">
            Work with people outside 2-MS in Slack
          </h1>

          <p className="text-[14px] text-[#313131] leading-[1.6]">
            Move your conversations out of siloed email threads and collaborate
            with external people, clients, vendors, and partners in Slack.
          </p>
        </div>

        {/* RIGHT: SVG ILLUSTRATION */}
        <div className="w-[260px] h-[180px]">
        <img src="/Newimg/SVG/SC-Hub-Hero-v2-9e634b8.svg" alt="" />
        </div>

      </div>
    </section>
  );
}