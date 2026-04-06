"use client";

export default function ExternalChannelsSteps() {
  const steps = [
    {
      id: 1,
      title: "Create a channel",
      desc: "Invite people from outside 2-MS to the channel using their email address.",
    },
    {
      id: 2,
      title: "Partners accept your invite",
      desc: "Upon accepting your invite, they’ll set up the shared channel in their own workspace.",
    },
    {
      id: 3,
      title: "Work securely and efficiently",
      desc: "Your invitees will only have access to the conversations they’re invited to.",
    },
  ];

  return (
    <div className="w-full bg-[#fafafa] mt-[20px] py-[60px] flex flex-col items-center">
      <h2 className="text-[20px] font-[600] text-[#313131] mb-[40px]">
        How to create channels with external people
      </h2>

      <div className="w-full max-w-[900px] flex items-start justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex-1 flex items-start relative">

            {/* STEP CONTENT */}
            <div className="flex flex-col items-center text-center w-full z-10">
              <div className="w-[28px] h-[28px] rounded-full bg-[#38bdf8] text-[#313131] text-[13px] font-[600] flex items-center justify-center mb-[12px] shadow-md">
                {step.id}
              </div>

              <h3 className="text-[14px] font-[600] text-[#313131] mb-[6px]">
                {step.title}
              </h3>

              <p className="text-[13px] text-[#313131] leading-[1.4]">
                {step.desc}
              </p>
            </div>

            {/* DASHED CONNECTOR */}
            {index !== steps.length - 1 && (
              <div
                className="
                  absolute 
                  top-[14px] 
                  left-1/2 
                  w-full 
                  border-t 
                  border-dashed 
                  border-[#4b5563]
                "
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}