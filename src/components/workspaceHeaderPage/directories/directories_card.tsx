import { FiEdit2 } from "react-icons/fi";

type Props = {
  head: string;
  text: string;
  avatar: string;
};

export default function Card({ head, text, avatar }: Props) {
  return (
    <div className="w-[180px] h-[265px] bg-[#f6f6f6] border border-[#e1e1e1] rounded-[16px] overflow-hidden relative">
      <div className="w-[100%] h-[180px] relative">
        <img
          src={avatar}
          alt="user"
          className="w-[100%] h-[100%] rounded-[5px] border-b-[1px] object-cover"
        />
        <div className="absolute top-[10px] right-[10px] pointer-events-none">
          {head === "Boss" && (
            <div className="flex items-center gap-[6px] px-[10px] py-[4px] bg-[#ffffff] border-[1px] rounded-[10px]">
              <span className="text-[12px] p-[5px] text-[#313131]"><FiEdit2 size={12} /></span>
              <span className="text-[12px] font-[600] text-[#313131]">Edit</span>
            </div>
          )}
        </div>
      </div>
      <div className="px-[16px] py-[12px]">
        <div className="text-[14px] font-[600] text-[#313131]">{head}</div>
        <div className="text-[12px] text-[#9ca3af]">{text}</div>
      </div>
    </div>
  );
}
