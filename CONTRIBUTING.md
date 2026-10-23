# CONTRIBUTING — Landing Page Conversion InDeepCleaningID

> **Untuk pembaca publik:** ini sistem produksi bisnis tertentu, bukan library
> umum. **Laporan bug lewat issue terbuka sangat diterima**, terima kasih!
> Soal keamanan jangan lewat issue publik, langsung hubungi Bang Rob.
>
> Aturan di bawah berlaku untuk **siapa pun** yang menyentuh repo ini,
> termasuk maintainer. Baca dokumen ini sepenuhnya sebelum mengubah apa pun.

## Aturan Utama

### 1. `main` = production, dilarang push langsung

Setiap push ke branch `main` **langsung ter-deploy otomatis ke Hostinger**
(`landingpage.indeepcleaningid.site`) dalam 15 sampai 20 detik. Karena itu:

- **Semua perubahan WAJIB lewat Pull Request (PR).**
- **Bang Rob mengecek manual dulu sebelum merge.** Jangan pernah merge PR
  sendiri, jangan pernah push langsung ke `main`, jangan pernah force-push.
- PR yang CI-nya merah jangan dilanjutkan review sampai hijau.

### 2. Setiap perubahan wajib dicatat di `ENGINEER.md`

Tiap PR **wajib** menambah entry baru di [`ENGINEER.md`](ENGINEER.md):

- Tanggal perubahan (YYYY-MM-DD)
- Judul singkat plus commit atau PR
- **Apa** yang berubah dan **kenapa**
- File yang kena (ringkas)

PR tanpa log `ENGINEER.md` = ditolak. Ini yang bikin riwayat sistem
terlacak saat ada tim nanti.

### 3. Setiap perubahan class Tailwind wajib di-build ulang

Tailwind **sudah dibundle** menjadi file statis. Halaman tidak memuat
`cdn.tailwindcss.com` lagi. Konsekuensinya:

- Setiap kali menambah class Tailwind baru di HTML, class itu **tidak
  langsung ada** di CSS. Wajib jalankan `npm run build:css`.
- **Jangan pernah** mengedit `assets/css/tailwind-base.css` atau
  `assets/css/tailwind-utils.css` secara manual. Kedua file itu hasil build
  dan akan tertimpa pada build berikutnya.
- Kalau perlu mengubah token warna atau font, edit `tailwind.config.js`, lalu
  build ulang.
- Kalau perlu menambah aturan base atau components, edit
  `assets/css/tailwind-input.css`. Untuk utility, edit
  `assets/css/tailwind-utils-input.css`.

**Jangan pernah memasang kembali CDN** sebagai jalan pintas. Itu
mengembalikan masalah performa yang sudah diperbaiki dan membuat dua sumber
Tailwind aktif bersamaan.

### 4. Aturan copywriting di halaman

Landing page ini penuh dengan angka, klaim kesehatan, dan nama produk.
Tiap teks yang masuk ke `index.html` wajib lolos cek berikut:

- Tidak ada emoji
- Tidak ada em dash
- Tidak ada semicolon
- Tidak ada slang seperti "gue", "lo", "lu", "elo"
- Icon selalu file SVG
- Angka statistik wajib punya sumber yang ditulis di bawah kartu

Detail lengkap ada di bagian "Aturan Copywriting" di [README.md](README.md).

### 5. File yang TIDAK BOLEH pernah masuk repo

| File/folder | Alasan |
|---|---|
| `chat.md` | Catatan internal |
| `hasil_inspeksi.md` | Laporan kerja internal, bukan dokumen publik |
| `issue.md` | Catatan dan daftar temuan kerja internal |
| `plan_prd/` | Dokumen perencanaan, sifatnya catatan kerja bukan bagian halaman |
| `__shot.html` | File development untuk screenshot, bukan bagian landing page |
| `__tw-cdn-test.html` | File development untuk uji Tailwind CDN, bukan bagian landing page |
| `*.sh` | Script tooling, bukan bagian landing page |
| `.env`, `.env.*` | Environment asli |
| `*.log` | Log files |
| `node_modules/` | Dependency build saja, bukan runtime. Hasil build-nya yang di-commit |

Double-check `git status` sebelum `git add`. Kalau ada file yang ragu-ragu:
**jangan di-commit**, tanya dulu.

Semua file di tabel atas sudah terdaftar di `.gitignore`. Kalau nanti ada
catatan kerja baru, **tambahkan ke `.gitignore` juga**, jangan cuma
mengandalkan ingatan. File yang lolos ke repo akan ikut ter-deploy dan bisa
diakses publik lewat browser.

> **Catatan soal hasil build Tailwind.** Dua file
> `assets/css/tailwind-base.css` dan `assets/css/tailwind-utils.css` **wajib
> ikut di-commit**. Itu hasil build yang dipakai langsung oleh halaman, bukan
> file sementara. Yang diabaikan cuma folder `node_modules/`.

---

## Alur Kerja Standar

```bash
# 1. Ambil terbaru dari main
git checkout main && git pull origin main

# 2. Bikin branch (pakai prefix ini)
git checkout -b feat/nama-singkat        # fitur baru
git checkout -b fix/nama-singkat         # perbaikan bug
git checkout -b docs/nama-singkat        # dokumentasi
git checkout -b chore/nama-singkat       # ritual (cleanup)

# 3. Kerjakan perubahan, lalu jalankan checklist di bawah

# 4. Update ENGINEER.md (wajib!), lalu commit
git add <file-yang-berubah>
git commit -m "Area: deskripsi singkat perubahan"

# 5. Push branch + buka PR
git push -u origin <branch>
gh pr create --title "Area: deskripsi" --body "Apa + kenapa + cara tes"

# 6. Tunggu CI hijau, tunggu Bang Rob review, BANG ROB yang merge
```

### Gaya commit message

Konsisten dengan riwayat repo: `Area: deskripsi singkat`

Contoh yang benar:

- `Hero: perbaiki headline agar lebih jelas untuk audiens keluarga`
- `Layanan: tambah pasangan before after sofa L besar`
- `Copy: rapikan teks section masalah sesuai aturan copywriting`
- `docs: README, CONTRIBUTING, ENGINEER, LICENSE`

---

## Checklist Sebelum Buka PR

Jalankan yang relevan, semua wajib kecuali ditandai opsional.

### Wajib untuk setiap PR

- [ ] **HTML valid**, pastikan tidak ada tag yang error
- [ ] **Link berfungsi**, cek semua internal link dan anchor `#booking` nyambung
- [ ] **Tampilan mobile dicek** di viewport 375px, ini titik utama visitor iklan
- [ ] **Tampilan tablet dan desktop dicek** di 768px dan 1280px
- [ ] **Tidak ada horizontal scroll** di 375px dan 1280px
- [ ] **Console browser bersih**, tidak ada error JavaScript
- [ ] **Copywriting lolos aturan** di bagian 4
- [ ] **`git status` bersih** dari file terlarang (Aturan 5)
- [ ] **`ENGINEER.md` sudah dapat entry baru**

### Wajib kalau menyentuh CSS atau HTML

- [ ] **`npm run build:css` sudah dijalankan** setelah mengubah class Tailwind
- [ ] **`tailwind-base.css` dan `tailwind-utils.css` ikut ter-commit**
- [ ] **Urutan tiga `<link>` stylesheet tidak berubah**
- [ ] **`index.html` dan `404.html` masih sama-sama memuat ketiga stylesheet**
- [ ] **Versi cache dinaikkan** kalau `style.css` atau `main.js` berubah
- [ ] **Tidak ada class Tailwind CDN yang tersisa**, cek tidak ada
      `cdn.tailwindcss.com` di HTML

### Opsional, kalau area yang diubah menyentuh bagian ini

- [ ] **Slider before after jalan** kalau ada card layanan yang diubah
- [ ] **Menu navbar bisa dibuka dan ditutup**, termasuk Escape dan klik luar
- [ ] **Autoplay carousel tetap jalan** setelah disentuh dan dilepas
- [ ] **FAQ accordion** hanya membuka satu item pada satu waktu
- [ ] **`404.html` tampil benar** kalau menyentuh `.htaccess` atau halaman error

### Cara cepat build dan cek

```bash
npm run build:css      # wajib setelah ubah class Tailwind
python3 -m http.server 8010
# lalu buka http://127.0.0.1:8010 di browser
```

---

## Struktur Repo

Repo ini berisi landing page statis. Tidak ada backend dan tidak ada
dependency runtime. Semua interaksi berjalan di browser. Node.js hanya
dipakai waktu build CSS.

| Path | Isi |
|------|-----|
| `/index.html` | Halaman utama, 10 section |
| `/404.html` | Halaman tidak ditemukan |
| `/assets/css/style.css` | Design system dan komponen |
| `/assets/css/tailwind-base.css` | **Hasil build**, jangan diedit manual |
| `/assets/css/tailwind-utils.css` | **Hasil build**, jangan diedit manual |
| `/assets/css/tailwind-input.css` | Sumber base dan components |
| `/assets/css/tailwind-utils-input.css` | Sumber utilities |
| `/tailwind.config.js` | Konfigurasi Tailwind |
| `/assets/js/main.js` | Slider, scroll reveal, FAQ, navbar, sticky CTA |
| `/assets/img/` | Foto asli, before after, screenshot testimoni |
| `/package.json` | Script build CSS dan devDependency Tailwind |

**Ikon memakai inline sprite**, yaitu kumpulan `<symbol>` di dalam
`<svg style="display:none">` di bagian atas `index.html`. Tidak ada folder
`assets/icons/` di repo ini.

### Urutan stylesheet di `<head>` tidak boleh diubah

```html
<link rel="stylesheet" href="assets/css/tailwind-base.css?v=1">
<link rel="stylesheet" href="assets/css/style.css?v=25">
<link rel="stylesheet" href="assets/css/tailwind-utils.css?v=1">
```

- `tailwind-base.css` berisi preflight, harus **sebelum** `style.css`
- `tailwind-utils.css` berisi utility, harus **sesudah** `style.css`

Kalau urutannya tertukar, tampilan akan bergeser. Detailnya ada di
[README.md](README.md) bagian Build Tailwind.

---

## Setelah Merge

1. Tunggu auto-deploy Hostinger (15 sampai 20 detik).
2. Verifikasi cepat di live: buka `landingpage.indeepcleaningid.site`,
   cek halaman scroll sampai bawah, pastikan tidak ada error 404 atau 500.
3. Kalau ada masalah: **revert via PR baru**, jangan force-push `main`.

## Pertanyaan

Kalau ragu soal cakupan perubahan, desain, atau dampak ke production,
tanya Bang Rob dulu sebelum menulis kode. Lebih murah diskusi daripada
merewrite.
