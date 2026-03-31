"use client";

const cards = [
    {
        title: "Invite teammates",
        subtitle: "Add your whole team",
        bg: "bg-[#E9DFF2]",
        img: "/images/team.svg",
    },
    {
        title: "Add project brief",
        subtitle: "Canvas template",
        bg: "bg-[#D9F0EC]",
        img: "/images/brief.svg",
    },
    {
        title: "Host weekly syncs",
        subtitle: "Huddle in Slack",
        bg: "bg-[#DFF3E6]",
        img: "/images/meeting.svg",
    },
    {
        title: "Add project tracker",
        subtitle: "List template",
        bg: "bg-[#F6E7D3]",
        img: "/images/tracker.svg",
    },
];

export default function Home() {
    return (
        <div className="bg-[#F8F8F8] px-10 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-[30px] font-semibold text-[#1D1C1D] flex items-center gap-2">
                    👋 Welcome to the #new - channel channel
                </h1>

                <p className="text-[25px] text-[#616061] mt-2">
                    This channel is for everything #new - channel. Get started by setting up the
                    channel for your team.
                </p>
            </div>

            {/* Cards */}
            <div className="flex gap-6">
                {cards.map((card, i) => (
                    <div
                        key={i}
                        className={`w-[200px] h-[280px] rounded-2xl p-5 ${card.bg}
              shadow-[0_1px_2px_rgba(0,0,0,0.08)]
              hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)]
              transition-all duration-200 cursor-pointer`}
                    >
                        <div>
                            <h3 className="text-[15px] font-semibold text-[#1D1C1D]">
                                {card.title}
                            </h3>
                            <p className="text-[13px] text-[#616061] mt-[2px]">
                                {card.subtitle}
                            </p>
                        </div>

                        {/* Image */}
                        <div className="flex justify-center">
                            <img
                                src={card.img}
                                alt={card.title}
                                width={160}
                                height={120}
                                className="object-contain"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}