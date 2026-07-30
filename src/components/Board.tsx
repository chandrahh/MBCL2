"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MemberStatus, Status } from "@/lib/types";
import { NameSelector } from "./NameSelector";
import { StatusCard } from "./StatusCard";

const STORAGE_KEY = "papan-status-tim:nama";
const POLL_INTERVAL_MS = 4000;
const CLOCK_TICK_MS = 30000;

export function Board() {
  const [identity, setIdentity] = useState<string | null | undefined>(undefined);
  const [members, setMembers] = useState<MemberStatus[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [saving, setSaving] = useState(false);
  const savingRef = useRef(false);

  useEffect(() => {
    // localStorage tidak tersedia saat server-render, jadi identitas harus
    // dibaca di sisi client setelah mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIdentity(window.localStorage.getItem(STORAGE_KEY));
  }, []);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/status", { cache: "no-store" });
      if (!res.ok) throw new Error("Gagal mengambil data.");
      const data = await res.json();
      setMembers(data.members);
      setError(null);
    } catch {
      setError("Gagal memuat data. Cek koneksi internet kamu.");
    }
  }, []);

  useEffect(() => {
    // Polling data dari server (external system) - bukan sinkronisasi state React.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStatus();
    const pollId = setInterval(() => {
      if (!savingRef.current) fetchStatus();
    }, POLL_INTERVAL_MS);
    const clockId = setInterval(() => setNow(Date.now()), CLOCK_TICK_MS);
    return () => {
      clearInterval(pollId);
      clearInterval(clockId);
    };
  }, [fetchStatus]);

  const handleSelectName = (name: string) => {
    window.localStorage.setItem(STORAGE_KEY, name);
    setIdentity(name);
  };

  const handleSwitchName = () => {
    window.localStorage.removeItem(STORAGE_KEY);
    setIdentity(null);
  };

  const submitUpdate = async (name: string, status: Status, task: string) => {
    setSaving(true);
    savingRef.current = true;
    try {
      const res = await fetch("/api/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, status, task }),
      });
      if (!res.ok) throw new Error("Gagal menyimpan.");
      const data = await res.json();
      setMembers((prev) =>
        prev ? prev.map((m) => (m.name === name ? data.member : m)) : prev
      );
      setError(null);
    } catch {
      setError("Gagal menyimpan perubahan. Coba lagi.");
    } finally {
      setSaving(false);
      savingRef.current = false;
    }
  };

  if (identity === undefined) {
    return null;
  }

  if (identity === null) {
    return <NameSelector onSelect={handleSelectName} />;
  }

  const myEntry = members?.find((m) => m.name === identity);

  return (
    <div className="flex-1 flex flex-col max-w-md w-full mx-auto px-4 py-6 gap-4">
      <header className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-bold text-slate-800">Papan Status Tim</h1>
        <button
          onClick={handleSwitchName}
          className="text-sm text-slate-500 underline whitespace-nowrap"
        >
          Bukan {identity}?
        </button>
      </header>

      <button
        onClick={fetchStatus}
        className="w-full rounded-xl bg-white border-2 border-slate-300 text-slate-700 font-semibold py-3 text-lg active:bg-slate-200"
      >
        ↻ Perbarui
      </button>

      {error && (
        <p className="text-center text-red-600 bg-red-50 border border-red-200 rounded-xl py-2 px-3">
          {error}
        </p>
      )}

      {!members && !error && (
        <p className="text-center text-slate-500 py-10">Memuat data...</p>
      )}

      <div className="flex flex-col gap-3">
        {members?.map((member) => (
          <StatusCard
            key={member.name}
            member={member}
            now={now}
            isMine={member.name === identity}
            saving={saving}
            onChangeStatus={(status) =>
              submitUpdate(member.name, status, myEntry?.task ?? member.task)
            }
            onSaveTask={(task) =>
              submitUpdate(member.name, myEntry?.status ?? member.status, task)
            }
          />
        ))}
      </div>
    </div>
  );
}
