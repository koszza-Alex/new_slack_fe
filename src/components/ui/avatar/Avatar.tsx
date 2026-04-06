interface AvatarProps {
    src?: string;
    alt?: string;
    /** Whether to show the presence dot */
    showPresence?: boolean;
    /** Whether the user is online — controls dot color */
    isOnline?: boolean;
}

export const LargeAvatar = ({ src = "/avatar.png", alt = "avatar", showPresence = true, isOnline = false }: AvatarProps) => {
    return (
        <div className="relative w-9.5 h-9.5 rounded-xl">
            <img
                src={src}
                alt={alt}
                className="w-full h-full object-cover rounded-[10px] cursor-pointer"
            />
            {showPresence && (
                <div
                    className={`absolute bottom-[-2px] right-[-2px] w-2/5 h-2/5 border-2 border-[#3F0E40] rounded-full ${
                        isOnline ? "bg-green-500" : "bg-[#3F0E40]"
                    }`}
                />
            )}
        </div>
    );
};

export const SmallAvatar = ({ src = "/avatar.png", alt = "avatar", showPresence = true, isOnline = false }: AvatarProps) => {
    return (
        <div className="relative w-4.5 h-4.5 rounded-sm">
            <img
                src={src}
                alt={alt}
                className="w-full h-full object-cover rounded-sm cursor-pointer"
            />
            {showPresence && (
                <div
                    className={`absolute bottom-[-2px] right-[-2px] w-1/2 h-1/2 border-2 border-[#3F0E40] rounded-full ${
                        isOnline ? "bg-green-500" : "bg-[#3F0E40]"
                    }`}
                />
            )}
        </div>
    );
};
