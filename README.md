# Papan Status Tim

Aplikasi web sederhana untuk melihat status kerja tim (5-10 orang) secara real-time.
Setiap orang hanya bisa mengubah barisnya sendiri: status (**Belum Mulai / Dikerjakan / Selesai**) dan tugas singkat yang sedang dikerjakan.

## Fitur

- Satu layar, publik, tanpa login. Semua orang bisa lihat semua baris.
- Setiap orang pilih namanya sekali dari dropdown, tersimpan di browser (localStorage), lalu bisa langsung update statusnya sendiri.
- Update near-real-time: layar polling data baru tiap beberapa detik, plus tombol "Perbarui" untuk refresh manual.
- Daftar nama anggota tim diatur lewat 1 file (`src/config/team.ts`) yang bisa kamu edit sendiri.

## Edit Daftar Anggota Tim

Buka `src/config/team.ts` dan ubah isi array `TEAM_MEMBERS` sesuai nama tim kamu. Setelah commit & push, Vercel akan build ulang otomatis.

```ts
export const TEAM_MEMBERS: string[] = [
  "Nama 1",
  "Nama 2",
  // ...
];
```

## Cara Setup & Deploy ke Vercel (step-by-step)

Aplikasi ini butuh 1 database kecil untuk menyimpan status (siapa lagi ngerjain apa). Kita pakai **Upstash for Redis**, karena gratis untuk skala kecil dan paling cepat disetup di Vercel (tinggal klik, tanpa perlu bikin akun terpisah).

### 1. Push kode ini ke GitHub

Pastikan repo ini ada di akun GitHub kamu (atau sudah kamu fork/clone ke sana).

### 2. Import project ke Vercel

1. Buka [vercel.com](https://vercel.com) dan login (bisa pakai akun GitHub).
2. Klik **Add New → Project**.
3. Pilih repo GitHub ini, lalu klik **Import**.
4. Framework Preset akan otomatis terdeteksi sebagai **Next.js** — biarkan default, tidak perlu ubah apa-apa. Klik **Deploy**.
5. Deploy pertama ini kemungkinan akan **error/gagal** karena database belum disambungkan — itu wajar, lanjut ke langkah berikutnya.

### 3. Tambahkan database Upstash Redis

1. Di dashboard project Vercel kamu, buka tab **Storage**.
2. Klik **Create Database** (atau **Browse Marketplace** jika tidak ada tombol itu).
3. Pilih **Upstash** → **Redis** (paket gratis/"Free" sudah cukup untuk tim 5-10 orang).
4. Ikuti wizard-nya (pilih nama database & region terdekat, misalnya Singapore), lalu klik **Continue/Create**.
5. Setelah selesai, Vercel akan otomatis membuat environment variable yang dibutuhkan (biasanya bernama `KV_REST_API_URL` dan `KV_REST_API_TOKEN`, atau `UPSTASH_REDIS_REST_URL` dan `UPSTASH_REDIS_REST_TOKEN`) dan menyambungkannya ke project ini. Aplikasi ini sudah bisa membaca kedua penamaan tersebut, jadi tidak perlu diubah manual.

### 4. Redeploy

1. Kembali ke tab **Deployments** di project Vercel kamu.
2. Klik menu titik tiga (`...`) di deployment paling atas → **Redeploy**.
3. Setelah selesai, buka URL project kamu (`https://nama-project-kamu.vercel.app`) — aplikasi sudah siap dipakai.

### Kalau environment variable belum otomatis terisi

Buka **Settings → Environment Variables** di project Vercel kamu dan isi manual (nilai didapat dari dashboard Upstash, database → tab REST API):

| Nama Variable | Isi dengan |
|---|---|
| `KV_REST_API_URL` | REST URL dari Upstash |
| `KV_REST_API_TOKEN` | REST Token dari Upstash |

Lihat juga `.env.example` di repo ini sebagai referensi nama variable.

Setelah mengisi, klik **Redeploy** lagi.

## Menjalankan di komputer sendiri (opsional, untuk development)

```bash
npm install
cp .env.example .env.local
# isi .env.local dengan KV_REST_API_URL & KV_REST_API_TOKEN dari Upstash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## Yang sengaja tidak ada di versi ini

Sesuai kesepakatan awal — biar cepat selesai dan tetap sederhana:

- Tidak ada tambah/hapus anggota tim dari UI (edit manual lewat `src/config/team.ts`).
- Tidak ada banyak tugas per orang (1 orang = 1 status = 1 tugas aktif).
- Tidak ada notifikasi, riwayat status, dashboard/laporan, role admin, atau dark mode.
