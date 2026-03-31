import Link from "next/link";
import { useParams } from "next/navigation";
import { FiPlus, FiX } from "react-icons/fi";
import { SmallAvatar } from "../ui/avatar/Avatar";

// DMItem.tsx
export default function DMItem({ name, icon }: { name: string, icon?: boolean }) {
  const params = useParams();
  const activeChannel = params.id;

  const isActive = activeChannel === name;

  return (

    <Link href={`/client/${name}`}>
      <div
        className={`group flex items-center justify-between gap-2 px-7 py-1 rounded cursor-pointer ${isActive
          ? "bg-[#f9edff] text-[#39063a] font-medium"
          : "hover:bg-white/10 text-white/80"
          }`}
      >
        <div className="flex items-center gap-2">

          {icon ? <FiPlus size={14} /> : <SmallAvatar />}
          {name}
        </div>
        {
          name !== "invite people" ?
            <div className={`p-1 rounded hidden group-hover:block hover: ${isActive ?
              "" : "bg-[#704a71]"
              } `}>
              <FiX size={14} />
            </div> :
            ""
        }
      </div>
    </Link>

  );
}
