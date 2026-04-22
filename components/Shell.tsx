// components/Shell.tsx
'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';

export default function Shell({
  sidebar,
  navbar,
  children,
}: {
  sidebar?: React.ReactNode;
  navbar?: React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true); // default open on desktop; you can start false

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1020] via-[#151a33] to-[#0a0d1a] text-white">
      {/* Top bar (pass your existing navbar) */}
      <div className="sticky top-0 z-30 border-b border-white/10 bg-black/30 backdrop-blur">
        {/* Inject a toggle into your navbar via props or render a small local one */}
        <div className="flex items-center gap-2 px-4 h-14">
          {/* Small toggle – remove if your Navbar already has it */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-xl border border-white/15 px-3 py-1.5 text-sm hover:bg-white/10"
          >
            {open ? 'Hide' : 'Show'} menu
          </button>
          <div className="flex-1">{navbar}</div>
        </div>
      </div>

      {/* Layout */}
      <div className="relative">
        {/* Sidebar (collapsible / off-canvas on small screens) */}
        <Sidebar open={open} onClose={() => setOpen(false)}>
          {sidebar}
        </Sidebar>

        {/* Main content: when sidebar closed, use full width */}
        <main
          className={`transition-[margin] duration-300 ${
            open ? 'lg:ml-72' : 'lg:ml-0'
          }`}
        >
          {/* Add some padding so content isn’t flush to edges */}
          <div className="px-4 py-6 md:px-6">{children}</div>
        </main>
      </div>
    </div>
  );
}