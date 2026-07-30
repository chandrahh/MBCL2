"use client";

import { TEAM_MEMBERS } from "@/config/team";

export function NameSelector({ onSelect }: { onSelect: (name: string) => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-10 gap-6">
      <h1 className="text-3xl font-bold text-center text-slate-800">
        Papan Status Tim
      </h1>
      <p className="text-xl text-center text-slate-600 max-w-md">
        Kamu siapa? Pilih namamu di bawah ini.
      </p>
      <div className="w-full max-w-md flex flex-col gap-3">
        {TEAM_MEMBERS.map((name) => (
          <button
            key={name}
            onClick={() => onSelect(name)}
            className="w-full rounded-2xl bg-white border-2 border-slate-300 py-5 text-2xl font-semibold text-slate-800 shadow-sm active:bg-slate-200 active:scale-[0.99] transition"
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}
