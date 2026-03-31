"use client";

import ActivityPopover from "@/components/WorkSpace/ActivityPopover";
import DmsPopover from "@/components/WorkSpace/DmsPopover";
import FilesPopover from "@/components/WorkSpace/FilesPopover";
import MorePopover from "@/components/WorkSpace/MorePopover";
import { Item, useSidebarStore } from "@/store/sidebar-store";
import { useRouter } from "next/navigation";

export default function NavItem({
    // icon,
    label,
    id,
    hasDot,
}: {
    // icon: React.ReactNode;
    label: string;
    id: Item;
    hasDot?: boolean;
}) {
    const { active, setActive, unread } = useSidebarStore();
    const router = useRouter();

    const isActive = active === id;
    const count = unread[id];

    const handleClick = () => {
        setActive(id);
        // router.push(`/${id}`);
    };

    //  Wrap only DMs with popover (NO duplication)
    const Wrapper = (() => {
        // ❗ Disable popover when active
        if (active === id) {
            return ({ children }: any) => <>{children}</>;
        }

        if (id === "dms") return DmsPopover;
        if (id === "activity") return ActivityPopover;
        if (id === "files") return FilesPopover;
        if (id === "more") return MorePopover;

        return ({ children }: any) => <>{children}</>;
    })();

    return (
        <Wrapper>
            <div
                onClick={handleClick}
                className="relative flex flex-col items-center cursor-pointer group select-none"
            >
                {/* LEFT INDICATOR */}
                <div />

                {/* ICON */}
                <div
                    className={`
                        relative w-10 h-10 flex items-center justify-center
                      ${
                          isActive
                              ? "bg-white/20 rounded-xl scale-105"
                              : "rounded-full group-hover:bg-white/10 group-hover:rounded-xl group-hover:scale-105"
                      }
                               
                    `}
                >
                    <img
                        src={`/svg/${isActive ? label + "Active" : label}.svg`}
                        alt={label}
                        className="w-5 invert   group-hover:w-6"
                    />

                    {hasDot && (
                        <div className="absolute top-[6px] right-[6px] w-[6px] h-[6px] bg-[#af81ba] rounded-full" />
                    )}
                </div>

                {/* UNREAD BADGE */}
                {count > 0 && (
                    <div className="absolute top-[3px] right-[0px] min-w-[16px] h-[16px] px-[4px] text-[10px] bg-red-500 text-white rounded-full flex items-center justify-center animate-pulse">
                        {count}
                    </div>
                )}

                {/* LABEL */}
                <span className="text-[11px] leading-none: line-height:1; text-white/80 font-bold">
                    {label}
                </span>

                {/* TOOLTIP (keep simple text ONLY) */}
                <div
                    className="
                        absolute left-[80px] top-1/2 -translate-y-1/2
                        bg-black text-white text-xs px-2 py-1 rounded
                        opacity-0 group-hover:opacity-100
                        translate-x-[-8px] group-hover:translate-x-0
                        transition-all duration-200 delay-150
                        whitespace-nowrap pointer-events-none
                    "
                >
                    {label}
                </div>
            </div>
        </Wrapper>
    );
}
