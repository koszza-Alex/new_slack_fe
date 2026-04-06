"use client";

import { useEffect, useState } from "react";
import { HuddleCustomButton } from "./HuddleCustomButton";

export function FloatingActionButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = document.querySelector(".myHuddle") as HTMLElement | null;
    if (!el) return;

    const onScroll = () => {
      setVisible(el.scrollTop > 120);
    };

    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    const el = document.querySelector(".myHuddle") as HTMLElement | null;
    if (!el) return;

    el.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div
      className={`
        fixed bottom-[24px] right-[24px]
        transition-opacity duration-300
        ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}
      `}
    >
      <HuddleCustomButton
        label="↑"
        onClick={handleClick}
        bgColor="#6200ee"
        textColor="#ffffff"
        hoverColor="#5a00d1"
        activeColor="#4b00b5"
        height="56px"
        width="56px"
        rounded="9999px"
        fontSize="20px"
        border="none"
      />
    </div>
  );
}