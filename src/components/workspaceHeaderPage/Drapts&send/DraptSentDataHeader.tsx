type Props = {
  date: string;
};

export function DateHeader({ date }: Props) {
  return (
    <div className="  w-full px-[24px] py-[12px]  z-10">
      <span className="text-[13px] text-[#313131] font-medium">
        {date}
      </span>
    </div>
  );
}