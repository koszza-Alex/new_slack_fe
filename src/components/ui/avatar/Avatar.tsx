export const LargeAvatar = () => {
  return (
    <div className="relative w-9.5 h-9.5 rounded-xl">
      <img
        src="/avatar.png"
        className="w-full h-full object-cover rounded-[10px] cursor-pointer"
      />
      <div className="absolute bottom-[-2px] right-[-2px] w-2/5 h-2/5 bg-green-500 border-3 border-[#3F0E40] rounded-full" />
    </div>
  )
}

export const SmallAvatar = () => {
  return (
    <div className="relative w-4.5 h-4.5 rounded-sm">
      <img
        src="/avatar.png"
        className="w-full h-full object-cover rounded-sm cursor-pointer"
      />
      <div className="absolute bottom-[-2px] right-[-2px] w-1/2 h-1/2 bg-green-500 border-2 border-[#3F0E40] rounded-full" />
    </div>
  )
}