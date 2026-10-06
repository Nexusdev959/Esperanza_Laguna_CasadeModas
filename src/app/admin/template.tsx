"use client";

import { ReactNode } from "react";

export default function AdminTemplate({ children }: { children: ReactNode }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-[10px] duration-500 ease-out fill-mode-both h-full">
      {children}
    </div>
  );
}
