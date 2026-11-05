# Endpoint Usage Map — RTConnect API Integration

Dokumen ini adalah panduan teknis dan peta integrasi resmi antara Frontend **RTConnect** (React + Vite + Tailwind CSS) dan Backend **RTConnect REST API** yang telah aktif (*live*) di cloud Railway.

---

## 1. Konfigurasi Lingkungan (Environment Setup)

### Base URL
- **Production / Cloud Base URL:** `https://rtconnectapi.up.railway.app`
- **Prefix Endpoint API:** `/api/v1`
- **Full API Base URL:** `https://rtconnectapi.up.railway.app/api/v1`

### File `.env` pada Frontend (`RTConect/.env`)
Buat atau perbarui file `.env` pada root project frontend:
```env
VITE_API_BASE_URL=https://rtconnectapi.up.railway.app/api/v1
```

---

## 2. Standar Protokol & Komunikasi Data

### A. Format Request Headers
Seluruh endpoint privat (memerlukan login) wajib menyertakan header Bearer Token:
```http
Authorization: Bearer <access_token>
Content-Type: application/json
Accept: application/json
```

### B. Format Respons API
#### 1. Sukses (`200 OK`, `201 Created`, `204 No Content`)
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

#### 2. Gagal / Error (`400`, `401`, `403`, `404`, `422`, `500`)
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Periksa kembali data yang dikirim.",
    "details": [
      {
        "field": "email",
        "message": "Format email tidak valid."
      }
    ]
  }
}
```

### C. Mekanisme Refresh Token & Session Expired
1. Akses Token (`token`) memiliki masa aktif **1 Jam**.
2. Refresh Token (`refreshToken`) memiliki masa aktif **7 Hari**.
3. Jika request mendapatkan status HTTP `401 UNAUTHORIZED`, frontend otomatis memanggil `POST /auth/refresh` dengan payload `{ "refreshToken": "<stored_refresh_token>" }`.
4. Jika refresh token juga kedaluwarsa atau tidak valid, hapus token dari storage lokal dan arahkan pengguna ke halaman `/login`.

---

## 3. Akun Pengujian Live (Demo Credentials)

Gunakan akun berikut untuk memvalidasi integrasi per role:

| Role | Email Login | Password | Cakupan Akses |
|---|---|---|---|
| **Warga** | `warga@rtconnect.id` | `Password123!` | RT 01 (Layanan warga: Surat, Iuran, Aspirasi, Profil) |
| **Ketua RT** | `ketua.rt01@rtconnect.id` | `Password123!` | RT 01 (Kelola warga, verifikasi surat pengantar, agenda) |
| **Bendahara RT** | `bendahara@rtconnect.id` | `Password123!` | RT 01 (Kelola kas, tagihan iuran, verifikasi transfer) |
| **Ketua RW** | `admin@rtconnect.id` | `Password123!` | Seluruh RW 05 (Laporan gabungan, surat RW, pengaturan wilayah) |

---

## 4. Peta Penggunaan Endpoint per Modul Frontend

### Modul 1: Autentikasi & Akun Pengguna (`src/pages/auth/`)

| Halaman / Komponen | Aksi / Fitur UI | HTTP Method | Endpoint API | Request Body / Query Params |
|---|---|---|---|---|
| `LoginPage.jsx` | Login akun | `POST` | `/auth/login` | `{ "email": "...", "password": "..." }` atau `{ "nik": "...", "password": "..." }` |
| `Navbar.jsx` / `Shell.jsx` | Logout keluar | `POST` | `/auth/logout` | `{ "refreshToken": "..." }` |
| HTTP Interceptor | Perbarui access token | `POST` | `/auth/refresh` | `{ "refreshToken": "..." }` |
| `ForgotPasswordPage.jsx` | Minta tautan reset | `POST` | `/auth/forgot-password` | `{ "email": "..." }` |
| `ForgotPasswordPage.jsx` | Reset kata sandi baru | `POST` | `/auth/reset-password` | `{ "token": "...", "newPassword": "..." }` |
| Seluruh Aplikasi / Context | Profil user login | `GET` | `/me` | Header `Bearer <token>` |
| `ProfilWarga.jsx` | Update profil & password | `PATCH` | `/me` | `{ "phone": "...", "avatarUrl": "...", "currentPassword": "...", "newPassword": "..." }` |

---

### Modul 2: Beranda & Dashboard (`src/pages/warga/BerandaWarga.jsx`, `src/pages/pengurus/DashboardPengurus.jsx`)

| Halaman / Komponen | Aksi / Fitur UI | HTTP Method | Endpoint API | Keterangan / Scope Data |
|---|---|---|---|---|
| `DashboardPengurus.jsx` | Ringkasan kartu statistik | `GET` | `/dashboard/summary` | Total warga, KK, saldo kas, antrean surat & tagihan |
| `DashboardPengurus.jsx` | Feed log aktivitas terkini | `GET` | `/dashboard/activities` | Riwayat transaksi kas, pengajuan surat, pembayaran |
| `DashboardPengurus.jsx` | Tindakan pending (To-Do) | `GET` | `/dashboard/pending-tasks` | Surat butuh approval, bukti bayar butuh verifikasi |
| `BerandaWarga.jsx` | Quick stats & ringkasan | `GET` | `/dashboard/summary` | Status iuran bulan ini, surat aktif pemohon |

---

### Modul 3: Kependudukan & Data Warga (`src/pages/pengurus/WargaPengurus.jsx`)

| Aksi UI | HTTP Method | Endpoint API | Query / Payload |
|---|---|---|---|
| Ambil daftar warga | `GET` | `/residents` | Query: `?page=1&limit=20&search=&rt_id=&status=` |
| Ambil detail warga | `GET` | `/residents/:id` | Parameter: `id` (e.g. `res-01`) |
| Tambah warga baru | `POST` | `/residents` | `{ "nik": "...", "noKK": "...", "name": "...", "gender": "L/P", "birthPlace": "...", "birthDate": "YYYY-MM-DD", "religion": "...", "education": "...", "occupation": "...", "maritalStatus": "...", "familyRelationship": "...", "rtId": "...", "address": "...", "phone": "..." }` |
| Ubah data warga | `PATCH` | `/residents/:id` | Data warga yang diperbarui |
| Ambil daftar Kartu Keluarga | `GET` | `/families` | Query: `?page=1&limit=20&search=&rt_id=` |
| Tambah Kartu Keluarga | `POST` | `/families` | `{ "noKK": "...", "headOfFamilyId": "...", "rtId": "...", "address": "..." }` |
| Ubah data Kartu Keluarga | `PATCH` | `/families/:id` | Data KK yang diperbarui |

---

### Modul 4: Layanan Surat Administrasi (`src/pages/warga/SuratWarga.jsx`, `src/pages/pengurus/SuratPengurus.jsx`)

| Halaman | Aksi UI | HTTP Method | Endpoint API | Payload / Query |
|---|---|---|---|---|
| Warga / Pengurus | Daftar jenis surat | `GET` | `/letters/types` | Mengambil opsi surat & format persyaratan |
| Warga | Riwayat permohonan surat | `GET` | `/letters/requests` | Otomatis terfilter per user yang login |
| Warga | Ajukan permohonan surat | `POST` | `/letters/requests` | `{ "letterTypeId": "...", "purpose": "...", "attachments": [...] }` |
| Warga | Ubah/revisi draft surat | `PATCH` | `/letters/requests/:id` | `{ "purpose": "...", "attachments": [...] }` |
| Pengurus | Daftar pengajuan warga | `GET` | `/letters/requests` | Query: `?status=&letterTypeId=&page=1&limit=20` |
| Pengurus | Setujui / Tolak permohonan | `POST` | `/letters/requests/:id/review` | `{ "status": "Disetujui/Ditolak/Perlu Revisi", "notes": "...", "letterNumber": "..." }` |
| Warga / Pengurus | Unduh/Pratinjau dokumen surat | `GET` | `/letters/requests/:id/document` | Mengembalikan detail lengkap format surat & QR verifikasi |

---

### Modul 5: Keuangan Kas (`src/pages/pengurus/KeuanganPengurus.jsx`)

| Aksi UI | HTTP Method | Endpoint API | Payload / Query |
|---|---|---|---|
| Ringkasan saldo kas & bulanan | `GET` | `/finance/summary` | Saldo berjalan, total pemasukan, total pengeluaran |
| Daftar mutasi transaksi kas | `GET` | `/finance/transactions` | Query: `?type=in/out&startDate=&endDate=&page=1&limit=20` |
| Catat kas masuk / keluar | `POST` | `/finance/transactions` | `{ "type": "in/out", "category": "...", "amount": 50000, "description": "...", "transactionDate": "YYYY-MM-DD", "proofUrl": "..." }` |
| Koreksi transaksi kas (Audit Trail) | `PATCH` | `/finance/transactions/:id` | `{ "amount": ..., "description": "...", "auditNote": "Alasan koreksi transaksi..." }` |

---

### Modul 6: Iuran Lingkungan (`src/pages/warga/IuranWarga.jsx`, `src/pages/pengurus/IuranPengurus.jsx`)

| Halaman | Aksi UI | HTTP Method | Endpoint API | Payload / Query |
|---|---|---|---|---|
| Pengurus | Daftar jenis & tarif iuran | `GET` | `/dues/types` | Opsi jenis iuran (Kebersihan, Keamanan, dll) |
| Pengurus | Buat tarif iuran baru | `POST` | `/dues/types` | `{ "name": "...", "amount": 35000, "periodType": "monthly", "description": "..." }` |
| Pengurus | Daftar semua tagihan | `GET` | `/dues/bills` | Query: `?duesTypeId=&status=&period=&page=1&limit=20` |
| Pengurus | Generate tagihan periode baru | `POST` | `/dues/bills/generate` | `{ "duesTypeId": "...", "period": "2026-11" }` |
| Pengurus | Verifikasi bukti pembayaran | `POST` | `/dues/payments/:id/verify` | `{ "status": "verified/rejected", "notes": "..." }` |
| Warga | Ambil tagihan saya | `GET` | `/dues/my-bills` | Daftar tagihan aktif milik warga yang login |
| Warga / Pengurus | Konfirmasi bayar / upload bukti | `POST` | `/dues/payments` | `{ "billId": "...", "amount": 35000, "paymentMethod": "transfer/cash", "paymentProofUrl": "...", "notes": "..." }` |

---

### Modul 7: Pengumuman & Agenda Kegiatan (`src/pages/warga/PengumumanWarga.jsx`, `src/pages/pengurus/PengumumanPengurus.jsx`, `AgendaPengurus.jsx`)

| Halaman | Aksi UI | HTTP Method | Endpoint API | Payload / Query |
|---|---|---|---|---|
| Warga / Pengurus | Daftar pengumuman | `GET` | `/announcements` | Query: `?page=1&limit=20&search=` |
| Pengurus | Buat pengumuman baru | `POST` | `/announcements` | `{ "title": "...", "content": "...", "category": "...", "isPinned": true, "attachments": [...] }` |
| Pengurus | Ubah pengumuman | `PATCH` | `/announcements/:id` | Data pembaruan pengumuman |
| Pengurus | Hapus/arsipkan pengumuman | `DELETE` | `/announcements/:id` | - |
| Warga / Pengurus | Daftar agenda kegiatan | `GET` | `/events` | Query: `?startDate=&endDate=&page=1&limit=20` |
| Pengurus | Buat agenda baru | `POST` | `/events` | `{ "title": "...", "description": "...", "location": "...", "startTime": "...", "endTime": "..." }` |
| Pengurus | Ubah agenda kegiatan | `PATCH` | `/events/:id` | Data pembaruan kegiatan |
| Pengurus | Hapus agenda kegiatan | `DELETE` | `/events/:id` | - |

---

### Modul 8: Aspirasi & Aduan Warga (`src/pages/warga/AspirasiWarga.jsx`, `src/pages/pengurus/AspirasiPengurus.jsx`)

| Halaman | Aksi UI | HTTP Method | Endpoint API | Payload / Query |
|---|---|---|---|---|
| Warga / Pengurus | Daftar aspirasi | `GET` | `/complaints` | Filter otomatis (warga melihat milik sendiri/publik, pengurus melihat wilayahnya) |
| Warga | Buat aspirasi / aduan baru | `POST` | `/complaints` | `{ "title": "...", "description": "...", "category": "...", "isAnonymous": false, "attachments": [...] }` |
| Pengurus | Update status aspirasi | `PATCH` | `/complaints/:id` | `{ "status": "Ditinjau/Diproses/Selesai/Ditolak", "priority": "normal/high" }` |
| Pengurus | Beri tanggapan resmi | `POST` | `/complaints/:id/responses` | `{ "message": "...", "isPublic": true }` |

---

### Modul 9: Aset Inventaris RT (`src/pages/pengurus/InventarisPengurus.jsx`)

| Aksi UI | HTTP Method | Endpoint API | Payload / Query |
|---|---|---|---|
| Ambil daftar aset inventaris | `GET` | `/assets` | Query: `?condition=&status=&search=&page=1&limit=20` |
| Tambah aset baru | `POST` | `/assets` | `{ "name": "...", "code": "...", "category": "...", "quantity": 10, "unit": "Unit/Buah", "condition": "Baik", "location": "Balai RT" }` |
| Ubah kondisi/status aset | `PATCH` | `/assets/:id` | Data pembaruan aset |

---

### Modul 10: Pengaturan & Manajemen Pengguna (`src/pages/pengurus/PengaturanPengurus.jsx`)

| Aksi UI | HTTP Method | Endpoint API | Payload / Query |
|---|---|---|---|
| Ambil data profil wilayah RT/RW | `GET` | `/settings/region` | Informasi RT, nama ketua, nomor rekening kas |
| Simpan pengaturan wilayah | `PATCH` | `/settings/region` | `{ "bankName": "...", "bankAccountNumber": "...", "bankAccountHolder": "...", "notes": "..." }` |
| Daftar akun pengguna (Admin/RW) | `GET` | `/users` | Query: `?page=1&limit=20&role=&search=` |
| Buat akun pengurus/warga baru | `POST` | `/users` | `{ "username": "...", "email": "...", "password": "...", "role": "...", "residentId": "..." }` |
| Ubah peran atau status akun | `PATCH` | `/users/:id` | `{ "role": "...", "isActive": true/false }` |

---

### Modul 11: Notifikasi Sistem (`src/components/layout/Navbar.jsx`)

| Aksi UI | HTTP Method | Endpoint API | Keterangan |
|---|---|---|---|
| Ambil daftar notifikasi | `GET` | `/notifications` | Query: `?unreadOnly=true&limit=10` |
| Tandai satu dibaca | `PATCH` | `/notifications/:id/read` | Status menjadi read |
| Tandai semua dibaca | `PATCH` | `/notifications/read-all` | Seluruh notifikasi user ditandai dibaca |

---

## 5. Rencana Transisi Arsitektur (Phase 4 Execution)

Saat ini frontend menggunakan `src/services/mockService.js` yang mengembalikan data in-memory. Untuk melakukan eksekusi integrasi:

```
[UI Pages & Components]
         │
         ▼
[src/context/AppContext.jsx]
         │
         ▼
[src/services/api.js]  <-- Menggantikan mockService.js
         │
   (Axios Client + Token Interceptor)
         │
         ▼
[Railway Cloud REST API: https://rtconnectapi.up.railway.app/api/v1]
```

### Rekomendasi Pembuatan HTTP Client (`src/services/api.js`):
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://rtconnectapi.up.railway.app/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Pasang Bearer Token otomatis
api.interceptors.request.use(config => {
  const token = localStorage.getItem('rtconnect_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Tangani 401 & Refresh Token otomatis
api.interceptors.response.use(
  response => response.data,
  async error => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('rtconnect_refresh_token');
      if (refreshToken) {
        try {
          const res = await axios.post(`${api.defaults.baseURL}/auth/refresh`, { refreshToken });
          const newToken = res.data.data.token;
          localStorage.setItem('rtconnect_token', newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } catch (refreshErr) {
          localStorage.removeItem('rtconnect_token');
          localStorage.removeItem('rtconnect_refresh_token');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error.response?.data?.error || error);
  }
);

export default api;
```

---

*Dokumen ini merupakan acuan resmi untuk eksekusi Phase 4 (Integrasi Frontend & QA).*

