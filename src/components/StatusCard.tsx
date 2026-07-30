"use client";

import { useState } from "react";
import { MemberStatus, Status, STATUS_LABEL, STATUS_VALUES } from "@/lib/types";
import { formatRelativeTime } from "@/lib/time";

const STATUS_STYLE: Record<Status, { badge: string; button: string; buttonActive: string }> = {
  belum_mulai: {
    badge: "bg-red-100 text-red-700 border border-red-300",
    button: "border-2 border-red-300 text-red-700 bg-white",
    buttonActive: "bg-red-500 text-white border-2 border-red-500",
  },
  dikerjakan: {
    badge: "bg-amber-100 text-amber-800 border border-amber-300",
    button: "border-2 border-amber-300 text-amber-800 bg-white",
    buttonActive: "bg-amber-500 text-white border-2 border-amber-500",
  },
  selesai: {
    badge: "bg-green-100 text-green-700 border border-green-300",
    button: "border-2 border-green-300 text-green-700 bg-white",
    buttonActive: "bg-green-500 text-white border-2 border-green-500",
  },
};

export function StatusCard({
  member,
  now,
  isMine,
  onChangeStatus,
  onSaveTask,
  saving,
}: {
  member: MemberStatus;
  now: number;
  isMine: boolean;
  onChangeStatus: (status: Status) => void;
  onSaveTask: (task: string) => void;
  saving: boolean;
}) {
  const [taskDraft, setTaskDraft] = useState(member.task);
  const [dirty, setDirty] = useState(false);
  const displayedTask = dirty ? taskDraft : member.task;

  const style = STATUS_STYLE[member.status];

  return (
    <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xl font-bold text-slate-800">
          {member.name}
          {isMine && <span className="ml-2 text-sm font-normal text-slate-500">(kamu)</span>}
        </span>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap ${style.badge}`}>
          {STATUS_LABEL[member.status]}
        </span>
      </div>

      {!isMine && (
        <>
          <p className="text-lg text-slate-700 break-words">
            {member.task || <span className="text-slate-400 italic">Belum ada tugas diisi</span>}
          </p>
          <p className="text-sm text-slate-400">{formatRelativeTime(member.updatedAt, now)}</p>
        </>
      )}

      {isMine && (
        <>
          <div className="grid grid-cols-3 gap-2">
            {STATUS_VALUES.map((status) => (
              <button
                key={status}
                onClick={() => onChangeStatus(status)}
                className={`rounded-xl py-3 text-base font-semibold transition ${
                  member.status === status ? style.buttonActive : STATUS_STYLE[status].button
                }`}
              >
                {STATUS_LABEL[status]}
              </button>
            ))}
          </div>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-slate-600">Tugas singkat</span>
            <input
              type="text"
              value={displayedTask}
              maxLength={60}
              placeholder='contoh: "Desain banner klien X"'
              onChange={(e) => {
                setDirty(true);
                setTaskDraft(e.target.value);
              }}
              className="w-full rounded-xl border-2 border-slate-300 px-3 py-3 text-lg text-slate-800"
            />
          </label>

          <button
            onClick={() => {
              onSaveTask(taskDraft);
              setDirty(false);
            }}
            disabled={saving}
            className="w-full rounded-xl bg-slate-800 text-white text-lg font-semibold py-3 active:bg-slate-700 disabled:opacity-50"
          >
            {saving ? "Menyimpan..." : "Simpan Tugas"}
          </button>

          <p className="text-sm text-slate-400">{formatRelativeTime(member.updatedAt, now)}</p>
        </>
      )}
    </div>
  );
}
