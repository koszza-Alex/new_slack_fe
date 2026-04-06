
type DirectoriesSideItemProps = {
  quote: string;
  name: string;
  role: string;
  image: string;
};

export default function DirectoriesSideItem({
  quote,
  name,
  role,
  image,
}: DirectoriesSideItemProps) {
  return (
    <div className="w-full flex-shrink-0 flex items-center gap-[20px]">
      <img
        src={image}
        alt={name}
        className="w-[64px] h-[64px] rounded-full object-cover"
      />

      <div>
        <p className="text-[15px] text-[#212121] mb-[10px] leading-[1.5] max-w-[520px]">
          {quote}
        </p>

        <p className="text-[14px] text-[black] font-[500]">
          {name}
        </p>
        <p className="text-[12px] text-[#313131]">
          {role}
        </p>
      </div>
    </div>
  );
}