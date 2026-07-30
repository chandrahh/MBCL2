export function formatRelativeTime(timestamp: number | null, now: number): string {
  if (timestamp === null) return "belum pernah diubah";

  const diffSeconds = Math.max(0, Math.floor((now - timestamp) / 1000));

  if (diffSeconds < 60) return "diubah baru saja";

  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) {
    return `diubah ${diffMinutes} menit lalu`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `diubah ${diffHours} jam lalu`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `diubah ${diffDays} hari lalu`;
}
