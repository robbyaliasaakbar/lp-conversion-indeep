# Landing Page Conversion — InDeep Cleaning ID

> Landing page khusus **conversion campaign** dari Ads Manager (Meta, Google, TikTok).
> Satu halaman, satu tujuan: mengubah visitor iklan jadi customer lewat dua jalur booking.

| Key | Value |
|-----|-------|
| URL Live | `https://landingpage.indeepcleaningid.site/` |
| Repository | `https://github.com/robbyaliasaakbar/lp-conversion-indeep` |
| Hosting | Hostinger shared hosting, auto-deploy via GitHub |
| Stack | HTML5, Tailwind CSS (dibundle, bukan CDN), Vanilla JavaScript |
| Backend | Tidak ada. Murni frontend statis |
| Dependency runtime | Nol. Node.js hanya untuk build CSS |

---

## Kenapa landing page ini dipisah

Website utama (`indeepcleaningid.site`)-orientasinya **informasi dan SEO**.
Landing page ini orientasinya **konversi dari iklan**. Makanya dipisah ke
subdomain sendiri:

- URL pendek dan navigasi ringkas, visitor langsung diarahkan ke hero
- Tidak ada halaman lain yang bisa mengganggu jalur konversi
- Async loading, tidak membebani bandwidth website utama
- Repo terpisah, siklus deploy terpisah, aman kalau website utama bermasalah

---

## Struktur Folder

```
landing_page/
├── index.html               Landing page utama (satu halaman, 10 section)
├── 404.html                 Halaman tidak ditemukan
├── robots.txt               Aturan crawler
├── sitemap.xml              Peta URL untuk search engine
├── favicon.svg              Ikon tab browser
├── .htaccess                HTTPS, security header, cache, gzip
├── README.md                Dokumen ini
├── CONTRIBUTING.md          Aturan kontribusi repo
├── ENGINEER.md              Log perubahan
├── LICENSE                  Lisensi proprietary
├── package.json             Script build Tailwind (devDependency)
├── tailwind.config.js       Konfigurasi Tailwind
├── .gitignore
└── assets/
    ├── css/
    │   ├── style.css               Design system + komponen landing page
    │   ├── tailwind-base.css       Hasil build: preflight + components
    │   ├── tailwind-utils.css      Hasil build: utilities
    │   ├── tailwind-input.css      Sumber base + components
    │   └── tailwind-utils-input.css Sumber utilities
    ├── js/
    │   └── main.js          Slider, scroll reveal, FAQ, sticky CTA
    └── img/
        ├── Logo.webp                  Logo tanpa teks (513x513)
        ├── logo+logo-text-stroke.webp Logo dengan teks versi stroke putih, dipakai navbar (1009x221)
        ├── Hero.webp                  Foto hero (1080x1620)
        ├── Method.webp                Foto metode QDWC (1080x589)
        ├── og-banner.webp             Banner Open Graph (1200x630)
        ├── before-after/    5 pasangan foto before after yang dipakai halaman
        └── testimoni/       8 screenshot testimoni asli
```

**Ikon dan sumber logo:** halaman memakai inline sprite, yaitu kumpulan
`<symbol>` di dalam `<svg style="display:none">` di bagian atas `index.html`.
Tidak ada file ikon terpisah di repo. Sumber per-ikon (35 file SVG) dan logo
dengan teks versi asli sebelum diberi stroke disimpan di
`Website indeepcleaning id/backup/icons-landing-page/`, di luar repo.

---

## Section Halaman

| # | Section | Fungsi |
|---|---------|--------|
| - | Navbar (sticky) | Logo, menu 8 tautan, tombol Booking dan WhatsApp (desktop), hamburger 2 garis di semua breakpoint |
| 1 | Hero | Headline, 2 CTA, trust strip |
| 2 | Social Proof Strip | 4 kutipan singkat, navy background |
| 3 | Masalah yang Tidak Terlihat | 4 fakta statistik dengan sumber |
| 4 | Layanan + Before After | 5 kategori layanan dengan slider |
| 5 | Metode QDWC | 4 wilayah kerja, 4 keunggulan, 8 tahap pencucian |
| 6 | Dual CTA | 2 jalur booking, anchor `#booking` |
| 7 | Testimoni Gallery | 8 screenshot asli |
| 8 | Coverage + FAQ | 5 kota, 8 pertanyaan accordion |
| 9 | Final CTA | Penutup dengan urgensi |
| 10 | Footer | Kontak minimal |

---

### Cache busting

Link aset di `index.html` memakai query version:

```html
<link rel="stylesheet" href="assets/css/style.css?v=23">
<script src="assets/js/main.js?v=7"></script>
```

**Naikkan angkanya setiap kali mengubah CSS atau JS.** Tanpa ini, browser
bisa memakai salinan lama dari cache dan perubahan tidak terlihat sama sekali.
Kalau kamu ubah tapi halaman tetap sama, cek dulu bagian ini.

> Catatan: `python3 -m http.server` tidak mengirim header `Cache-Control`, jadi
> tanpa version query, browser bebas menyimpan aset lama cukup lama.

---

## Local Development

Butuh **Python 3** saja, tidak ada npm install.

```bash
cd landing_page
python3 -m http.server 8888
```

Buka `http://localhost:8888`.

### Build Tailwind

Tailwind **sudah dibundle** menjadi file statis. Halaman tidak lagi memuat
`cdn.tailwindcss.com`.

**Kenapa dipecah dua file.** Preflight Tailwind adalah reset yang mengubah
nilai default browser, termasuk margin heading dan `line-height`. Reset itu
harus dimuat sebelum `style.css` supaya aturan desain project menang. Di sisi
lain, utility seperti `mb-8` dan `text-center` harus dimuat setelah
`style.css` supaya bisa menimpa class komponen. Karena itu hasil build dibagi:

| File | Isi | Urutan muat |
|---|---|---|
| `assets/css/tailwind-base.css` | `@tailwind base` + `components` | sebelum `style.css` |
| `assets/css/style.css` | Desain project | tengah |
| `assets/css/tailwind-utils.css` | `@tailwind utilities` | terakhir |

Urutan ketiganya di `<head>` **tidak boleh diubah**. Kalau `tailwind-base.css`
dipindah ke bawah `style.css`, reset-nya akan menimpa desain. Kalau
`tailwind-utils.css` dipindah ke atas, utility kalah dari class komponen.

**File sumber build** (jangan diedit hasil build-nya):

- `tailwind.config.js` — daftar file yang dipindai dan token warna/font
- `assets/css/tailwind-input.css` — sumber base + components
- `assets/css/tailwind-utils-input.css` — sumber utilities

**Cara build:**

```bash
npm install        # sekali saja, butuh Node.js
npm run build:css  # hasilkan tailwind-base.css dan tailwind-utils.css
```

Butuh Node.js dan npm. Ini **dependency build saja**, bukan runtime. Halaman
tetap statis dan tidak butuh Node saat diakses pengunjung. Folder
`node_modules/` di-gitignore, hasil build-nya **di-commit** karena dipakai
langsung oleh halaman.

> Setiap kali menambah class Tailwind baru di HTML, jalankan
> `npm run build:css` lagi. Kalau lupa, class baru tidak akan ada di CSS dan
> tampilannya tidak berubah.

Ukuran hasil build: sekitar 8 KB total, turun dari sekitar 407 KB saat masih
memakai CDN.

---

## Aturan Copywriting

WAJIB dipatuhi saat menambah atau mengubah teks di halaman ini.

| Aspek | Aturan |
|-------|--------|
| Bahasa | Indonesia profesional, sopan, engaging. Pakai "Anda" dan "Kami" |
| Slang | Dilarang "gue", "lo", "lu", "elo", "gw", dan kesan ngobrol sama teman |
| Em dash | Dilarang total |
| Hyphen | Dilarang sebagai penghubung kalimat. Boleh di list |
| Semicolon | Dilarang total |
| Tanda plus | Dilarang sebagai pemisah. Untuk angka seperti "5000+" tetap dipakai |
| Arrow | Dilarang. Ganti dengan "lalu", "kemudian", "selanjutnya" |
| Emoji | Dilarang di mana pun |
| Icon | Wajib file SVG, bukan emoji |

### Fakta statistik

Angka di Section 3 wajib punya sumber yang jelas dan ditampilkan di bawah
setiap kartu. Kalau ada angka baru, sertakan sumbernya. Jangan menulis
angka tanpa verifikasi.

---

## Tracking

| Platform | Status |
|----------|--------|
| Google Analytics | Aktif, `G-BBFXP4MK0V` |
| Meta Pixel | Placeholder, ada di `index.html` bagian `<head>` |
| Google Ads | Placeholder, ada di `index.html` bagian `<head>` |
| TikTok Pixel | Placeholder, ada di `index.html` bagian `<head>` |

Cara pasang pixel: buka `index.html`, cari blok `META PIXEL: PLACEHOLDER`,
hapus tanda `<!--` dan `-->` pembungkus, ganti `YOUR_PIXEL_ID` dengan ID asli.

---

## Deployment

Auto-deploy dari GitHub ke Hostinger. Repo: `lp-conversion-indeep`, branch
produksi `main`. Setelah merge ke `main`:

1. Tunggu 15 sampai 20 detik
2. Buka `https://landingpage.indeepcleaningid.site/`
3. Cek tidak ada error 404 atau 500

Detail alur kontribusi ada di [CONTRIBUTING.md](CONTRIBUTING.md).
