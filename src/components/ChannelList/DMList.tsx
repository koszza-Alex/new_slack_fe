import { FiPlus } from "react-icons/fi";
import DMItem from "./DMItem";
import SidebarSection from "./SidebarSection";

export default function DMList() {
  const dms = ["lancers.masao1024", "Akira"];

  return (
    <SidebarSection title="Direct Messages">
      {dms.map((dm) => (
        <DMItem key={dm} name={dm} />
      ))}
      <div
        className="group flex items-center justify-between gap-2 px-7 py-1 rounded cursor-pointer hover:bg-white/10 text-white/80"
      >
        <div className="flex items-center gap-2">

          <FiPlus size={14} />
          invite people
        </div>
      </div>
    </SidebarSection>
  );
}
