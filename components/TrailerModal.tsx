"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const ReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
});

export default function TrailerModal({ videoKey }: { videoKey: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-2.5 font-semibold text-black shadow hover:brightness-105"
      >
        ▶ Trailer
      </button>

      {open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-xl">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute right-5 top-5 rounded-full bg-white/10 px-4 py-2 text-white ring-1 ring-white/20 hover:bg-white/20"
          >
            ✕
          </button>

          <div className="w-full max-w-5xl overflow-hidden rounded-[28px] border border-white/10 bg-black shadow-[0_0_100px_rgba(255,184,0,0.2)]">
            <div className="relative w-full overflow-hidden bg-black aspect-video">
               <div className="relative aspect-video w-full overflow-hidden bg-black">
                <ReactPlayer
                    src={`https://www.youtube.com/watch?v=${videoKey}`}
                    playing
                    muted={false}
                    controls
                    width="100%"
                    height="100%"
                    style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    }}
                />
                </div> 
            </div>
          </div>
        </div>
      )}
    </>
  );
}