# ENGINEER — Log Perubahan

> Dokumen ini wajib di-update setiap kali ada perubahan lewat PR.
> Format: tanggal, judul, apa yang berubah + kenapa, file yang kena.

---

## Pekerjaan Tertunda

| Item | Status | Keterangan |
|---|---|---|
| Sub blok 8 tahap pencucian QDWC (Section 5) | Selesai 2026-10-23 | Numbered card 2 kolom (01 sampai 08), full-width di bawah grid gambar dan keunggulan, tetap di dalam `<section id="metode">`. Copywriting v2 disetujui Bang Rob |
| Bundle Tailwind | Selesai 2026-10-23 | CSS statis lewat Tailwind CLI 3.4.17. Payload 407 KB ke 8 KB. CDN dan config inline sudah dihapus |
| Repository terpisah dan auto-deploy | Sebagian | Repo GitHub `landingpage-conv` sudah terhubung dan `main` sudah ter-push. Auto-deploy hPanel dan subdomain belum dikonfigurasi |
| ID pixel iklan asli | Belum | Meta Pixel, Google Ads, dan TikTok Pixel masih placeholder |
| Copywriting final | Belum | Review akhir oleh Bang Rob |

---

## 2026-10-23

### Repo GitHub dihubungkan dan commit awal di-push

**Apa:** `landing_page/` dijadikan repository Git sendiri dan dihubungkan ke
`https://github.com/indeepcleaningid/landingpage-conv.git`. Commit awal berisi
seluruh isi landing page di-push ke branch `main`.

**Kenapa:** Folder `landing_page/` berada di dalam monorepo
`digital-assets-indeepcleaningid` dan di-gitignore di sana (baris 44). Supaya
punya siklus commit, deploy, dan riwayat sendiri, dia perlu repo terpisah.

**Isi commit awal:** 44 file, 6654 baris. Sudah diverifikasi tidak ada
`hasil_inspeksi.md`, `node_modules/`, `.env`, atau `chat.md` yang ikut masuk.
Hasil build Tailwind (`tailwind-base.css` dan `tailwind-utils.css`) ikut
ter-commit sesuai aturan di `CONTRIBUTING.md`.

**Alur yang dipakai:** repo remote awalnya kosong dan belum punya branch,
sedangkan PR butuh branch tujuan. Jadi `main` diisi lebih dulu lewat push
commit awal, baru kemudian dibuat branch terpisah untuk PR.

**Yang belum:** auto-deploy hPanel dan konfigurasi subdomain. Keduanya
dikerjakan terpisah setelah repo ini siap.

---

## 2026-10-23

### CONTRIBUTING.md disesuaikan dengan era bundle Tailwind

**Apa:** Menyusul perubahan Tailwind dari CDN ke CSS statis, `CONTRIBUTING.md`
diperbarui dan checklist sebelum buka PR diperluas. `hasil_inspeksi.md` juga
dimasukkan ke `.gitignore`.

**Kenapa:** Dokumen kontribusi masih mengasumsikan kondisi lama, yaitu repo
tanpa dependency dan tanpa hasil build. Kalau dibiarkan, kontributor berikutnya
akan menambah class Tailwind tanpa build ulang, lalu bingung kenapa tampilannya
tidak berubah. Struktur repo yang tertulis juga masih menyebut
`assets/icons/` yang sudah tidak ada.

---

**Aturan baru ditambahkan**

Bagian **3. Setiap perubahan class Tailwind wajib di-build ulang**. Isinya:
kewajiban `npm run build:css` setelah menambah class, larangan mengedit
`tailwind-base.css` dan `tailwind-utils.css` secara manual karena itu hasil
build, arahan ke mana harus mengedit kalau butuh ubah token atau aturan, dan
larangan memasang kembali CDN sebagai jalan pintas.

Nomor aturan setelahnya digeser: copywriting jadi 4, file terlarang jadi 5.
Rujukan silang ke nomor aturan ikut disesuaikan.

**Struktur repo diperbarui**

`assets/icons/` dihapus dari tabel karena folder itu sudah tidak ada, diganti
penjelasan bahwa ikon memakai inline sprite. Ditambahkan `404.html`,
`tailwind.config.js`, `package.json`, dan pemisahan file CSS sumber versus
hasil build. Ditambah catatan bahwa urutan tiga `<link>` stylesheet tidak
boleh diubah, beserta alasan singkatnya.

**File terlarang diperbarui**

`node_modules/` tetap terlarang, tapi alasannya dikoreksi: bukan karena repo
tanpa dependency, melainkan karena dependency ini hanya untuk build. Ditambah
catatan tegas bahwa `tailwind-base.css` dan `tailwind-utils.css` justru
**wajib** di-commit. `hasil_inspeksi.md` masuk daftar file terlarang karena
merupakan laporan kerja internal.

**Checklist sebelum buka PR**

Dari 7 item menjadi tiga kelompok:

- **Wajib setiap PR** (9 item): ditambah cek 768px dan 1280px, tidak ada
  horizontal scroll, dan console browser bersih
- **Wajib kalau menyentuh CSS atau HTML** (6 item): build ulang, hasil build
  ikut ter-commit, urutan stylesheet tidak berubah, kedua halaman memuat tiga
  stylesheet, versi cache dinaikkan, tidak ada sisa `cdn.tailwindcss.com`
- **Opsional sesuai area** (5 item): slider, navbar, carousel, FAQ, `404.html`

Ditambah blok "cara cepat build dan cek" berisi dua perintah.

---

**`.gitignore`**

`hasil_inspeksi.md` ditambahkan ke bagian file development.

**Verifikasi:** penomoran aturan berurutan 1 sampai 5, rujukan "bagian 4" dan
"Aturan 5" di checklist cocok, tidak ada penyebutan `assets/icons/` sebagai
folder yang ada, dan `tailwind-base.css` tetap ter-track sedangkan
`hasil_inspeksi.md` serta `node_modules/` ter-ignore.

---

### File yang kena

- `CONTRIBUTING.md`: aturan baru, struktur repo, file terlarang, checklist
- `.gitignore`: tambah `hasil_inspeksi.md`

---

## 2026-10-23

### Bundle Tailwind, CDN dibersihkan (temuan 2.4 selesai)

**Apa:** Tailwind tidak lagi dimuat dari `cdn.tailwindcss.com`. CSS sekarang
dibangun jadi file statis lewat Tailwind CLI 3.4.17, versi yang sama dengan
yang dipakai CDN sebelumnya, supaya hasil build setara.

**Kenapa:** Script CDN adalah kompilator JIT, bukan CSS siap pakai. Halaman
harus menjalankan Tailwind di browser setiap kali dimuat, dan Chrome menulis
peringatan bahwa cara itu tidak untuk produksi.

---

**Hasil build dipecah dua file**

Ini bagian paling penting. Tailwind punya dua bagian dengan kebutuhan urutan
berlawanan:

- `tailwind-base.css` (preflight + components): reset bawaan browser, harus
  dimuat **sebelum** `style.css` supaya aturan desain project menang
- `tailwind-utils.css` (utilities): harus dimuat **sesudah** `style.css`
  supaya bisa menimpa class komponen

Urutan di `<head>` sekarang:

```html
<link rel="stylesheet" href="assets/css/tailwind-base.css?v=1">
<link rel="stylesheet" href="assets/css/style.css?v=25">
<link rel="stylesheet" href="assets/css/tailwind-utils.css?v=1">
```

**Kenapa tidak satu file.** Percobaan pertama menghasilkan satu file
`tailwind.css` yang dimuat sebelum `style.css`. Hasilnya render bergeser:
hero jadi 40px lebih tinggi dan section booking 32px lebih pendek. Penyebabnya
dua hal yang saling tarik-menarik:

- `ol.step-list` punya `margin: 0` di `style.css`, sedangkan utility `mb-8`
  di elemen yang sama kalah karena `style.css` dimuat lebih akhir
- `body { line-height: 1.6 }` di `style.css` selama ini **tidak pernah aktif**
  karena preflight CDN menyuntik `line-height: 1.5` sesudahnya

Solusinya memisahkan base dan utilities seperti di atas.

**Penyesuaian kecil di `style.css`:** `body` diubah dari `line-height: 1.6`
menjadi `1.5`, mengikuti nilai efektif yang selama ini tampil di browser.
Nilai 1.6 sebelumnya tidak pernah aktif. Dikunci ke 1.5 supaya tampilan yang
sudah direview Bang Rob tetap sama. Alasan ini ditulis di komentar CSS.

---

**Yang berubah di `index.html` dan `404.html`**

Dihapus: `<script src="https://cdn.tailwindcss.com"></script>` dan blok
`<script> tailwind.config = {...} </script>`. Diganti tiga tag `<link>` di
atas.

---

**Dependency**

`package.json` berisi **devDependency** `tailwindcss@3.4.17` dan dua script:

- `npm run build:css` untuk build sekali
- `npm run watch:css` untuk build saat development

`node_modules/` masuk `.gitignore`. Hasil build (`tailwind-base.css` dan
`tailwind-utils.css`) **tetap di-commit** karena dipakai langsung halaman.
Runtime halaman tetap senza dependency, tidak butuh Node saat diakses.

Catatan proses: percobaan `npm install` pertama tidak menemukan
`package.json` di folder ini, lalu npm naik ke `/home/obi/package.json` dan
menambahkan tailwindcss di sana. Sudah dibersihkan, dan `/home/obi` kembali
ke isi semula (axe-core dan supabase saja, tidak tersentuh). Install ulang
dilakukan dengan prefix eksplisit ke folder landing page.

---

**Ukuran dan performa**

| Ukuran | Sebelum | Sesudah |
|---|---|---|
| Payload CSS Tailwind | 407 KB (CDN, dimuat saat runtime) | 8 KB (base 5.2 KB + utils 2.8 KB) |
| DOMContentLoaded | 822 ms | 649 ms |
| Load | 1072 ms | 701 ms |
| FCP | 840 ms | 664 ms |
| Peringatan konsol | 1 (Tailwind CDN) | 0 |

**Verifikasi:** render **identik 0 beda piksel** di 375, 768, dan 1280 px
dibanding sebelum bundle, dengan tinggi dokumen sama persis (13638 / 11956 /
11941). `cdn.tailwindcss.com` hilang dari daftar request eksternal. Smoke test
5/5 PASS, regression T3/S1/S2/4.4/navigasi PASS, `404.html` tetap sehat.

---

### File yang kena

- `package.json`, `tailwind.config.js`: baru
- `assets/css/tailwind-input.css`, `tailwind-utils-input.css`: sumber build
- `assets/css/tailwind-base.css`, `tailwind-utils.css`: hasil build
- `index.html`, `404.html`: hapus CDN dan config inline, tambah tiga `<link>`
- `assets/css/style.css`: `body` line-height 1.6 ke 1.5, cache `?v=25`
- `.gitignore`: tambah `__tw-cdn-test.html`, perjelas catatan dependency build
- `README.md`: bagian Build Tailwind ditulis ulang, struktur folder, tabel stack

---

## 2026-10-23

### Bersihkan 7 temuan tingkat rendah hasil inspeksi

**Apa:** Menindaklanjuti `hasil_inspeksi.md` bagian 4. Satu temuan (4.5
`aria-controls`) sudah dikerjakan bersama temuan sedang 3.2.

---

**4.1. Komentar rusak di `main.js` diperbaiki**

Kata `keneanTP` dan `kenaanTP` di tiga komentar adalah sisa find-and-replace
gagal. Diganti menjadi "singkat" sesuai maksud kalimatnya. Hanya komentar,
tidak ada perubahan logika.

---

**4.2. `logo+logo-text.webp` dipindah ke luar repo**

File sumber logo sebelum diberi stroke tidak dipakai halaman lagi setelah
navbar memakai `logo+logo-text-stroke.webp`. Dipindah ke
`Website indeepcleaning id/backup/icons-landing-page/logo+logo-text-source.webp`
supaya tetap tersedia kalau stroke perlu dibuat ulang, tapi tidak ikut
ter-deploy.

`README.md` disesuaikan: daftar gambar tidak lagi menyebut file ini, dan
catatan sumber aset diperluas.

---

**4.3. `chat.md` dihapus**

Catatan sementara berisi permintaan navbar. Sudah di-gitignore sejak awal,
sekarang dihapus juga dari disk supaya repo bersih.

---

**4.4. Auto play carousel pulih setelah sentuhan dibatalkan**

Bug nyata: pada `pointercancel` dengan `pointerType === 'touch'`, fungsi
langsung `return` tanpa memanggil `restart()`. Padahal `pointerdown` sudah
memanggil `stop()`. Akibatnya kalau browser membatalkan gesture sentuh
(misalnya scroll vertikal mengambil alih), auto play berhenti dan tidak
pernah lanjut sampai carousel disentuh lagi.

Sekarang `pointercancel` sentuh memanggil `restart()`, sama seperti
`pointerup` sentuh.

**Verifikasi:** autoplay jalan (0 ke 375), sentuhan dibatalkan, autoplay
lanjut lagi (375 ke 732). PASS.

---

**4.6. `humans.txt` dibuat**

Berisi blok TEAM (nama, peran, domisili, kontak, WhatsApp, Instagram, situs),
SITE (nama, URL, bahasa, stack, backend, hosting, standar aksesibilitas), dan
catatan bahwa ikon memakai inline sprite.

---

**4.7. `og-banner.webp` dikompresi**

Dari 167.7 KB menjadi 61.4 KB, turun 63 persen. Dimensi tetap 1200x630,
mode berubah RGBA ke RGB karena gambar tidak punya transparansi. Kualitas 85,
selisih rata-rata piksel hanya 1.63 dari skala 255, tidak terlihat mata pada
ukuran tampil banner media sosial.

Cadangan versi asli ada di `/tmp/opencode/og-banner-original.webp` (sementara).

---

### File yang kena

- `assets/js/main.js`: komentar 4.1, `restart()` pada `pointercancel` 4.4
- `assets/img/og-banner.webp`: dikompresi
- `assets/img/logo+logo-text.webp`: dipindah keluar repo
- `humans.txt`: file baru
- `chat.md`: dihapus
- `README.md`: daftar gambar dan catatan sumber aset
- `index.html`: cache `main.js?v=9`

**Verifikasi menyeluruh:** smoke test 5/5 PASS, regression T3 PASS (66
sampel), S1 PASS, S2 PASS (5 pemeriksaan), navigasi scroll navbar PASS di
tiga titik. Render identik 0 piksel di 375, 768, dan 1280 px.

**Ukuran repo:** 1.9 MB menjadi 1.7 MB, 70 menjadi 38 file.

---

## 2026-10-23

### Bersihkan 6 temuan tingkat sedang hasil inspeksi

**Apa:** Menindaklanjuti `hasil_inspeksi.md` bagian 3, ditambah satu temuan
rendah (4.5) karena berada di area yang sama.

---

**3.2. Menu navbar bisa ditutup dengan Escape dan klik di luar**

`initNav()` ditambah dua penanganan:

- `document.addEventListener('keydown')`: tombol Escape menutup menu kalau
  sedang terbuka
- `document.addEventListener('pointerdown')`: klik di luar `<header>`
  menutup menu. Sengaja `pointerdown`, bukan `click`, supaya gestur geser
  di luar menu tidak ikut menutup

Tambahan kecil: saat menu ditutup dan fokus keyboard sedang berada di dalam
menu, fokus dikembalikan ke tombol hamburger supaya pengguna keyboard tidak
kehilangan posisi.

Sekalian **4.5**: tombol hamburger diberi `aria-controls="lp-nav-menu"`, dan
panel menu diberi `id="lp-nav-menu"`, jadi hubungan tombol dan panelnya
eksplisit untuk teknologi bantu.

**Verifikasi:** Escape menutup (sebelumnya tidak). Klik di area konten
menutup. Klik di dalam panel yang bukan tautan **tidak** menutup.

---

**3.3. Landmark `<main>` ditambahkan**

Semua sembilan `<section>` konten (Hero sampai Final CTA) dibungkus `<main>`.
Footer tetap di luar `<main>`. Tidak ada perubahan tampilan.

**Verifikasi:** 1 `<main>`, 9 `<section>` di dalamnya, footer di luar.
Struktur tag tetap seimbang (div 161/161, section 9/9, main 1/1, dan
seterusnya).

---

**3.4. Target sentuh tautan footer diperbesar**

Tinggi tautan footer sebelumnya 21px, di bawah batas WCAG 2.5.8 sebesar
24px. Ditambah `padding: 0.25rem 0` dan `margin: -0.25rem 0` agar jarak
visual antar tautan tidak berubah. `gap` pada `.footer-links` diubah dari
`1.5rem` menjadi `0 1.5rem` supaya jarak vertikal tidak bertambah dua kali.

**Verifikasi:** tinggi tiap tautan naik dari 21px menjadi 29px.

---

**3.5. Dua gambar logo mendapat atribut `width` dan `height`**

`Logo.webp` (513x513) muncul dua kali tanpa dimensi eksplisit, sumber
potensi layout shift. Sekarang keduanya memakai `width="513" height="513"`.
Kelas `h-14` dan `h-12` tetap mengatur ukuran tampil, jadi tidak ada
perubahan visual.

**Verifikasi:** 0 `<img>` tanpa `width`/`height` di seluruh halaman.

---

**3.6. `lastmod` sitemap diperbarui**

`2026-10-22` menjadi `2026-10-23`, mengikuti perubahan isi terakhir.

---

**3.1. `README.md` disinkronkan dengan kondisi nyata**

- Struktur folder: tambah `404.html`, hapus `assets/icons/`, lengkapi daftar
  gambar termasuk `logo+logo-text.webp` dan `logo+logo-text-stroke.webp`
  beserta dimensinya
- Klaim "20 icon SVG custom" dihapus, diganti penjelasan bahwa ikon memakai
  inline sprite dan sumber per-ikon disimpan di luar repo
- Tabel section: tambah baris navbar, dan Section 5 dilengkapi keterangan
  "8 tahap pencucian"
- Contoh cache busting diperbarui ke `style.css?v=23` dan `main.js?v=7`
- Typo diperbaiki: "mengubahvisitor", "URL_SHORT", "Menggangu", "tidakLempar"

---

### File yang kena

- `assets/js/main.js`: `initNav()` ditambah Escape, klik luar, pemulihan fokus
- `assets/css/style.css`: `.footer-links` gap dan `.footer-links a`
- `index.html`: `<main>`, `aria-controls` + `id` panel menu, `width`/`height`
  dua logo, cache `style.css?v=24`, `main.js?v=8`
- `404.html`: cache `style.css?v=24`
- `sitemap.xml`: `lastmod`
- `README.md`: sinkronisasi kondisi nyata

**Verifikasi menyeluruh:** smoke test PASS, regression T3/S1/S2 PASS,
0 JS exception. Render 768 dan 1280 px identik 0 piksel. Di 375 px selisih
hanya di area footer (mulai 98.7 persen tinggi halaman), akibat penyesuaian
padding tautan footer.

---

## 2026-10-23

### Bersihkan 4 temuan prioritas tinggi hasil inspeksi

**Apa:** Menindaklanjuti `hasil_inspeksi.md` bagian 2. Tiga dari empat
temuan tingkat tinggi dikerjakan. Tailwind CDN ditunda atas keputusan
Bang Rob sampai tahap akhir sebelum repo remote disiapkan.

---

**2.1. Sembilan variabel CSS mati dihapus (regresi diperbaiki)**

Variabel yang dideklarasikan di `:root` tapi tidak dipakai di mana pun
ternyata muncul lagi, padahal `ENGINEER.md` 2026-10-22 mencatatnya sudah
dihapus. Diduga file `style.css` sempat dipulihkan dari backup.

Yang dihapus ulang: `--primary-light`, `--text-dark`, `--radius-sm`,
`--radius-md`, `--radius-xl`, `--radius-2xl`, `--shadow-md`, `--shadow-xl`,
`--transition-slow`.

Dicek ulang dua arah sebelum dihapus: 28 variabel dideklarasikan, 28
dipakai, tidak ada yang menggantung di kedua sisi. Render setelah
penghapusan **identik 0 beda piksel** di 375, 768, dan 1280 px.

---

**2.2. Tiga puluh lima file ikon dipindah ke luar repo**

`assets/icons/` berisi 35 file SVG yang tidak direferensikan satu pun oleh
HTML, CSS, atau JS. Halaman memakai inline sprite (`<symbol>` di
`index.html`). Folder dipindah ke
`Website indeepcleaning id/backup/icons-landing-page/`, lalu folder kosong
`assets/icons/` dihapus.

Struktur `assets/` sekarang hanya `css/`, `img/`, dan `js/`.

Catatan: kalau nanti ikon per-tahap QDWC mau ditambahkan sebagai file
terpisah, sumbernya ada di folder backup tersebut.

---

**2.3. `404.html` dibuat, `ErrorDocument` diperbaiki**

Sebelumnya `.htaccess` mengarahkan 404 ke `/index.html`, sehingga URL yang
tidak ada membalas 200 OK dengan isi halaman depan. Itu soft 404 di mata
mesin pencari.

Yang dibuat: `404.html` mandiri dengan stack yang sama (HTML5, Tailwind CDN,
`style.css`), berisi logo stroke di kotak navy, angka 404, penjelasan
singkat, tombol "Kembali ke Beranda" dan "Chat WhatsApp". Ada
`<meta name="robots" content="noindex, follow">`, satu `h1`, satu `<main>`,
dan sprite ikon minimal (WhatsApp dan panah kiri).

`.htaccess` diubah menjadi `ErrorDocument 404 /404.html`.

**Verifikasi:** diuji di server terpisah port 8011 pada 375 dan 1280 px.
Judul benar, satu h1, satu main, 0 gambar rusak, 0 JS error, 0 request
gagal, tidak ada horizontal overflow.

---

### File yang kena

- `assets/css/style.css`: hapus 9 variabel di `:root`
- `assets/icons/`: 35 file dipindah keluar repo, folder dihapus
- `404.html`: file baru
- `.htaccess`: `ErrorDocument 404 /404.html`
- `index.html`: versi cache CSS `?v=22` ke `?v=23`
- `hasil_inspeksi.md`: ditimpa laporan inspeksi 2026-10-23

---

### Logo navbar: versi stroke putih

**Apa:** Membuat aset baru `assets/img/logo+logo-text-stroke.webp` dari
`logo+logo-text.webp` asli. Caranya: alpha channel di-dilate ~8px di
resolusi natural (≈1.4px saat tampil setinggi 40px), di-blur halus, lalu
di-composite di bawah logo asli. Navbar memakai versi stroke ini.

**Kenapa:** Teks logo berwarna gelap nyaris tak terlihat di atas surface
navy navbar. Stroke putih di tepi mengangkat kontras tanpa mengubah warna
logo asli. Aturan langsung Bang Rob.

**File yang kena:**
- `assets/img/logo+logo-text-stroke.webp`: aset baru, 25 KB, lossless
- `index.html`: `src` img navbar ganti ke versi stroke. Filename baru
  otomatis jadi cache bust, jadi versi query tidak perlu dinaikkan

**Verifikasi:** Screenshot navbar mobile 375 dan desktop 1280 — teks dan
ikon logo jelas terbaca di atas navy.

---

### Navbar sticky dengan hamburger (semua breakpoint)

**Apa:** Menambahkan `<header class="lp-nav">` sticky di paling atas halaman,
sebelum Section 1. Isinya logo (`logo+logo-text.webp`, natural 1009x221,
tinggi 36px mobile / 40px desktop), tombol CTA **Booking** (amber) dan
**WhatsApp** (pill putih) khusus desktop, hamburger 2 garis, dan panel menu
dropdown berisi 8 link section: Beranda, Masalah, Layanan, Metode QDWC,
Booking, Testimoni, Coverage & FAQ, Hubungi Kami.

**Kenapa:** Permintaan Bang Rob — navigasi cepat ke tiap section. Desktop
juga memakai hamburger (bukan link horizontal), plus dua tombol CTA supaya
navbar tidak sepi. Surface navy, sesuai arahan.

**Keputusan desain:**
- Tombol WhatsApp memakai pill putih (bukan navy), karena pill navy di atas
  latar navy nyaris tak terlihat. Mengikuti pola yang sudah ada di Section 9
  Final CTA. Hover-nya hijau WhatsApp
- Hamburger 2 garis berubah jadi X lewat rotate dua span (45 dan -45 derajat)
- `scroll-margin-top: 72px` di `section[id]` supaya konten section tidak
  ketutup navbar saat scroll anchor. Rule lama `scroll-margin-top: 1rem`
  di akhir file dihapus karena menimpa rule baru (specificity sama)
- `initNav()` didaftarkan sebelum `initSmoothScroll()` di `init()`. Kalau
  kebalik, saat link menu diklik posisi target dihitung saat panel menu
  masih terbuka, dan scroll berhenti meleset sekitar tinggi panel menu

**File yang kena:**
- `index.html`: blok `<header class="lp-nav">` setelah sprite SVG;
  versi cache `style.css?v=21`, `main.js?v=7`
- `assets/css/style.css`: blok komponen `.lp-nav*` (sebelum `.icon-well`),
  rule `section[id] { scroll-margin-top: 72px }`, hapus rule anchor lama
- `assets/js/main.js`: fungsi `initNav()` + dipanggil di `init()`

**Verifikasi:** Chrome headless — mobile 375px tertutup/terbuka (X bekerja,
menu 8 link tampil), desktop 1280px (2 tombol CTA tampil, logo 40px),
klik link menu menutup menu dan berhenti tepat 72px (Metode, Coverage,
klik logo ke Hero semua PASS), hover tombol WhatsApp navbar jadi hijau,
smoke test 0 JS exception.

---

### Hapus bloom putih di hover semua tombol CTA

**Apa:** Menghapus efek glow putih neumorphism pada state hover 11 tombol
CTA utama (Hero, Layanan, Booking, Final CTA). Sebelumnya semua hover
memakai `var(--nb-raised-lg)` yang membawa shadow putih
`rgba(255, 255, 255, 0.95)` ke arah kiri-atas. Diganti hanya shadow gelap
`12px 12px 24px rgba(6, 44, 61, 0.13)`, plus stroke navy inset untuk tombol
navy di Hero dan Layanan (stroke-nya dipertahankan).

**Kenapa:** Aturan langsung Bang Rob — efek bloom putih dianggap mengganggu.
Variabel `--nb-raised-lg` sendiri masih dipakai `.service-card:hover`
(bukan CTA), jadi variabelnya tidak dihapus.

**Yang tidak berubah:**
- Sticky CTA mobile: sejak awal pakai `--nb-on-dark` dengan putih 6 persen,
  bukan bloom 95 persen, jadi tidak disentuh
- Base `.btn-cta-navy:hover` dan `.btn-cta-amber:hover` di luar 4 section
  utama juga tidak ada putihnya

**File yang kena:**
- `assets/css/style.css`: 7 rule hover (`#hero` navy+amber, `#layanan`
  navy, `#booking` amber+navy, `#cta-akhir` amber+navy) — `var(--nb-raised-lg)`
  diganti shadow gelap eksplisit
- `index.html`: versi cache CSS dinaikkan `?v=19` ke `?v=20`

**Verifikasi:** Chrome headless 1280px, hover sungguhan lewat
`Input.dispatchMouseEvent` ke 13 tombol `.btn-cta` (11 utama + 2 sticky):
computed `box-shadow` tidak ada lagi yang membawa channel putih opacity
0.9. Semua PASS.

---

### Sub blok 8 tahap pencucian QDWC di Section 5

**Apa:** Menambahkan sub-blok "Delapan Tahap Pencucian" di Section 5
(`<section id="metode">`), persis di bawah grid gambar metode + keunggulan
QDWC, full-width. Terdiri dari 8 kartu bernomor 01 sampai 08 dengan judul
dan deskripsi singkat tiap tahap. Penomoran section halaman tetap 10.

**Kenapa:** Daftar 8 tahap QDWC adalah butir spesifikasi di `spec.md`
Section 5 yang sebelumnya hanya penanda `TODO` karena menunggu konten asli
dari Bang Rob. Daftar asli sudah diterima, copywriting v2 (bahasa awam,
istilah teknis dibuat mudah dipahami) sudah disetujui.

**Bentuk (disepakati Bang Rob):** numbered card 2 kolom di layar lebar,
1 kolom di mobile. Menyimpang dari spec yang semula list vertikal, sesuai
pilihan saat diskusi.

**Isi 8 tahap:**
1. Pemvakuman Awal
2. Penyemprotan Pembersih
3. Penyikatan
4. Pembilasan
5. Penghisapan Vakum
6. Pembersihan Rinci
7. Pengulangan
8. Finishing Akhir

**File yang kena:**
- `index.html`: TODO diganti 8 kartu + heading "Delapan Tahap Pencucian";
  versi cache CSS dinaikkan `?v=18` ke `?v=19`
- `assets/css/style.css`: blok komponen baru `.stage-grid`, `.stage-card`,
  `.stage-number`, `.stage-body`, `.stage-title`, `.stage-desc` (setelah
  `.advantage-item svg`). Grid 1 kolom, di `min-width: 640px` jadi 2 kolom.
  Kartu pakai permukaan transparan putih 7 persen, border putih 14 persen,
  radius `--nb-radius-md`, nomor amber `--amber`, judul putih, deskripsi
  putih 75 persen

**Perbaikan saat implementasi:** Dua closing `</div>` ekstra sempat masuk
di ujung Section 5 (sisa struktur lama), bikin depth div Section 5 masuk
negatif. Dihapus, diverifikasi ulang balance seluruh file: div, section,
ul, li, svg, p semuanya open = close.

**Verifikasi:**
- Chrome headless, 3 viewport (375, 768, 1280): 8 kartu tampil, nomor 01
  sampai 08 urut, grid 1 kolom di 375, 2 kolom di 768 dan 1280, blok berada
  di dalam `#metode`
- Smoke test: 0 JS exception, gambar 0 rusak, h1 tunggal, dot carousel
  aktif == pembungkus
- Regression T3 (dots carousel), S1 (touch autoplay), S2 (preload hero):
  semuanya PASS

---

## 2026-10-22

### Bersihkan dead code dan aset tidak terpakai (bagian 4 hasil inspeksi)

**Apa:** Menghapus variabel CSS, class CSS, dan file sampah yang tidak pernah
dipakai halaman, serta memindahkan aset foto yang tidak dipakai ke arsip di
luar repo. Ukuran repo turun dari 2.33 MB menjadi 1.58 MB, jumlah file dari
88 menjadi 70.

**Kenapa:** Landing page ini akan jadi repository terpisah. Semua byte yang
masuk repo ikut terunduh setiap kali repo di-clone dan ikut terhitung saat
deploy. Dead code juga membuat pembacaan CSS dan sprite ikon lebih lambat
dipahami, terutama untuk pola reverse engineering.

---

**4.1. Sembilan variabel CSS dihapus**

Dicek ulang sebelum dihapus, bukan menyalin laporan inspeksi. Caranya: ambil
semua nama variabel yang dideklarasikan di `:root`, lalu bandingkan dengan
semua pemakaian `var()` di CSS, `index.html`, dan `main.js`.

Yang dihapus: `--primary-light`, `--text-dark`, `--radius-sm`, `--radius-md`,
`--radius-xl`, `--radius-2xl`, `--shadow-md`, `--shadow-xl`,
`--transition-slow`.

Yang dipertahankan karena masih dipakai: `--radius-lg`, `--shadow-lg`,
`--transition-fast`, `--transition-base`.

**Verifikasi:** setelah pembersihan, tidak ada lagi `var()` yang dipanggil tapi
tidak dideklarasikan, dan tidak ada variabel dideklarasikan tapi tidak dipakai.

---

**4.2. Enam class CSS dead code dihapus**

- `.card-nb` beserta aturan `:hover`-nya, 2 blok
- `.card-nb-surface`, 1 blok
- `.stagger-5` dan `.stagger-6`, masing-masing 1 aturan. Pemakaian di HTML
  hanya `stagger-1` sampai `stagger-4`, dan nama class ini tidak dibangun
  dinamis di JavaScript
- `.pulse-ring` beserta `@keyframes pulse-ring`, plus aturan matinya di dalam
  `prefers-reduced-motion`

**Verifikasi:** semua class yang dipakai di atribut `class` HTML dicek satu per
satu terhadap isi CSS. Tidak ada class non-Tailwind yang dipakai di HTML tapi
hilang dari CSS. Kurung kurawal CSS seimbang, 193 buka dan 193 tutup.

---

**4.3. Symbol dan file ikon dirapikan, file cadangan dikembalikan**

- Symbol `i-droplet` dihapus dari sprite karena tidak pernah dipanggil
- `assets/icons/icon-arrows.svg` dibuat baru dengan geometri yang sama persis
  dengan symbol `i-arrows` di sprite

**Kenapa file baru dibuat:** sebelumnya symbol `i-arrows` tidak punya file
pasangan, karena padanannya di disk bernama `icon-arrows-horizontal.svg`.
Dengan file baru, aturannya jadi sederhana: `i-nama` berpasangan dengan
`icon-nama.svg`.

**Perubahan keputusan:** 15 file ikon yang sempat dihapus **dikembalikan** ke
`assets/icons/` atas permintaan Bang Rob, karena akan dipakai untuk sub blok
8 tahap pencucian QDWC yang belum dikerjakan. File yang kembali: arrows-horizontal,
brush, check, droplet, list, message, phone, search, send, spray, truck, user,
vacuum, water-off, wind.

**Kondisi akhir `assets/icons/`:** 35 file, terdiri dari 20 file yang
berpasangan dengan symbol di sprite dan 15 file cadangan untuk pekerjaan
berikutnya. Halaman hanya merujuk 20 symbol, jadi 15 file sisanya tidak
menambah satu pun request HTTP.

**Verifikasi:** semua `<use>` punya symbol, dan semua 20 symbol punya file
pasangan. Tidak ada referensi yang menunjuk ke file yang tidak ada.

---

**4.4. Delapan belas foto before after dipindah ke arsip luar repo**

Halaman hanya memakai 5 pasangan foto: jok, karpet, kasur, sofa, dan stroller.
Sisanya dipindahkan dari repo ke arsip di luar working tree.

**Lokasi arsip:** `public_html/assets-arsip/before-after-tidak-dipakai/`,
berisi 28 file, yaitu seluruh pasangan foto before after termasuk yang masih
dipakai halaman. Folder ini sudah masuk `.gitignore` repository utama, jadi
tidak ikut ter-commit.

**Kondisi akhir `assets/img/before-after/`:** 10 file, dari sebelumnya 28 file
dan 1.29 MB menjadi 598 KB. Halaman tidak kehilangan satu gambar pun.

---

**4.5. File sampah dan klaim dokumen diperbaiki**

- `chat.md` berukuran 0 byte dihapus
- `README.md`, struktur folder: jumlah ikon dikoreksi dari 33 menjadi 20, dan
  keterangan `before-after/` dari 14 pasangan menjadi 5 pasangan yang dipakai
- `README.md`, bagian Mode produksi: instruksi bundling Tailwind ditulis ulang.
  Versi lama akan gagal kalau dijalankan apa adanya, karena perintahnya memakai
  `assets/css/tailwind-input.css` yang belum ada dan tidak menyebut keharusan
  membuat `tailwind.config.js` lebih dulu. Versi baru menandai bahwa langkah ini
  belum dikerjakan, menambahkan langkah pembuatan `tailwind.config.js` beserta
  blok `content`, dan memberi peringatan bahwa konfigurasi inline di
  `index.html` tidak dibaca oleh Tailwind CLI

---

**Verifikasi akhir:** screenshot penuh halaman diambil di 375px, 768px, dan
1280px sebelum dan sesudah pembersihan, lalu dibandingkan piksel per piksel
dengan animasi reveal dan posisi carousel dinetralkan lebih dulu supaya hasilnya
deterministik.

- 375px, tinggi 12323px: 0 piksel berbeda
- 768px, tinggi 11191px: 0 piksel berbeda
- 1280px, tinggi 11266px: 0 piksel berbeda

Tinggi halaman ketiga viewport juga sama persis sebelum dan sesudah, jadi
pembersihan tidak menggeser satu piksel pun layout.

**Regresi:** carousel dot PASS 66 sampel, auto play saat sentuhan PASS, preload
gambar PASS, dan smoke test halaman bersih tanpa JS exception maupun gambar
rusak.

**Catatan:** backup keadaan sebelum pembersihan disimpan sementara di
`/tmp/opencode/deadcode-backup/` selama pengujian, lalu dihapus. Tidak ada
backup permanen di dalam repo.

**File:** `assets/css/style.css`, `index.html`, `assets/icons/`,
`assets/img/before-after/`, `README.md`

### Bereskan temuan tingkat sedang dari hasil inspeksi (S1, S2, S4, S5)

**Apa:** Menyelesaikan empat dari lima temuan tingkat sedang di
`hasil_inspeksi.md`. S3, yaitu bundle Tailwind, sengaja ditunda atas keputusan
Bang Rob.

**Kenapa:** S1 dan S2 menyentuh perilaku langsung di perangkat pengunjung. S4
menutup jebakan yang belum kelihatan sekarang tapi akan menggigit saat ada ikon
baru ditambahkan. S5 menjaga `plan_prd` tetap jadi sumber kebenaran yang akurat.

---

**S1. Auto play carousel berhenti saat pengguna menyentuh layar**

`assets/js/main.js`:
- `pointerdown`: `stop()` dipindah ke paling atas handler, sebelum pengecekan
  `pointerType`. Sebelumnya sentuhan keluar lebih awal sehingga timer auto play
  tetap berjalan selama jari menempel dan bisa merebut posisi scroll
- `pointerup`: ditambahkan cabang `pointerType === 'touch'` yang memanggil
  `restart()`, jadi auto play menyala lagi setelah jari diangkat. Sebelumnya
  `endDrag()` keluar lebih awal karena `dragging` tidak pernah diset untuk
  sentuhan, sehingga `restart()` tidak pernah tercapai
- `pointercancel`: sentuhan diabaikan seperti sebelumnya

**Pengujian:** metode yang dipakai adalah menyuntik `IntersectionObserver` stub
supaya carousel dianggap terlihat dan auto play benar-benar hidup, lalu
carousel dipindahkan sementara dengan `position: fixed` ke tengah viewport agar
bisa disentuh di mode headless. Sentuhan dikirim lewat `Input.dispatchTouchEvent`
dan sudah dipastikan sampai ke track sebagai `pointerdown` dengan
`pointerType: touch`.

- Sebelum perbaikan: gelombang auto play tetap terjadi 2 kali selama jari
  menahan 9 detik, hasil FAIL
- Sesudah perbaikan: 0 gelombang selama jari menahan 9 detik, lalu auto play
  jalan lagi setelah jari diangkat, hasil PASS
- Regresi drag mouse: drag 150 piksel tetap memindah satu slide dan titik
  navigasi tetap tepat satu yang aktif, hasil PASS

---

**S2. Gambar LCP di-preload dan diberi prioritas**

`index.html`:
- Tambah `<link rel="preload" as="image" href="assets/img/Hero.webp" fetchpriority="high">` di `<head>`, setelah tag favicon
- Tag `<img>` Hero diberi `fetchpriority="high"` dan `decoding="async"`

**Pengujian:** pemantauan domain `Network.requestWillBeSent` di viewport 375px.

- Jumlah request `Hero.webp`: 1. Preload benar-benar dipakai dan tidak
  menghasilkan unduhan ganda
- Prioritas request: `High`
- Gambar tetap termuat dengan ukuran intrinsik 1080x1620

---

**S4. Struktur atribut ikon WhatsApp disamakan dengan file sumbernya**

`index.html`, symbol `i-whatsapp` di sprite:
- Elemen `<symbol>` diubah dari `fill="currentColor"` menjadi
  `fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"`
- Elemen `<path>` diberi `fill="currentColor" stroke="none"`

**Kenapa:** sebelumnya atribut `fill` hanya ada di elemen `<symbol>`, sedangkan
di `assets/icons/icon-whatsapp.svg` atributnya ada di `<path>`. Render keduanya
saat ini sama, tapi elemen `<use>` mewarisi `fill` dari `<svg>` induk yang
nilai bawaannya hitam. Ikon baru yang ditambahkan ke sprite tanpa atribut
`fill` sendiri akan tampil hitam. Sekarang struktur sprite identik dengan file
sumber, sudah dibandingkan atribut per atribut dan nilai `d` pada path.

**Pengujian:** screenshot kelima pemakaian ikon WhatsApp sebelum dan sesudah
perubahan, diambil lewat `Page.captureScreenshot` dengan `captureBeyondViewport`
pada skala 8x, lalu dibandingkan piksel per piksel.

- Hasil: 0.000 persen beda piksel di kelima ikon, render identik
- Ikon tetap solid filled, bukan outline, dan warnanya mengikuti `currentColor`
  di tiap konteks, yaitu navy di atas amber, putih di atas amber, dan abu-abu
  di footer

---

**S5. Checklist di `plan_prd` ditandai sesuai kondisi sebenarnya**

`plan_prd/lp_conv_idc/spec.md`, bagian 9:
- 19 item ditandai selesai setelah dicek langsung ke file, bukan disalin dari
  klaim dokumen
- 4 item sengaja dibiarkan terbuka beserta catatan alasannya: persetujuan Bang
  Rob, review copywriting final, bundle Tailwind, dan pengukuran LCP di produksi

**Catatan:** `.htaccess` ditandai selesai karena isinya sudah lengkap, tapi
belum pernah benar-benar dijalankan di Apache Hostinger. Ini dicatat di dalam
checklist supaya tidak terbaca sebagai sudah teruji di server.

---

**File:** `index.html`, `assets/js/main.js`,
`plan_prd/lp_conv_idc/spec.md` (di luar folder landing page)

### Bereskan tiga temuan tingkat tinggi dari hasil inspeksi (T1, T2, T3)

**Apa:** Menyelesaikan tiga temuan tingkat tinggi yang tercatat di
`hasil_inspeksi.md`: harga Interior Mobil di data terstruktur, folder landing
page yang belum dikecualikan dari repository utama, dan titik navigasi carousel
yang mati saat looping.

**Kenapa:** Ketiganya berisiko langsung. Harga JSON-LD yang beda dari isi
halaman bisa dibaca Google sebagai data menyesatkan. Folder landing page yang
tidak di-ignore bisa menarik 2.5 MB aset ke repository website utama dengan satu
perintah `git add .`. Dan dot carousel yang mati membuat navigasi terlihat rusak
setiap kali carousel berputar.

**T1. Harga Interior Mobil di JSON-LD dikoreksi**
- `index.html`: `priceSpecification` untuk `Interior Mobil` diubah dari
  `380000` menjadi `200000`, mengikuti harga terendah yang tertulis di kartu
  layanan, yaitu "Mulai dari Rp200.000". `unitText` tetap `mulai dari`
- Lima offer lain dicek ulang dan tetap konsisten dengan kartu di halaman

**T2. Folder landing_page dikecualikan dari repository utama**
- `.gitignore` di `public_html/`: tambah aturan `landing_page/` di bawah blok
  folder plan
- Sudah diverifikasi dengan `git check-ignore -v landing_page/`, hasilnya
  cocok ke `.gitignore:44`. `git status --short` di repository utama sekarang
  hanya menampilkan perubahan `.gitignore` itu sendiri

**T3. Titik navigasi carousel tidak mati lagi saat looping**
- `assets/js/main.js`: fungsi `updateDots()` menghitung indeks aktif dari
  `Math.min(index, dots.length - 1)`. Sebelumnya `index` bisa bernilai `total`
  saat animasi menuju slide clone, dan karena tidak ada dot dengan indeks itu,
  semua dot padam dan semua `aria-current` jadi `false`
- `index.html`: versi aset `main.js` dinaikkan ke `?v=5`

**Pengujian T3:** metode yang dipakai adalah menguji jalur `next()` asli, bukan
sekadar menggeser track, karena bug ini hanya muncul lewat autoplay. Autoplay
butuh elemen terlihat, jadi `IntersectionObserver` di-stub supaya menganggap
semua carousel visible, lalu autoplay dibiarkan berjalan 20 detik hingga
melewati siklus loop. MutationObserver mencatat setiap perubahan `class` dan
`aria-current` pada ketiga carousel.

- Sebelum perbaikan: 63 sampel, 1 sampel dengan dot aktif 0 dan
  `aria-current` 0, hasil FAIL
- Sesudah perbaikan: 66 sampel, 0 sampel cacat, hasil PASS

Tiga carousel yang diuji: Trust strip 4 dot interval 4500 ms, Social Proof
Strip 4 dot interval 5500 ms, Testimoni Gallery 8 dot interval 7000 ms.

**Pengujian lain:** `node --check` pada `main.js` lolos, empat blok JSON-LD
di halaman tetap valid dan bisa di-parse, dan halaman tetap membalas 200 dengan
aset `main.js?v=5` yang juga membalas 200.

**File:** `index.html`, `assets/js/main.js`, `.gitignore` (repo utama)

### Trust strip dan social proof strip jadi carousel auto play

**Apa:** Mengubah Trust strip dan Social Proof Strip dari baris yang terpotong
menjadi carousel yang auto play dan bisa di drag. Ditambah titik navigasi,
loop pergantian yang mulus, dan jeda otomatis saat carousel tidak terlihat.

**Kenapa:** Di mobile, kedua section itu terpotong di kanan layar dan tidak ada
petunjuk kalau bisa digeser. Untuk traffic dari iklan yang didorong ke konversi,
 Trust point dan testimoni harus terbaca tanpa perlu effort scroll horizontal.

**Yang berubah:**
- `index.html`: Trust strip dan Social Proof Strip memakai struktur carousel
  dengan atribut `data-carousel`, `data-carousel-track`, `data-carousel-slide`,
  dan `data-carousel-dots`
- `assets/js/main.js`: fungsi `initCarousel` yang menangani auto play, drag
  mouse, swipe native untuk touch, titik navigasi, loop mulus lewat clone
  slide pertama, jeda saat di luar layar, jeda saat di hover, dan mati total
  kalau pengguna mengaktifkan `prefers-reduced-motion`
- `assets/css/style.css`: gaya carousel, titik navigasi, serta aturan desktop
  supaya carousel dimatikan di lebar 768px ke atas dan semua item tampil statis

**Catatan perilaku:**
- Auto play hanya jalan saat carousel benar-benar terlihat di layar, pakai
  IntersectionObserver dengan ambang 35 persen
- Drag mouse memakai ambang 15 persen lebar track. Drag cukup jauh berarti
  pindah satu slide, drag kecil dikembalikan ke slide asal
- Clone slide pertama disembunyikan di desktop, kalau tidak maka poin trust
  pertama muncul dua kali di ujung baris
- Interval auto play, trust strip 4,5 detik dan social proof 5,5 detik

**Pengujian:** 18 cek regresi halaman dan 14 cek carousel lewat Chrome
DevTools Protocol di viewport mobile 375x812, semua lolos. Ditambah pemeriksaan
tampilan desktop di 1280px.

**File:** `index.html`, `assets/css/style.css`, `assets/js/main.js`

### Beri napas pada kartu social proof strip

**Apa:** Menambah jarak antar kartu di Social Proof Strip dari nol jadi 16px,
lebar kartu dikecilkan dari 88 persen jadi 86 persen, background kartu dinaikkan
sedikit dari 6 persen jadi 8 persen, jarak nama ke kutipan jadi 1rem, dan jarak
kartu ke titik navigasi jadi 1rem.

**Kenapa:** Pengukuran di browser menunjukkan jarak antar kartu sebenarnya 0px.
Kartu satu menempel flush ke kartu berikutnya, jadi tidak terlihat sebagai blok
terpisah dan bagian terlihat jadi sangat padat. Jarak 16px plus peek kartu
berikutnya bikin orang paham itu carousel yang bisa digeser.

**Pengukuran sebelum dan sesudah:**
- Sebelum: jarak card 0 ke 1 = 0.0px, jarak card 1 ke 2 = 0.0px
- Sesudah: jarak antar kartu = 16.0px konsisten di semua pasangan

**Pengujian:** 14 cek carousel dan 18 cek regresi halaman tetap lolos.

**File:** `assets/css/style.css`

### Perbaiki slider before after yang langsung menukar foto saat diklik

**Apa:** Slider before after sekarang bergerak relatif terhadap posisi awal.
Divider tidak lagi lompat ke posisi sentuhan, dan handler `click` yang
menggeser slider sudah dihapus. Ditambah ambang gesture 3 persen dari lebar
slider, dan label kecil "Geser" di bawah handle.

**Kenapa:** perilaku lama memanggil `moveTo` di dalam `pointerdown`, jadi begitu
jarinya menyentuh, foto langsung tertukar ke posisi sentuhan tanpa user
bers intending meng geser. Di mobile ini yang paling mengganggu, karena tap
adalah gesture utuh. Pengukuran menunjukkan tiga masalah:

- Tap di 20 persen langsung lompat divider dari 50 persen ke 19,9 persen
- Tap di 90 persen lompat ke 89,7 persen
- Sentuhan yang 이어an digeser vertikal untuk scroll halaman, slider bergeser
  sendiri ke 80 persen

Perilaku lama diwarisi dari `slider.js` website utama. Di desktop dengan mouse
masuk akal karena orang mengompilasi klik, tahan, lalu tarik, tapi di touch
justru menghasilkan lompatan yang tidak diinginkan.

**Yang berubah:**
- `assets/js/main.js`: `pointerdown` hanya mencatat posisi awal, tidak
  memindahkan divider. `pointermove` memakai selisih dari posisi awal.
  Gesture di bawah ambang diabaikan. Handler `click` dihapus
- `index.html`: label "Geser" ditambah di bawah handle pada 5 slider
- `assets/css/style.css`: gaya `.ba-handle-label` dengan pill navy

**Pengukuran sesudah perbaikan, viewport 375px:**
- Tap di 20 persen: divider tetap 50 persen
- Tap di 90 persen: divider tetap 50 persen
- Sentuh lalu geser vertikal: divider tetap 50 persen
- Sentuh lalu geser 2 persen: divider tetap 50 persen
- Drag 50 ke 70 persen: divider 70 persen
- Drag mentok kanan: 100 persen
- Drag mentok kiri: 0 persen
- Drag relatif dari handle: 65 persen, tanpa lompatan di awal

**Pengujian:** 11 skenario slider, 20 cek regresi halaman, dan 14 cek carousel
semuanya lolos lewat Chrome DevTools Protocol di viewport 375x812.

**Yang ditunda:** slider belum bisa dioperasikan dengan keyboard. `role` masih
`group`, belum ada `aria-valuenow`, dan handle belum punya `tabindex`. Ini
disepakati ditunda supaya fokus ke perbaikan visual dulu.

**File:** `assets/js/main.js`, `index.html`, `assets/css/style.css`

### Cache busting untuk aset CSS dan JS

**Apa:** Link aset di `index.html` diberi query version, `style.css?v=2` dan
`main.js?v=2`. Aturan untuk menaikkan angka setiap kali mengubah CSS atau JS
ditambahkan di README.

**Kenapa:** `python3 -m http.server` tidak mengirim header `Cache-Control`,
hanya `Last-Modified`. Browser memakai heuristic caching, jadi aset lama bisa
dipakai beberapa menit setelah file diubah. Akibatnya perbaikan slider yang
sudah benar di server tetap terlihat memakai kode lama di browser. Dengan query
version, aset lama mustahil dipakai.

**File:** `index.html`, `README.md`

### Perbaiki sisi foto before dan after yang tertukar saat slider digeser

**Apa:** Rumus `clip-path` pada fungsi `moveTo` diperbaiki dari
`inset(0 (100 - percent) persen 0 0)` menjadi `inset(0 0 0 percent persen)`.
Versi aset dinaikkan ke `?v=4`.

**Kenapa:** Nilai awal `clip-path` di `style.css` adalah
`inset(0 0 0 50 persen)`, artinya foto after tampil di sebelah kanan divider
dan foto before di sebelah kiri. Tapi rumus di JavaScript memotong sisi yang
berlawanan, yaitu sisi kanan. Akibatnya begitu slider digeser untuk pertama
kali, sisi foto before dan after langsung tertukar, persis seperti yang
dikeluhan: foto before pindah ke kanan begitu slider disentuh.

Bug ini ada sejak versi pertama landing page dan tidak terlihat saat slider
belum pernah digeser, karena state awal diambil dari CSS dan belum pernah
disentuh JavaScript.

**Cara verifikasi:** screenshot region slider dibandingkan piksel per Piksel
dengan gambar sumber before dan after, dengan meniru tampilan `object-fit:
cover` milik browser. Strip kiri divider harus lebih mirip ke gambar before,
strip kanan harus lebih mirip ke gambar after.

- Rumus lama: `inset(0px 30% 0px 0px)`, strip kiri cocok ke AFTER, strip kanan
  cocok ke BEFORE, hasil TERBALIK
- Rumus baru: `inset(0px 0px 0px 70%)`, strip kiri cocok ke BEFORE, strip
  kanan cocok ke AFTER, hasil BENAR

**Pengujian:** 20 cek regresi halaman, 14 cek carousel, dan 1 cek sisi foto
semuanya lolos. Audit copy tetap bersih.

**File:** `assets/js/main.js`, `index.html`

### Card WhatsApp di Dual CTA diganti putih

**Apa:** Latar Card 2 di Section 6 Dual CTA diubah dari gradient kuning
`#F4A100` ke `#d98f00` menjadi putih polos, dengan border abu-abu tipis dan
bayangan neumorphism. Gaya step badge dan warna teks step ikut menyesuaikan.

**Kenapa:** Card kuning memakai semua font berwarna navy, sehingga blok itu
kelihatan berat dan beda karakter dengan kartu layanan di Section 4. Dengan
putih, kedua kartu di section ini serasi dengan card before after.

**Yang berubah:**
- `assets/css/style.css`: `.cta-card-amber` menjadi `.cta-card-white` dengan
  background `var(--secondary)`, border `var(--border)`, dan shadow
  `var(--nb-raised)`. `.on-amber` menjadi `.on-white`, badge step memakai
  `var(--surface)` dan `var(--nb-inset)`, teks step memakai `var(--text-body)`
- `index.html`: class Card 2 jadi `cta-card cta-card-white on-white`
- Versi aset CSS dinaikkan ke `?v=5`

Card 1 (Booking Via Apps) tidak disentuh.

**File:** `assets/css/style.css`, `index.html`

### Galeri testimoni jadi carousel auto play

**Apa:** Section 7 Testimoni Gallery diubah dari rail yang hanya bisa di-scroll
manual menjadi carousel auto play yang bisa di drag, memakai komponen carousel
yang sama dengan Social Proof Strip. Delapan kartu testimoni jadi slide, plus
titik navigasi di bawahnya.

**Kenapa:** Section 2 sudah berjalan dengan pola ini dan hasilnya bagus.
Bagian atas halaman ini butuh perlakuan yang sama supaya visitor tidak perlu
geser manual untuk melihat testimoni berikutnya.

**Yang berubah:**
- `index.html`: Section 7 dibungkus `.carousel` dengan
  `data-carousel-interval="7000"`. Track memakai `.carousel-track .testi-track`,
  tiap figure dapat class `.carousel-slide` dan atribut `data-carousel-slide`.
  Ditambah titik navigasi `.carousel-dots.on-light`
- `assets/css/style.css`: `.testi-rail` diganti `.testi-track` dan ukuran
  slide 78 persen. Class baru `.carousel-dots.on-light` untuk titik navigasi di
  atas latar terang, karena warna titik bawaan putih semi transparan tidak
  terlihat di Section 7 yang berlatar terang

**Perilaku:** komponen carousel yang dipakai sudah menangani jeda dan lanjut
auto play saat hover, `mouseenter` menghentikan dan `mouseleave` melanjutkan.
Tidak ada perubahan JavaScript untuk bagian ini.

Desktop tetap grid 2 kolom, titik navigasi disembunyikan, dan slide clone
untuk loop disembunyikan lewat `.carousel-clone`.

Versi aset CSS dinaikkan ke `?v=6`.

**File:** `index.html`, `assets/css/style.css`

### Latar footer diubah ke putih

**Apa:** Latar footer diubah dari gelap `#1e293b` menjadi putih `var(--secondary)`.
Warna teks link dan copyright disesuaikan supaya tetap terbaca di atas putih.

**Kenapa:** Permintaan perubahan surface footer ke putih. Warna teks lama
memakai abu-abu terang yang memang dirancang untuk latar gelap, kalau
dipakai di atas putih teksnya nyaris tidak keliatan.

**Yang berubah:**
- `assets/css/style.css`: `.footer-lp` memakai `background: var(--secondary)` dan
  `color: var(--text-body)`. Link footer memakai `var(--text-body)` dengan
  hover `var(--navy)`. `.footer-copy` memakai `var(--text-medium)`
- Versi aset CSS dinaikkan ke `?v=7`

**File:** `assets/css/style.css`, `index.html`

### Hover tombol CTA di Hero

**Apa:** State hover kedua tombol CTA di Hero diganti. Tombol Booking Via Apps
berubah dari pill navy jadi pill putih dengan font navy. Tombol Booking Via
WhatsApp berubah dari pill amber jadi pill hijau WhatsApp dengan font putih.
Keduanya memakai bayangan neumorphism `--nb-raised-lg` saat hover.

**Kenapa:** Permintaan perbaikan tombol CTA, dikerjakan per section. Section ini
paling pertama karena dipakai visitor yang baru arrives dari iklan.

**Yang berubah:**
- `assets/css/style.css`: aturan hover baru dibatasi di dalam `#hero` supaya
  tombol CTA di section lain tidak ikut berubah. Latar hover memakai gradient
  supaya transisinya mulus, gradient ke warna polos tidak bisa dianimasikan.
  Token baru `--wa-green` dan `--wa-green-dark` ditambahkan
- Versi aset CSS dinaikkan ke `?v=8`

State normal kedua tombol tidak disentuh.

**File:** `assets/css/style.css`, `index.html`

### Stroke biru pada hover tombol Booking Via Apps di Hero

**Apa:** State hover tombol Booking Via Apps di Hero diberi garis tepi biru
1px di dalam tombol.

**Kenapa:** Permintaan tambahan stroke pada hover tombol tersebut.

**Catatan teknis:** stroke digambar pakai `inset 0 0 0 1px`, bukan `border`.
Kalau memakai `border`, ukuran tombol bertambah 2px saat hover dan tombol
sebelahnya ikut bergeser karena susunan flex. Dengan inset box-shadow ukuran
tombol tetap, dan bentuknya mengikuti `border-radius: 999px` jadi tetap berbentuk
pill.

**File:** `assets/css/style.css`, `index.html`

### Hover tombol booking di Section 4 disamakan dengan Hero

**Apa:** Kelima tombol booking di kartu layanan Section 4 memakai hover yang
sama persis dengan tombol Booking Via Apps di Hero, yaitu pill jadi putih, font
navy, stroke biru 1px di dalam tombol, dan bayangan neumorphism.

**Kenapa:** Permintaan hover yang sama untuk tombol booking di Section 4.

**Yang berubah:**
- `assets/css/style.css`: aturan hover dipindah jadi selector daftar,
  `#hero .btn-cta-navy:hover, #layanan .btn-cta-navy:hover`, sehingga kedua
  section memakai deklarasi yang sama dan dijamin identik. Aturan transisi
  ikut diperluas ke `#layanan .btn-cta` supaya perpindahan warna ikut mulus
- Versi aset CSS dinaikkan ke `?v=10`

Tombol di section lain belum ikut berubah.

**File:** `assets/css/style.css`, `index.html`

### Hover tombol di Section 6 Dual CTA

**Apa:** Tombol Booking Sekarang di Card 1 dan tombol Chat WhatsApp di Card 2
masing-masing mendapat hover baru.

**Kenapa:** Permintaan hover tombol di Section 6, dikerjakan per section seperti
section sebelumnya.

**Yang berubah:**
- `assets/css/style.css`:
  - Card 1, tombol Booking Sekarang. `.btn-cta-amber` dengan hover pill putih
    dan font navy, tanpa stroke. Bayangan neumorphism tetap dipakai
  - Card 2, tombol Chat WhatsApp. `.btn-cta-navy` dengan hover pill hijau
    WhatsApp dan font putih, deklarasinya sama persis dengan tombol Booking
    Via WhatsApp di Hero
  - Aturan transisi diperluas ke `#booking .btn-cta` supaya perpindahan warna
    ikut mulus
- Versi aset CSS dinaikkan ke `?v=11`

Tombol di section lain belum ikut berubah.

**File:** `assets/css/style.css`, `index.html`

### Hover tombol di Section 9 Final CTA

**Apa:** Tombol Booking Via Apps mendapat hover pill putih dengan font navy.
Tombol Booking Via WhatsApp diubah state normalnya menjadi pill putih dengan
font navy, dan hover-nya hijau WhatsApp.

**Kenapa:** Permintaan hover tombol di Section 9. Tombol WhatsApp di section
ini memakai `btn-cta-navy`, yaitu pill navy di atas section yang juga navy,
jadi nyaris tidak keliatan. Mengubahnya ke pill putih membuat tombolnya
terlihat dan serasi dengan tombol Apps di sebelahnya.

**Yang berubah:**
- `assets/css/style.css`:
  - `#cta-akhir .btn-cta-amber:hover` untuk tombol Booking Via Apps, pill putih
    dengan font navy dan bayangan neumorphism, tanpa stroke
  - `#cta-akhir .btn-cta-navy` mengubah state normal tombol WhatsApp ke pill
    putih dengan font navy
  - `#cta-akhir .btn-cta-navy:hover` untuk tombol WhatsApp, hijau WhatsApp
    dengan font putih, deklarasinya sama dengan tombol WhatsApp di section lain
  - Aturan transisi diperluas ke `#cta-akhir .btn-cta`
- Versi aset CSS dinaikkan ke `?v=12`

**File:** `assets/css/style.css`, `index.html`

### Ikon di footer diseragamkan ukurannya

**Apa:** Ikon Instagram dan Ikon globe di footer diperbesar supaya sama besar
dengan ikon WhatsApp.

**Kenapa:** Ketiga ikon memakai box SVG yang sama, yaitu 18 piksel, tapi isi
gambarnya tidak sama besar. Ikon WhatsApp mengisi penuh box 24 unitnya, ikon
Instagram cuma 17 unit, ikon globe 18 unit. Akibatnya ikon WhatsApp tampak
sekitar 40 persen lebih besar dari dua ikon lain, dan teks di sebelahnya jadi
kelihatan beda ukuran karena huruf kecil di sebelah ikon besar dan huruf lebih
besar di sebelah ikon kecil.

**Yang berubah:**
- `assets/icons/icon-instagram.svg` dan `assets/icons/icon-globe.svg`: geometri
  diperbesar supaya isi gambarnya mengisi 22 unit, sama dengan ikon WhatsApp.
  Titik kecil di pojok Instagram ikut menyesuaikan posisi dan ukurannya
- `index.html`: symbol `i-instagram` dan `i-globe` di sprite diperbarui dengan
  geometri yang sama

Ukuran font ketiga link footer memang sudah sama karena aturan
`.footer-lp a`, jadi masalahnya murni dari ukuran ikon.

Ikon Instagram dan ikon globe tidak dipakai di luar footer, jadi perubahan ini
tidak menyentuh bagian lain halaman.

**File:** `index.html`, `assets/icons/icon-instagram.svg`,
`assets/icons/icon-globe.svg`

### Sticky CTA mobile dirapikan

**Apa:** Latar sticky bar diubah dari abu-abu terang ke navy. Tombol Booking
Apps diubah jadi pill putih dengan icon dan font navy, hover-nya pill putih
dengan stroke navy. Tombol WhatsApp hanya gotong hover hijau WhatsApp.

**Kenapa:** Permintaan perbaikan tombol sticky, tetap satu section per satu
section seperti tombol-tombol sebelumnya.

**Yang berubah:**
- `assets/css/style.css`:
  - `.sticky-cta` memakai `background: var(--navy)`
  - `.sticky-cta .btn-cta-navy` diubah jadi pill putih dengan font navy
  - `.sticky-cta .btn-cta-navy:hover` pill putih dengan stroke navy 1px
  - `.sticky-cta .btn-cta-amber:hover` hover hijau WhatsApp dengan font
    putih, deklarasi sama seperti tombol WhatsApp di section lain
  - Aturan transisi ditambahkan di `.sticky-cta .btn-cta` supaya perpindahan
    warna ikut mulus
- Versi aset CSS dinaikkan ke `?v=13`

**Catatan teknis:** bayangan tombol di sticky bar memakai token
`--nb-on-dark`, token neumorphism milik website utama yang memang buat elemen
di atas latar gelap. Bayangan neumorphism terang `--nb-raised-lg` akan
muncul sebagai halo putih di sekitar tombol, dan tidak cocok untuk bar navy.

State normal tombol WhatsApp tetap amber, sesuai permintaan hanya hover yang
diubah.

**File:** `assets/css/style.css`, `index.html`

### Teks Hero dibungkus kartu putih

**Apa:** Judul dan subjudul di Hero dibungkus kartu dengan surface putih, border
abu-abu tipis, dan bayangan neumorphism.

**Kenapa:** Permintaan bagian Hero dibikin seragam dengan section lain, yang
memakai kartu putih dengan bayangan neumorphism.

**Yang berubah:**
- `index.html`: class `.hero-card` membungkus elemen h1 dan paragraf subjudul
  di Hero
- `assets/css/style.css`: class baru `.hero-card` memakai `var(--secondary)`
  untuk background, `var(--border)` untuk border, `var(--nb-raised)` untuk
  bayangan, dan padding 1.75rem di mobile serta 3rem di lebar 768px ke atas
- Versi aset CSS dinaikkan ke `?v=14`

Kartu ini tidak memakai efek naik saat hover, berbeda dari `.card-nb`, karena
isinya bukan elemen yang bisa diklik.

Logo, tombol CTA, dan gambar Hero tetap di luar kartu.

**File:** `index.html`, `assets/css/style.css`

### Layout Hero desktop diubah jadi dua kolom

**Apa:** Di lebar 768px ke atas, Hero memakai grid 12 kolom. Kartu judul di
kolom kiri baris pertama, tombol CTA di kolom kiri baris kedua, dan foto Hero
di kolom kanan membentang dari baris kartu sampai baris CTA.

**Kenapa:** Permintaan perbaikan layout Hero di versi desktop. Referensi diambil
dari Hero website utama yang memakai `.bento-grid` 12 kolom, tile teks
`col-span-7`, dan tile gambar `col-span-5` dengan `row-span-2`.

**Yang berubah:**
- `index.html`: pembungkus Hero diubah menjadi `.hero-grid` yang memuat
  `.hero-logo`, `.hero-card`, `.hero-cta`, dan `.hero-media`
- `assets/css/style.css`: media query 768px ke atas mengatur penempatan grid.
  Foto memakai perlakuan `tile-media` milik website utama, yaitu padding 10px,
  bayangan `var(--nb-inset)`, dan gambar `object-fit: cover` dengan radius
  `var(--nb-radius-md)`
- Versi aset CSS dinaikkan ke `?v=15`

**Catatan:**
- Tampilan mobile tidak berubah sama sekali. Semua aturan desktop berada di
  dalam media query, dan urutan elemen di markup tetap logo, kartu, CTA, foto
- Tombol CTA selalu berada di bawah kartu judul dan subjudul, baik di mobile
  maupun di desktop
- Tepi paling bawah foto sama dengan tepi paling bawah tombol CTA, karena
  foto membentang dua baris grid dan baris ketiga berisi CTA
- Teks di dalam kolom kiri tetap terpusat, mengikuti desain landing page yang
  sudah ada. Website utama memakai teks rata kiri, tapi itu belum diubah
  karena permintaan hanya soal penempatan elemen

**File:** `index.html`, `assets/css/style.css`

### Perbaikan layout Hero desktop dan dimensi gambar

**Apa:** Hero desktop diperbaiki dari hasil pemeriksaan screenshot, plus atribut
dimensi 20 gambar diperbaiki.

**Yang diperbaiki:**

1. Tombol CTA membesar jadi 209px dari tinggi sebenarnya 58px, dan terlihat
   seperti pil yang melebar. Penyebabnya gambar foto di dalam tile memakai
   `height: 100%` sementara tinggi tile belum definite, jadi tinggi intrinsik
   foto 1620px ikut menentukan tinggi baris grid. Baris kedua jadi 497px dan
   baris ketiga 209px, tombol flex pun ikut meninggi karena
   `align-items: stretch`.
   Perbaikan: gambar foto diposisikan absolut supaya keluar dari aliran dan
   nol-sumbangan ke tinggi baris. Tile foto diberi `min-height: 0` dan
   container CTA diberi `align-items: center`.

2. Kartu judul ikut melar jadi 497px karena barisnya membengkak, sekarang
   kembali 346px sesuai isinya.

3. Foto meluber 218px keluar dari tile. Penyebabnya gambar ter-constraint
   over-constrained dengan `width: auto` dan `height: auto`, jadi browser
   memakai ukuran intrinsik 1080x1620 dan `object-fit: cover` tidak berlaku.
   Perbaikan: dimensi eksplisit `calc(100% - 20px)` dan `calc(100% - 10px)`.

4. Tepi paling bawah foto sebelumnya 10px di atas tepi paling bawah tombol
   CTA, karena padding tile. Sekarang jaraknya 0px, sesuai permintaan tepi
   foto sejajar dengan tepi tombol CTA.

5. Kolom kanan baris paling atas kosong karena foto baru mulai di baris kartu.
   Sekarang foto membentang dari baris logo sampai baris CTA.

6. Atribut `width` dan `height` pada 20 gambar salah semua, sehingga browser
   mereserve kotak dengan rasio yang keliru dan halaman bergeser saat gambar
   dimuat. Daftar yang diperbaiki:
   - `Hero.webp` ditulis 1200x800, aslinya 1080x1620
   - 10 gambar before after ditulis 800x533, aslinya 540x720 atau 540x675
   - 8 screenshot testimoni ditulis 600x400, aslinya 681x700
   - `Method.webp` ditulis 600x400, aslinya 1080x589

**Pengukuran akhir di lebar 1280px:**
- tinggi baris grid 80, 346, dan 58
- tinggi kartu 346px
- tinggi tombol 58px
- tinggi foto 522px
- jarak tepi bawah foto ke tepi bawah tombol CTA 0px

**File:** `index.html`, `assets/css/style.css`

### Bangun landing page conversion dari nol

**Apa:** Membuat landing page conversion InDeep Cleaning ID sebagai aplikasi
statis terpisah di folder `landing_page/`. Satu halaman dengan 10 section,
fokus mobile-first karena traffic berasal dari Meta, Google, dan TikTok Ads
yang rata-rata dibuka di ponsel.

**Kenapa:** Website utama berorientasi informasi dan SEO. Landing page ini
berorientasi konversi, jadi butuh jalur tanpa navigasi, CTA yang selalu
terlihat, dan subdomain sendiri supaya tidak mengganggu performa website
utama.

**Yang berubah:**
- `index.html` dengan 10 section: Hero, Social Proof Strip, Masalah yang
  Tidak Terlihat, Layanan + Before After, Metode QDWC, Dual CTA, Testimoni
  Gallery, Coverage + FAQ, Final CTA, Footer
- `assets/css/style.css` berisi design system neumorphism yang konsisten
  dengan website utama, plus komponen khusus landing page
- `assets/js/main.js` berisi slider before after, scroll reveal, FAQ
  accordion, sticky CTA mobile, dan smooth scroll. Vanilla JS, tanpa library
- `assets/icons/` berisi 33 icon SVG custom, outline 24x24, warna
  `currentColor` supaya bisa di-override lewat CSS
- Aset asli disalin dari website utama: Logo, Hero, Method, og-banner,
  14 pasangan foto before after, 8 screenshot testimoni
- SEO lengkap: title, meta description, Open Graph, canonical, hreflang,
  4 JSON-LD schema (WebSite, LocalBusiness, Service, FAQPage)
- Google Analytics `G-BBFXP4MK0V` aktif, pixel Meta, Google Ads, dan TikTok
  sudah disiapkan sebagai placeholder di `head`
- `robots.txt`, `sitemap.xml`, `favicon.svg`, `.htaccess` untuk HTTPS,
  security header, cache, dan gzip
- `README.md`, `CONTRIBUTING.md`, `ENGINEER.md`, `LICENSE`, `.gitignore`

**Catatan desain:**
- Teks pada tombol amber memakai warna navy, bukan putih. Rasio kontras
  putih di atas `#F4A100` cuma 2.1 banding 1, sedangkan navy di atas amber
  6.9 banding 1, jadi pilihan ini memenuhi WCAG AA
- Angka statistik di Section 3 bersumber dari Cleveland Clinic Health,
  Asian Pacific Journal of Allergy and Immunology 2010, NYU Langone
  Medical Center, dan US EPA. Sumber ditulis di bawah tiap kartu
- Angka "5000+ Kasur dan Sofa Ditangani" memakai angka yang sama dengan
  website utama agar tidak saling bertentangan

**Yang belum selesai:**
- Tailwind masih dimuat lewat CDN, wajib dibundle dengan Tailwind CLI
  standalone sebelum go-live
- Pixel iklan masih placeholder, belum ada ID asli

**File:** `index.html`, `assets/css/style.css`, `assets/js/main.js`,
`assets/icons/`, `assets/img/`, `robots.txt`, `sitemap.xml`, `favicon.svg`,
`.htaccess`, `README.md`, `CONTRIBUTING.md`, `ENGINEER.md`, `LICENSE`,
`.gitignore`
