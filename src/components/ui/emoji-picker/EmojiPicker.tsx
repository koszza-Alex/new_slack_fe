"use client";

import Picker from "@emoji-mart/react";

type Props = {
  onSelect: (emoji: string) => void;
};

/**
 * Renders the emoji-mart Picker.
 * Positioning is handled entirely by the parent wrapper — this component
 * is a plain unstyled container so callers can anchor it however they need.
 */
export default function EmojiPicker({ onSelect }: Props) {
  return (
    <div className="shadow-lg">
      <Picker
        data={async () =>
          fetch("https://cdn.jsdelivr.net/npm/@emoji-mart/data").then((res) =>
            res.json()
          )
        }
        onEmojiSelect={(emoji: any) => {
          onSelect(emoji.native);
        }}
      />
    </div>
  );
}