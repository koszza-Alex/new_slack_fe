import { UserCard } from "./UserCard";

export function DirectMessagesSection() {
  return (
    <div className="mb-[40px]" >
      <h3 className="text-[15px] font-[700] text-[#1d1c1d]">
        Direct messages
        <span className="text-[#616061] font-[400] ml-[6px]">
          — Talk privately 1:1 with someone
        </span>
      </h3>

      <div className="mt-[16px] grid grid-cols-3 gap-[16px]">
        <UserCard type="away" />
        <UserCard type="active" />
        <UserCard type="awayWithButton" />
      </div>
    </div>
  );
}