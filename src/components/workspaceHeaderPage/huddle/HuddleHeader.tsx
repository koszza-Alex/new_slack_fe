import { HuddleCustomButton } from "./HuddleCustomButton";

export function HuddlesHeader() {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-[18px] font-[700] text-[#313131]">
        Huddles
      </h1>

      <HuddleCustomButton
        label="+ New Huddle"
        bgColor="#ffffff"
        textColor="#1d1c1d"
        hoverColor="#f4f4f4"
        border="1px solid #d1d2d3"
        height="32px"
        px="12px"
        rounded="6px"
        fontSize="13px"
      />
    </div>
  );
}