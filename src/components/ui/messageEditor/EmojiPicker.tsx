"use client";

import Picker from "@emoji-mart/react";

type Props = {
  onSelect: (emoji: string) => void;
};

export default function EmojiPicker({ onSelect }: Props) {
  return (
    <div className="absolute bottom-12 left-0 z-50 shadow-lg">
      <Picker
        data={async () =>
          fetch("https://cdn.jsdelivr.net/npm/@emoji-mart/data").then((res) =>
            res.json()
          )
        }
        onEmojiSelect={(emoji: any) => {
          onSelect(emoji.native); // ✅ send emoji UP
        }}
      />
    </div>
  );
}