"use client";

import { IconType } from "react-icons";
import {
  useState, useRef, useEffect, createContext, useContext, ReactNode,
} from "react";

type Ctx = {
  open: boolean;
  setOpen: (v: boolean) => void;
  value: string;
  setValue: (v: string) => void;
};

const DirectoriesDropdownBtnCtx = createContext<Ctx | null>(null);

function useDropdown() {
  const ctx = useContext(DirectoriesDropdownBtnCtx);
  if (!ctx) throw new Error("Use inside <DirectoriesDropdownBtn>");
  return ctx;
}

export default function DirectoriesDropdownBtn({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  return (
    <DirectoriesDropdownBtnCtx.Provider value={{ open, setOpen, value, setValue }}>
      <div ref={ref} className="relative inline-block">{children}</div>
    </DirectoriesDropdownBtnCtx.Provider>
  );
}

DirectoriesDropdownBtn.Trigger = function Trigger({ placeholder = "Select" }: { placeholder?: string }) {
  const { open, setOpen, value } = useDropdown();
  return (
    <button
      onClick={() => setOpen(!open)}
      className="flex items-center justify-between gap-[6px] px-[10px] h-[32px] rounded-[6px] text-[#313131] text-[14px] font-[500] bg-transparent border border-[#717171] hover:bg-[#e1e1e1] active:bg-[#c1c1c1] transition-all duration-[120ms]"
    >
      <span>{value || placeholder}</span>
      <svg className={`w-[12px] h-[12px] transition-transform duration-[200ms] ${open ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor">
        <path d="M5 7l5 5 5-5H5z" />
      </svg>
    </button>
  );
};

DirectoriesDropdownBtn.Content = function Content({ children }: { children: ReactNode }) {
  const { open } = useDropdown();
  return (
    <div className={`absolute left-0 top-[40px] z-[9999] w-[260px] bg-[#ffffff] border border-[#1f2937] rounded-[10px] p-[12px] transition-all duration-[200ms] origin-top ${open ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-[6px] pointer-events-none"}`}>
      {children}
    </div>
  );
};

DirectoriesDropdownBtn.Search = function Search({ placeholder }: { placeholder?: string }) {
  return (
    <input placeholder={placeholder} className="w-full h-[36px] px-[10px] rounded-[8px] bg-[#ffffff] border border-[#1f2937] text-[#313131] text-[13px] outline-none focus:border-[#38bdf8] focus:ring-[1px] focus:ring-[#38bdf8]" />
  );
};

DirectoriesDropdownBtn.List = function List({ label, icon: Icon }: { label: string; icon?: IconType }) {
  return (
    <div className="flex items-center gap-[8px] px-[8px] py-[6px] rounded-[6px] text-[14px] text-[#313131] hover:bg-[#e1e1e1] cursor-pointer">
      {Icon && <Icon size={12} className="text-[#313131]" />}
      <span>{label}</span>
    </div>
  );
};

DirectoriesDropdownBtn.Check = function Check({ label }: { label: string }) {
  return (
    <label className="flex items-center gap-[8px] px-[8px] py-[6px] rounded-[6px] hover:bg-[#e1e1e1] cursor-pointer">
      <input type="checkbox" className="w-[12px] h-[12px] accent-[#38bdf8]" />
      <span className="text-[14px] text-[#313131]">{label}</span>
    </label>
  );
};

DirectoriesDropdownBtn.Radio = function Radio({ label, icon: Icon }: { label: string; icon?: IconType }) {
  const { value, setValue, setOpen } = useDropdown();
  const selected = value === label;

  return (
    <div
      onClick={() => { setValue(label); setOpen(false); }}
      className="flex items-center gap-[10px] px-[8px] py-[6px] rounded-[6px] hover:bg-[#e1e1e1] cursor-pointer"
    >
      <div className={`w-[16px] h-[16px] flex items-center justify-center rounded-[4px] border ${selected ? "bg-[#e1e1e1] border-[#38bdf8]" : "border-[#6b7280]"}`}>
        {selected && (
          <svg className="w-[10px] h-[10px] text-[#313131]" viewBox="0 0 20 20" fill="currentColor">
            <path d="M7.629 13.233L4.396 10l-1.414 1.414 4.647 4.647L17.02 6.67l-1.414-1.414z" />
          </svg>
        )}
      </div>
      {Icon && <Icon size={12} className="text-[#313131]" />}
      <span className="text-[#313131]">{label}</span>
    </div>
  );
};
