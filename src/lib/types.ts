export const STATUS_VALUES = ["belum_mulai", "dikerjakan", "selesai"] as const;

export type Status = (typeof STATUS_VALUES)[number];

export const STATUS_LABEL: Record<Status, string> = {
  belum_mulai: "Belum Mulai",
  dikerjakan: "Dikerjakan",
  selesai: "Selesai",
};

export type MemberStatus = {
  name: string;
  status: Status;
  task: string;
  updatedAt: number | null;
};

export function isStatus(value: unknown): value is Status {
  return typeof value === "string" && (STATUS_VALUES as readonly string[]).includes(value);
}
