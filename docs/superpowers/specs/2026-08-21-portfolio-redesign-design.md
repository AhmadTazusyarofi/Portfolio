# Redesign Portfolio Frontend — Palet 2 Warna

Tanggal: 2026-08-21
Scope: `portfolio_frontend/` saja. `portfolio_backend/` tidak disentuh.

## Latar Belakang

`src/App.tsx` saat ini 1003 baris berisi seluruh halaman: Hero, About, Projects,
Certifications, dan Contact digabung dalam satu file, memakai komponen ReactBits.
Paletnya dark (`slate-900/950`) dengan aksen ungu `#5227ff` yang di-hardcode di
belasan tempat. Redesign ini mengganti palet menjadi dua warna, memecah halaman
per section, dan mengganti navigasi.

Tiga masalah struktural yang ikut diselesaikan karena menghalangi pekerjaan ini:

1. `src/App.css` baris 12-14 berisi `* { pointer-events: none }`. Aturan ini ada
   untuk menahan canvas Ribbons agar tidak memblokir klik, dan akibatnya setiap
   elemen interaktif di App.tsx harus ditambal `style={{ pointerEvents: "auto" }}`.
   Karena Ribbons dihapus, aturan dan seluruh tambalannya ikut dibuang.
2. `src/index.css` memaksa `font-family: "Roboto Condensed" !important` pada
   selector `*`, mengunci tipografi.
3. Token warna shadcn (`--background`, `--primary`, dst.) sudah terdefinisi
   lengkap tapi tidak pernah dipakai — semua warna ditulis literal.

## Keputusan

| Aspek | Keputusan |
|---|---|
| Palet | Murni 2 warna: `--background: #FAF7F5`, `--secondary: #000000`. Tanpa turunan abu-abu atau opacity. |
| Hirarki visual | Dibangun lewat ukuran font, weight, dan spacing — bukan warna. |
| Font | Archivo (body) + Archivo Black (display/heading) |
| Struktur | Opsi A: `src/sections/` per section, state lintas-section diangkat ke `App.tsx` |
| Section final | Hero, About, Projects, Contact |

### Yang dihapus

- **Ribbons** — dekorasi WebGL ungu, dirancang untuk latar gelap
- **LaserFlow** — dekorasi WebGL ungu
- **Spline robot** (`<spline-viewer>` dari CDN unpkg di Hero)
- **DomeGallery** dan seluruh section Certifications — dihilangkan sementara,
  tanpa pengganti. Aset `src/assets/certifications/1-9.webp` tetap disimpan di
  disk kalau section ini mau dihidupkan lagi nanti.
- **StaggeredMenu** — digantikan PillNav
- Komponen yang memang tidak pernah diimpor: `CircularText`, `ScrambledText`,
  `ScrollFloat`, `TextPressure`, `TextType`

### Yang dipertahankan

- **Lanyard** — kartu ID 3D dengan physics di section About. Menahan dependency
  `three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/rapier`,
  `meshline`.
- **MetallicPaint** — dipakai untuk logo di PillNav (lihat bagian PillNav).
  `parseLogoImage`, state `logoImageData`, dan `useEffect` fetch logo di
  `App.tsx` tetap ada, hanya berpindah konsumen dari StaggeredMenu ke PillNav.
- Animasi teks: `SplitText`, `BlurText`, `DecryptedText`, `RotatingText`,
  `ScrollReveal`, `ScrollVelocity`, `LogoLoop`
- `ChatWidget`, `Carousel` (embla), modal detail project, toast

### Dependency yang dilepas

| Paket | Alasan |
|---|---|
| `ogl` | hanya dipakai Ribbons |
| `@use-gesture/react` | hanya dipakai DomeGallery |
| `framer-motion` | tidak pernah diimpor (semua pakai `motion/react`) |
| `react-router-dom` | tidak pernah diimpor |

`gsap` tetap — sudah dipakai `SplitText` dan `ScrollReveal`, dan menjadi
dependency PillNav.

## Kontrak Token Warna

Di `src/index.css`, dua warna menjadi sumber kebenaran dan seluruh token shadcn
yang sudah ada diarahkan ke keduanya. Konsekuensinya utility Tailwind
(`bg-background`, `text-secondary`, `border-border`) langsung ikut berubah tanpa
perlu cari-ganti per file.

```css
:root {
  --background: #FAF7F5;
  --secondary:  #000000;

  --foreground:           var(--secondary);
  --card:                 var(--background);
  --card-foreground:      var(--secondary);
  --popover:              var(--background);
  --popover-foreground:   var(--secondary);
  --primary:              var(--secondary);
  --primary-foreground:   var(--background);
  --secondary-foreground: var(--background);
  --muted:                var(--background);
  --muted-foreground:     var(--secondary);
  --accent:               var(--secondary);
  --accent-foreground:    var(--background);
  --border:               var(--secondary);
  --input:                var(--secondary);
  --ring:                 var(--secondary);
}
```

Blok `.dark { ... }` dihapus seluruhnya — tidak ada apa pun di project yang
men-toggle class `.dark`, dan desain ini single-theme.

Blok `@theme inline` yang sudah ada tetap dipertahankan apa adanya; blok itulah
yang memetakan `--color-*` ke variabel di atas.

## Kontrak Tipografi

`index.html` — ganti link Google Fonts ke Archivo + Archivo Black. Font
`Stack Sans Text` yang ada sekarang bukan font Google yang valid dan tidak pernah
ter-load, jadi dibuang.

`src/index.css` — hapus `font-family: ... !important` dari selector `*`, ganti
dengan token font:

```css
@theme {
  --font-sans:    "Archivo", system-ui, sans-serif;
  --font-display: "Archivo Black", "Archivo", sans-serif;
}
```

`body` memakai `font-sans`. Heading memakai utility `font-display`.

Catatan: Archivo Black hanya punya satu weight (400). Utility `font-bold` pada
elemen ber-`font-display` tidak akan mengubah apa pun dan berpotensi memicu
synthetic bold di sebagian browser — jadi jangan dipasangkan.

## Struktur File Target

```
src/
  App.tsx                 ~60 baris: merangkai section + state lintas-section
  sections/
    Hero.tsx
    About.tsx
    Projects.tsx
    Contact.tsx
  components/
    PillNav.tsx           baru, dari ReactBits
    ProjectModal.tsx      diekstrak dari App.tsx
    Toast.tsx             diekstrak dari App.tsx
    ChatWidget.tsx        tetap
    Lanyard.tsx           tetap
    LoadingScreen.tsx     tetap
    ...(animasi teks)     tetap
    ui/                   tetap (shadcn)
  lib/
    utils.ts              tetap
    utils-icon.ts         tetap
    utils-project.ts      tetap
```

### State lintas-section

`selectedProject` dan toast tetap di `App.tsx` karena dipicu dari tombol di dalam
kartu `Projects` tetapi di-render di level teratas. `Projects.tsx` menerima dua
prop: `onSelectProject(project)` dan `onShowToast(message)`.

Alasan tidak menaruh modal di dalam `Projects.tsx`: project ini sudah punya
riwayat masalah `position: fixed` + `z-index` bertumpuk (nilai `z-10`, `z-40`,
`z-50`, `z-999` bercampur). Me-render overlay dari dalam alur section mengundang
masalah yang sama kembali.

## PillNav

Sumber komponen: ReactBits, varian TypeScript + Tailwind.

Perubahan terhadap source aslinya: **buang import `Link` dari `react-router-dom`
beserta seluruh cabang `isRouterLink`.** Semua item menu memakai anchor hash
(`#about`), dan fungsi `isExternalLink` bawaannya sudah memperlakukan href
berawalan `#` sebagai eksternal — artinya cabang `Link` tidak akan pernah
tereksekusi. Menghapusnya membuat `react-router-dom` bisa dilepas dari
dependency.

### Logo: MetallicPaint

Logo di PillNav memakai `MetallicPaint`, bukan `<img>` biasa. Ini menuntut dua
penyesuaian pada source ReactBits:

1. **Prop `logo` berubah dari `string` menjadi `React.ReactNode`.** Bawaannya
   me-render `<img src={logo}>`; MetallicPaint me-render `<canvas>`, jadi
   PillNav cukup menaruh node apa pun yang diberikan ke dalam kontainer bundar
   berukuran `var(--nav-h)`.
2. **Animasi rotate saat hover dipindah dari `<img>` ke elemen wrapper.**
   `logoImgRef` bawaan menunjuk ke `<img>` yang sudah tidak ada; GSAP merotasi
   div pembungkusnya.

Warna shader MetallicPaint disetel agar persis mengikuti palet. Di
`MetallicPaint.tsx` baris 306-307 warnanya di-hardcode:

```glsl
vec3 color1 = vec3(.98, 0.98, 1.);
vec3 color2 = vec3(.1, .1, .1 + .1 * smoothstep(.7, 1.3, uv.x + uv.y));
```

Diubah menjadi `#FAF7F5` (`vec3(.980, .969, .961)`) dan `#000000`
(`vec3(0., 0., 0.)`), menghilangkan semburat biru pada channel B.

Catatan: MetallicPaint menjalankan loop `requestAnimationFrame` dan satu konteks
WebGL secara terus-menerus. Karena kanvasnya kecil (seukuran `--nav-h`, 42px)
biayanya wajar, tapi ini berarti situs tetap punya satu WebGL context di nav
selain milik Lanyard.

Konfigurasi:

```jsx
<PillNav
  logo={<MetallicPaint imageData={logoImageData} />}
  logoAlt="Ahmad Tazusyarofi"
  items={[
    { label: "Home",     href: "#home" },
    { label: "About",    href: "#about" },
    { label: "Projects", href: "#projects" },
    { label: "Contact",  href: "#contact" },
  ]}
  baseColor="#000000"
  pillColor="#FAF7F5"
  pillTextColor="#000000"
  hoveredPillTextColor="#FAF7F5"
/>
```

Posisi diubah dari `absolute` (bawaan ReactBits) menjadi `fixed`, karena ini
situs one-page yang di-scroll.

`id="home"` ditambahkan pada section Hero — saat ini link `#home` di menu
menunjuk ke elemen yang tidak ada.

## Urutan Implementasi

Dikerjakan bertahap, satu fase satu commit, supaya tiap langkah bisa dilihat
hasilnya.

Pemecahan `App.tsx` tidak dilakukan sekaligus di awal. Tiap fase section
(2 sampai 5) mengekstrak section-nya sendiri dari `App.tsx` ke
`src/sections/` sekaligus me-restyle-nya. Jadi `App.tsx` menyusut bertahap, dan
setiap commit berakhir dengan aplikasi yang tetap bisa di-build.

**Fase 0 — Fondasi.** Token warna, font Archivo, hapus
`* { pointer-events: none }` beserta seluruh tambalan `pointerEvents: "auto"`,
hapus komponen mati + dependency mati, bersihkan `index.html`. Belum ada
restyling section. Setelah fase ini tampilan akan terlihat rusak (teks hitam di
atas krem dengan sisa class `bg-slate-*`) — ini diharapkan, dan diperbaiki
fase demi fase berikutnya.

**Fase 1 — PillNav.** Ganti StaggeredMenu, termasuk memindahkan logo
MetallicPaint ke PillNav dan menyetel warna shader-nya. `logoImageData` bernilai
`null` sampai `parseLogoImage` selesai, jadi PillNav me-render `logo.svg` polos
sebagai fallback selama itu — bukan kotak kosong. Perubahan visual pertama yang
kelihatan.

**Fase 2 — Hero.** Tanpa robot Spline; layout diatur ulang untuk mengisi ruang
yang ditinggalkannya.

**Fase 3 — About.** Lanyard di atas latar krem. Shape `#d9d8db` dihapus.

**Fase 4 — Projects.** Kartu bergaris hitam 1px menggantikan kartu gelap
ber-glow. Thumbnail di-`grayscale` secara default dan berwarna penuh saat hover —
supaya screenshot yang warna-warni tidak merusak disiplin 2 warna. Modal detail
diekstrak ke `ProjectModal.tsx`.

**Fase 5 — Contact.** Kartu glassmorphism jadi blok bergaris. Toast diekstrak ke
`Toast.tsx`.

## Verifikasi

Project ini tidak punya test framework, jadi tidak ada test otomatis yang
menjaga perubahan ini. Bukti kerja tiap fase:

1. `npm run build` lolos — perintah ini menjalankan `tsc -b`, jadi error tipe
   dan import yang menggantung akan ketahuan
2. `npm run lint` lolos
3. Pemeriksaan visual di dev server, termasuk di lebar mobile

## Di Luar Scope

- `portfolio_backend/` — termasuk `cors({ origin: "*" })` tanpa rate limit yang
  sudah dicatat sebagai temuan terpisah
- Menghidupkan kembali section Certifications
- `LoadingScreen` — durasinya (±4.8 detik memblokir render) tidak diubah di
  redesign ini
- Link sosial placeholder dan typo email di knowledge base `ChatWidget`
- Meta tag SEO / Open Graph
