"use client";

import { useState } from "react";

type Props = {
    children: React.ReactNode;
};

export default function BottomDrawer({ children }: Props) {
    const [open, setOpen] = useState(false);

    return (
        <div className="fixed bottom-0 left-0 w-full z-50 flex justify-center pointer-events-none">

            {/* Container */}
            <div
                className={`
          w-full max-w-3xl
          transition-transform duration-300
          pointer-events-auto
          ${open ? "translate-y-0" : "translate-y-[92%]"}
        `}
            >

                {/* Caret Button */}
                <button
                    onClick={() => setOpen(!open)}
                    className="absolute -top-8 left-1/2 -translate-x-1/2 text-white text-3xl"
                >
          <span
              className={`transition-transform duration-300 ${
                  open ? "rotate-180" : ""
              }`}
          >
            ^
          </span>
                </button>

                {/* Drawer Panel */}
                <div className="bg-black text-white rounded-t-2xl shadow-2xl p-6 max-h-[75vh] overflow-y-auto">
                    {children}
                </div>

            </div>
        </div>
    );
}