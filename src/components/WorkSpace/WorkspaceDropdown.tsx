import WorkspaceAvatar from "@/components/WorkSpace/WorkspaceAvatar";

export function WorkspaceDropdown() {
    return (
        <div
            className="
            w-[72px]
            bg-[#3F0E40]
            flex flex-col items-center
            py-3 gap-3
            "
        >
            {/*  Workspace Avatar */}
            <WorkspaceAvatar />

            {/* Other icons here */}
        </div>
    );
}
