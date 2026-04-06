import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
  avatar: string;
  name: string;
  email: string;
  time: string;
  icon:IconProp,
  isthread:boolean
};

export function SentItem({ avatar, name, email, time,icon,isthread }: Props) {
  return (
    <div
      className="
        flex items-center justify-between
        px-[16px] py-[12px]
        border-b
        border-[#a1a1a1]
        bg-transparent
        hover:bg-[#e1e1e1]
        transition-colors duration-200
        cursor-pointer
      "
    >
      {/* LEFT */}
      <div className="flex items-center gap-[12px]">
        {avatar?<img
          src={avatar}
          alt={name}
          className="w-[36px] h-[36px] rounded-[6px] object-cover"
        />:<FontAwesomeIcon icon={icon}/>}

        <div className="flex flex-col">
          <span className="text-[14px] text-white font-medium leading-[18px]">
            {name}{isthread&&"isthread"}
          </span>
          <span className="text-[13px] text-[#4da6ff]">
            {email}
          </span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="text-[12px] text-[#313131]">
        {time}
      </div>
    </div>
  );
}