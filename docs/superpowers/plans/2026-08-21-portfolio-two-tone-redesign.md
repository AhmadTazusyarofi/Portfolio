# Portfolio Two-Tone Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ubah `portfolio_frontend` dari dark theme ungu menjadi palet dua warna (`#FAF7F5` + `#000000`) yang tersimpan sebagai CSS variable, pecah `App.tsx` yang 1003 baris menjadi satu file per section, dan ganti navigasi `StaggeredMenu` dengan `PillNav`.

**Architecture:** Dua warna didefinisikan sekali di `:root` dan seluruh token shadcn yang sudah ada diarahkan ke keduanya, sehingga utility Tailwind (`bg-background`, `text-secondary`, `border-border`) ikut berubah tanpa cari-ganti per file. `App.tsx` menyusut bertahap: tiap task section mengekstrak satu section ke `src/sections/` sekaligus me-restyle-nya, sehingga setiap commit berakhir dengan aplikasi yang tetap bisa di-build.

**Tech Stack:** React 19, TypeScript 5.9, Vite 7, Tailwind CSS v4 (CSS-first, tanpa `tailwind.config`), shadcn/ui, GSAP, `motion/react`, three.js + @react-three/fiber + rapier (khusus Lanyard).

**Spec:** `docs/superpowers/specs/2026-08-21-portfolio-redesign-design.md`

**Branch:** `redesign/two-tone`

## Global Constraints

- Palet **murni dua warna**: `#FAF7F5` (background) dan `#000000` (secondary). Tidak boleh ada abu-abu, opacity hitam, atau warna ketiga. Hirarki visual dibangun lewat ukuran font, weight, dan spacing.
- Warna disimpan sebagai CSS variable `--background` dan `--secondary` di `:root`, dan menjadi sumber kebenaran tunggal. Token lain mengacu ke keduanya lewat `var()`, tidak menulis ulang nilai hex.
- Font: `Archivo` untuk body, `Archivo Black` untuk display/heading. **Jangan pasangkan `font-bold` dengan `font-display`** — Archivo Black hanya punya weight 400, dan kombinasi itu memicu synthetic bold.
- Semua class Tailwind berwarna lama (`bg-slate-*`, `text-slate-*`, `border-slate-*`, `#5227ff`, `#d9d8db`, `bg-emerald-*`) harus hilang total di akhir plan.
- Section final hanya empat: Hero, About, Projects, Contact. Certifications dihapus beserta link menunya.
- Direktori kerja untuk semua perintah: `portfolio_frontend/`.

## Catatan Verifikasi: Project Ini Tidak Punya Test Framework

Plan ini menyimpang dari siklus TDD biasa karena alasan yang nyata: `portfolio_frontend` tidak punya test runner sama sekali — tidak ada vitest, jest, atau playwright di `package.json`, dan tidak ada satu pun file test. Menambahkan test framework berada di luar scope spec ini, dan menulis unit test untuk perubahan yang murni visual (warna, spacing, tata letak) tidak akan menangkap regresi yang kita pedulikan.

Sebagai gantinya, **setiap task memakai siklus verifikasi tiga langkah ini**, dan langkah-langkahnya ditulis eksplisit di tiap task:

1. `npm run build` — menjalankan `tsc -b` dengan `noUnusedLocals` dan `noUnusedParameters` menyala. Ini jaring pengaman utama: import yang menggantung setelah komponen dihapus, prop yang salah tipe, dan variabel sisa akan **menggagalkan build**. Perlakukan build yang gagal seperti test yang gagal.
2. `npm run lint` — ESLint dengan `typescript-eslint` + `react-hooks`.

   **Lint sudah gagal sejak sebelum pekerjaan ini dimulai.** Baseline yang
   terukur di commit `4407e90` (commit terakhir sebelum branch `redesign/two-tone`)
   adalah **54 problems: 44 errors, 10 warnings**, tersebar di `CircularText`,
   `Lanyard`, `LaserFlow`, `LogoLoop`, `MetallicPaint`, `RotatingText`,
   `SplitText`, `StaggeredMenu`, `TextPressure`, `TextType`, `ui/button.tsx`,
   `global.d.ts`, dan `lib/svg.d.ts` — hampir semuanya kode ReactBits dan shadcn
   yang disalin apa adanya. Memperbaikinya berada di luar scope plan ini.

   Jadi kriterianya bukan "lolos", melainkan: **jumlah error tidak boleh naik
   dari angka baseline task sebelumnya.** Angkanya justru akan turun sendiri
   saat Task 2 dan 3 menghapus `CircularText`, `LaserFlow`, `TextPressure`,
   `TextType`, dan `StaggeredMenu`. Catat angkanya di tiap task, dan kalau naik,
   berhenti — berarti kode baru yang menyebabkannya.
3. Pemeriksaan visual di `npm run dev`, pada lebar desktop **dan** mobile (≤640px).

Jangan pernah menyatakan sebuah task selesai tanpa menjalankan ketiganya dan melihat hasilnya.

---

### Task 1: Token warna dan tipografi

Mengganti fondasi warna dan font. Setelah task ini situs akan terlihat **rusak** — teks hitam di atas krem sementara section-section masih membawa class `bg-slate-*`. Ini diharapkan dan diperbaiki oleh task-task berikutnya. Yang harus benar di task ini hanyalah: variabelnya ada, font-nya ter-load, dan build lolos.

**Files:**
- Modify: `portfolio_frontend/src/index.css` (blok `:root`, blok `.dark`, blok `@layer base`)
- Modify: `portfolio_frontend/index.html` (link Google Fonts, link stylesheet duplikat)

**Interfaces:**
- Produces: CSS variable `--background` dan `--secondary` di `:root`; utility class `font-sans` (Archivo) dan `font-display` (Archivo Black) yang dipakai semua task berikutnya.

- [ ] **Step 1: Ganti blok `:root` di `src/index.css`**

Hapus seluruh blok `:root { ... }` yang sekarang (berisi `--background: oklch(1 0 0)` dan seterusnya) dan ganti dengan:

```css
:root {
  --radius: 0.625rem;

  /* === SUMBER KEBENARAN PALET === */
  --background: #faf7f5;
  --secondary: #000000;

  /* Seluruh token di bawah ini mengacu ke dua warna di atas. */
  --foreground: var(--secondary);
  --card: var(--background);
  --card-foreground: var(--secondary);
  --popover: var(--background);
  --popover-foreground: var(--secondary);
  --primary: var(--secondary);
  --primary-foreground: var(--background);
  --secondary-foreground: var(--background);
  --muted: var(--background);
  --muted-foreground: var(--secondary);
  --accent: var(--secondary);
  --accent-foreground: var(--background);
  --destructive: var(--secondary);
  --border: var(--secondary);
  --input: var(--secondary);
  --ring: var(--secondary);
}
```

Token `--chart-*` dan `--sidebar-*` dihapus: tidak ada chart maupun sidebar di project ini, dan membiarkannya berarti menyimpan warna di luar palet.

- [ ] **Step 2: Hapus blok `.dark` sepenuhnya**

Hapus seluruh blok `.dark { ... }` dari `src/index.css`. Tidak ada apa pun di codebase yang menambahkan class `.dark` ke elemen mana pun — verifikasi dengan perintah di Step 6. Desain ini single-theme.

- [ ] **Step 3: Tambahkan token font**

Sisipkan blok berikut di `src/index.css`, tepat **setelah** blok `@theme inline { ... }` yang sudah ada dan **sebelum** `:root`:

```css
@theme {
  --font-sans: "Archivo", system-ui, sans-serif;
  --font-display: "Archivo Black", "Archivo", system-ui, sans-serif;
}
```

Blok ini terpisah dari `@theme inline` dengan sengaja: `inline` membuat nilainya di-inline alih-alih dipancarkan sebagai CSS variable, dan untuk font stack kita ingin variabelnya benar-benar ada.

- [ ] **Step 4: Perbaiki blok `@layer base`**

Ganti blok `@layer base { ... }` yang sekarang menjadi:

```css
@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  html {
    scroll-behavior: smooth;
  }
  body {
    @apply bg-background text-foreground font-sans;
  }
}
```

Dua perubahan penting: `font-family: "Roboto Condensed" !important` pada selector `*` dihapus (itulah yang selama ini mengunci tipografi), dan `scroll-behavior` dipindah dari `*` ke `html` — tempat yang benar untuk properti itu.

- [ ] **Step 5: Ganti font dan bersihkan `index.html`**

Di `portfolio_frontend/index.html`, hapus baris ini:

```html
<link rel="stylesheet" href="/src/index.css" />
```

`src/main.tsx` sudah mengimpor `./index.css`, jadi baris ini memuat CSS yang sama dua kali.

Lalu ganti blok Google Fonts yang sekarang dengan:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,100..900;1,100..900&family=Archivo+Black&display=swap"
  rel="stylesheet"
/>
```

Font `Stack Sans Text` di link lama bukan font Google yang valid dan tidak pernah ter-load — dibuang tanpa pengganti.

- [ ] **Step 6: Verifikasi tidak ada yang memakai class `.dark`**

Run: `grep -rn "\"dark\"\|'dark'\|classList.*dark" src/ index.html`

Expected: tidak ada hasil yang menambahkan class `dark` ke elemen. Kalau ada, hentikan dan laporkan — asumsi single-theme di Step 2 keliru.

- [ ] **Step 7: Jalankan build dan lint**

Run: `npm run build && npm run lint`
Expected: build lolos; lint tetap di baseline 44 errors / 10 warnings (Task 1 tidak menyentuh file .ts/.tsx sama sekali, jadi angkanya harus persis sama).

- [ ] **Step 8: Pemeriksaan visual**

Run: `npm run dev`

Yang harus benar:
- Background halaman krem `#FAF7F5`, bukan putih dan bukan gelap
- Teks default hitam pekat
- Font sudah Archivo, bukan Roboto Condensed (huruf terlihat lebih lebar, bukan condensed)

Yang **wajar terlihat rusak** di titik ini: section-section masih punya blok `bg-slate-900` gelap dan aksen ungu. Jangan diperbaiki di task ini.

- [ ] **Step 9: Commit**

```bash
git add portfolio_frontend/src/index.css portfolio_frontend/index.html
git commit -m "Token warna dua nada dan tipografi Archivo"
```

---

### Task 2: Buang efek WebGL berat, section Certifications, dan pointer-events global

Task ini menghapus banyak kode dan tidak menambahkan apa pun. Nilainya: `* { pointer-events: none }` hanya bisa dicabut setelah Ribbons hilang, dan pencabutan itu membuka jalan untuk semua task berikutnya.

**Files:**
- Delete: `portfolio_frontend/src/components/Ribbons.tsx`
- Delete: `portfolio_frontend/src/components/LaserFlow.tsx`
- Delete: `portfolio_frontend/src/components/DomeGallery.tsx`
- Delete: `portfolio_frontend/src/components/CircularText.tsx`
- Delete: `portfolio_frontend/src/components/ScrambledText.tsx`
- Delete: `portfolio_frontend/src/components/ScrollFloat.tsx`
- Delete: `portfolio_frontend/src/components/TextPressure.tsx`
- Delete: `portfolio_frontend/src/components/TextType.tsx`
- Modify: `portfolio_frontend/src/App.css`
- Modify: `portfolio_frontend/src/App.tsx`
- Modify: `portfolio_frontend/index.html`
- Modify: `portfolio_frontend/package.json`

**Interfaces:**
- Consumes: token warna dari Task 1.
- Produces: `App.tsx` tanpa Ribbons/LaserFlow/DomeGallery/Spline dan tanpa satu pun `pointerEvents: "auto"`; section Certifications tidak ada lagi.

- [ ] **Step 1: Konfirmasi konsumen tiap komponen sebelum menghapus**

Run:
```bash
grep -rn "Ribbons\|LaserFlow\|DomeGallery\|CircularText\|ScrambledText\|ScrollFloat\|TextPressure\|TextType" src/ --include=*.tsx --include=*.ts
```

Expected: satu-satunya penyebutan `Ribbons`, `LaserFlow`, dan `DomeGallery` berada di `src/App.tsx` (import + pemakaian) dan di file komponennya sendiri. Lima komponen sisanya tidak boleh punya penyebutan di luar filenya sendiri. Kalau ada konsumen tak terduga, hentikan dan laporkan.

- [ ] **Step 2: Hapus kedelapan file komponen**

```bash
rm src/components/Ribbons.tsx src/components/LaserFlow.tsx src/components/DomeGallery.tsx \
   src/components/CircularText.tsx src/components/ScrambledText.tsx src/components/ScrollFloat.tsx \
   src/components/TextPressure.tsx src/components/TextType.tsx
```

- [ ] **Step 3: Cabut `pointer-events: none` global dari `src/App.css`**

Hapus **dua** blok berikut dari `src/App.css`:

```css
canvas {
  pointer-events: none;
}
* {
  pointer-events: none;
}
```

Hapus juga blok `@keyframes fade-in-scale` dan class `.animate-fade-in-scale` dari `App.css` — keduanya duplikat persis dari yang sudah ada di `index.css`.

`App.css` yang tersisa harus hanya berisi: reset `html, body`, `* { box-sizing: border-box }`, `.text-outline`, dan `.line-clamp-2-custom`.

- [ ] **Step 4: Hapus pemakaian Ribbons, LaserFlow, DomeGallery, Spline, dan section Certifications dari `App.tsx`**

Di `src/App.tsx`:

- Hapus baris import `Ribbons`, `LaserFlow`, dan `DomeGallery`.
- Hapus blok `{/* RIBBONS BACKGROUND */}` — div pembungkus beserta `<Ribbons ... />` di dalamnya.
- Hapus seluruh `<section id="certifications">` sampai penutupnya, termasuk `<DomeGallery />`, blok `<LaserFlow />`, dan heading Certifications-nya.
- Hapus konstanta `headingVariants` — satu-satunya pemakainya adalah heading Certifications yang baru saja dihapus. `noUnusedLocals` akan menggagalkan build kalau ini tertinggal.
- Hapus blok `<motion.div>` yang membungkus `<spline-viewer>` di Hero, termasuk komentar `@ts-expect-error` di atasnya. Kolom kiri Hero untuk sementara berdiri sendiri; tata letaknya dirapikan di Task 4.
- Hapus entri `Certifications` dari array `menuItems`.

- [ ] **Step 5: Hapus semua tambalan `pointerEvents: "auto"` dari `App.tsx`**

Hapus setiap `style={{ pointerEvents: "auto" }}` dan setiap properti `pointerEvents: "auto"` di dalam objek style yang lebih besar. Aturan global yang membuatnya perlu sudah dicabut di Step 3.

Kalau sebuah `style` jadi kosong setelah propertinya dibuang, hapus atribut `style`-nya sekalian. Kalau menyisakan properti lain (misalnya `isolation: "isolate"`), pertahankan properti itu.

Verifikasi setelahnya:

Run: `grep -c "pointerEvents" src/App.tsx`
Expected: `0`

Catatan: `className="pointer-events-none"` pada elemen dekoratif (overlay gradien, garis "Scroll to explore") **tetap dipertahankan** — itu disengaja dan berbeda dari tambalan `auto`.

- [ ] **Step 6: Buang script Spline dari `index.html`**

Hapus baris berikut dari `portfolio_frontend/index.html`:

```html
<script
  type="module"
  src="https://unpkg.com/@splinetool/viewer@1.12.29/build/spline-viewer.js"
></script>
```

Hero tidak lagi merender `<spline-viewer>`, jadi script dari CDN pihak ketiga ini tidak ada gunanya.

- [ ] **Step 7: Lepas dependency yang sudah tidak terpakai**

Run: `npm uninstall ogl @use-gesture/react framer-motion react-router-dom`

Alasan tiap paket: `ogl` hanya dipakai Ribbons; `@use-gesture/react` hanya dipakai DomeGallery; `framer-motion` dan `react-router-dom` tidak pernah diimpor sejak awal (seluruh animasi memakai `motion/react`).

**Jangan** lepas `three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/rapier`, atau `meshline` — kelimanya masih dipakai `Lanyard.tsx` yang dipertahankan.

- [ ] **Step 8: Konfirmasi tidak ada import yang menggantung**

Run: `grep -rn "ogl\|use-gesture\|framer-motion\|react-router" src/`
Expected: tidak ada hasil.

- [ ] **Step 9: Jalankan build dan lint**

Run: `npm run build && npm run lint`
Expected: build lolos; error lint **turun** dari 44 karena `CircularText`, `LaserFlow`, `TextPressure`, dan `TextType` ikut terhapus. Kalau `tsc` mengeluh tentang variabel tak terpakai, itu sisa yang belum dibersihkan dari Step 4 — bereskan, jangan dibungkam.

- [ ] **Step 10: Pemeriksaan visual**

Run: `npm run dev`

Yang harus benar:
- Tidak ada garis ungu yang mengikuti kursor (Ribbons hilang)
- Tidak ada robot 3D di Hero
- Tidak ada lagi section Certifications, dan menu tinggal empat item
- **Tombol dan link bisa diklik** — ini pembuktian utama task ini. Coba tombol "View my work", "Live demo" di kartu project, dan tombol chat mengambang.

- [ ] **Step 11: Commit**

```bash
git add -A portfolio_frontend/
git commit -m "Buang efek WebGL berat, section Certifications, dan pointer-events global"
```

---

### Task 3: Ganti StaggeredMenu dengan PillNav

Perubahan visual pertama yang benar-benar kelihatan. Logo memakai `MetallicPaint` — komponen ReactBits yang sudah dipakai StaggeredMenu — dengan warna shader disetel persis ke palet.

**Files:**
- Create: `portfolio_frontend/src/components/PillNav.tsx`
- Delete: `portfolio_frontend/src/components/StaggeredMenu.tsx`
- Modify: `portfolio_frontend/src/components/MetallicPaint.tsx:306-307`
- Modify: `portfolio_frontend/src/App.tsx`

**Interfaces:**
- Consumes: `MetallicPaint` dari `./MetallicPaint`, dengan tanda tangan `({ imageData }: { imageData: ImageData; params?: ShaderParams })` yang me-render `<canvas className="block w-full h-full object-contain" />`. State `logoImageData: ImageData | null` dan `useEffect` pemuat logo yang sudah ada di `App.tsx` **dipertahankan apa adanya** — hanya konsumennya yang berganti.
- Produces: `PillNav` dengan props `{ logo: React.ReactNode; logoAlt?: string; items: PillNavItem[]; activeHref?: string; className?: string; ease?: string; baseColor?: string; pillColor?: string; hoveredPillTextColor?: string; pillTextColor?: string; onMobileMenuClick?: () => void; initialLoadAnimation?: boolean }`, di mana `PillNavItem = { label: string; href: string; ariaLabel?: string }`.

- [ ] **Step 1: Setel warna shader MetallicPaint ke palet**

Di `src/components/MetallicPaint.tsx`, di dalam string `liquidFragSource`, ganti dua baris ini:

```glsl
    vec3 color1 = vec3(.98, 0.98, 1.);
    vec3 color2 = vec3(.1, .1, .1 + .1 * smoothstep(.7, 1.3, uv.x + uv.y));
```

menjadi:

```glsl
    vec3 color1 = vec3(.9804, .9686, .9608);
    vec3 color2 = vec3(0., 0., 0.);
```

`color1` adalah `#FAF7F5` dalam skala 0-1 (250/255, 247/255, 245/255); `color2` menjadi hitam murni. Nilai lama punya semburat biru di channel B dan hitam yang tidak benar-benar hitam — keduanya di luar palet.

- [ ] **Step 2: Buat `src/components/PillNav.tsx`**

Salin source berikut secara utuh. Ini source ReactBits dengan dua penyesuaian yang sudah diterapkan: `react-router-dom` dibuang seluruhnya (semua menu memakai anchor hash, jadi cabang `Link` tidak pernah tereksekusi), dan prop `logo` menerima `React.ReactNode` alih-alih URL string sehingga bisa diisi `<canvas>` milik MetallicPaint.

```tsx
import { gsap } from "gsap";
import React, { useEffect, useRef, useState } from "react";

export type PillNavItem = {
  label: string;
  href: string;
  ariaLabel?: string;
};

export interface PillNavProps {
  logo: React.ReactNode;
  logoAlt?: string;
  items: PillNavItem[];
  activeHref?: string;
  className?: string;
  ease?: string;
  baseColor?: string;
  pillColor?: string;
  hoveredPillTextColor?: string;
  pillTextColor?: string;
  onMobileMenuClick?: () => void;
  initialLoadAnimation?: boolean;
}

const PillNav: React.FC<PillNavProps> = ({
  logo,
  logoAlt = "Logo",
  items,
  activeHref,
  className = "",
  ease = "power3.easeOut",
  baseColor = "#000000",
  pillColor = "#faf7f5",
  hoveredPillTextColor = "#faf7f5",
  pillTextColor,
  onMobileMenuClick,
  initialLoadAnimation = true,
}) => {
  const resolvedPillTextColor = pillTextColor ?? baseColor;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const circleRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const tlRefs = useRef<Array<gsap.core.Timeline | null>>([]);
  const activeTweenRefs = useRef<Array<gsap.core.Tween | null>>([]);
  const logoInnerRef = useRef<HTMLSpanElement | null>(null);
  const logoTweenRef = useRef<gsap.core.Tween | null>(null);
  const hamburgerRef = useRef<HTMLButtonElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const navItemsRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach((circle) => {
        if (!circle?.parentElement) return;

        const pill = circle.parentElement as HTMLElement;
        const rect = pill.getBoundingClientRect();
        const { width: w, height: h } = rect;
        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta =
          Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;

        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;

        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`,
        });

        const label = pill.querySelector<HTMLElement>(".pill-label");
        const white = pill.querySelector<HTMLElement>(".pill-label-hover");

        if (label) gsap.set(label, { y: 0 });
        if (white) gsap.set(white, { y: h + 12, opacity: 0 });

        const index = circleRefs.current.indexOf(circle);
        if (index === -1) return;

        tlRefs.current[index]?.kill();
        const tl = gsap.timeline({ paused: true });

        tl.to(
          circle,
          { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: "auto" },
          0
        );

        if (label) {
          tl.to(
            label,
            { y: -(h + 8), duration: 2, ease, overwrite: "auto" },
            0
          );
        }

        if (white) {
          gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 });
          tl.to(
            white,
            { y: 0, opacity: 1, duration: 2, ease, overwrite: "auto" },
            0
          );
        }

        tlRefs.current[index] = tl;
      });
    };

    layout();

    const onResize = () => layout();
    window.addEventListener("resize", onResize);

    if (document.fonts) {
      document.fonts.ready.then(layout).catch(() => {});
    }

    const menu = mobileMenuRef.current;
    if (menu) {
      gsap.set(menu, { visibility: "hidden", opacity: 0, scaleY: 1, y: 0 });
    }

    if (initialLoadAnimation) {
      const logoEl = logoRef.current;
      const navItems = navItemsRef.current;

      if (logoEl) {
        gsap.set(logoEl, { scale: 0 });
        gsap.to(logoEl, { scale: 1, duration: 0.6, ease });
      }

      if (navItems) {
        gsap.set(navItems, { width: 0, overflow: "hidden" });
        gsap.to(navItems, { width: "auto", duration: 0.6, ease });
      }
    }

    return () => window.removeEventListener("resize", onResize);
  }, [items, ease, initialLoadAnimation]);

  const handleEnter = (i: number) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), {
      duration: 0.3,
      ease,
      overwrite: "auto",
    });
  };

  const handleLeave = (i: number) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(0, {
      duration: 0.2,
      ease,
      overwrite: "auto",
    });
  };

  const handleLogoEnter = () => {
    const inner = logoInnerRef.current;
    if (!inner) return;
    logoTweenRef.current?.kill();
    gsap.set(inner, { rotate: 0 });
    logoTweenRef.current = gsap.to(inner, {
      rotate: 360,
      duration: 0.6,
      ease,
      overwrite: "auto",
    });
  };

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);

    const hamburger = hamburgerRef.current;
    const menu = mobileMenuRef.current;

    if (hamburger) {
      const lines = hamburger.querySelectorAll(".hamburger-line");
      if (newState) {
        gsap.to(lines[0], { rotation: 45, y: 3, duration: 0.3, ease });
        gsap.to(lines[1], { rotation: -45, y: -3, duration: 0.3, ease });
      } else {
        gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3, ease });
        gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.3, ease });
      }
    }

    if (menu) {
      if (newState) {
        gsap.set(menu, { visibility: "visible" });
        gsap.fromTo(
          menu,
          { opacity: 0, y: 10, scaleY: 1 },
          {
            opacity: 1,
            y: 0,
            scaleY: 1,
            duration: 0.3,
            ease,
            transformOrigin: "top center",
          }
        );
      } else {
        gsap.to(menu, {
          opacity: 0,
          y: 10,
          scaleY: 1,
          duration: 0.2,
          ease,
          transformOrigin: "top center",
          onComplete: () => {
            gsap.set(menu, { visibility: "hidden" });
          },
        });
      }
    }

    onMobileMenuClick?.();
  };

  const cssVars = {
    ["--base"]: baseColor,
    ["--pill-bg"]: pillColor,
    ["--hover-text"]: hoveredPillTextColor,
    ["--pill-text"]: resolvedPillTextColor,
    ["--nav-h"]: "42px",
    ["--pill-pad-x"]: "18px",
    ["--pill-gap"]: "3px",
  } as React.CSSProperties;

  return (
    <div className="fixed top-[1em] z-1000 w-full left-0 md:left-1/2 md:w-max md:-translate-x-1/2">
      <nav
        className={`w-full md:w-max flex items-center justify-between md:justify-start box-border px-4 md:px-0 ${className}`}
        aria-label="Primary"
        style={cssVars}
      >
        <a
          href={items?.[0]?.href || "#"}
          aria-label={logoAlt}
          onMouseEnter={handleLogoEnter}
          ref={logoRef}
          className="rounded-full p-2 inline-flex items-center justify-center overflow-hidden shrink-0"
          style={{
            width: "var(--nav-h)",
            height: "var(--nav-h)",
            background: "var(--base)",
          }}
        >
          <span
            ref={logoInnerRef}
            className="block w-full h-full"
            style={{ willChange: "transform" }}
          >
            {logo}
          </span>
        </a>

        <div
          ref={navItemsRef}
          className="relative items-center rounded-full hidden md:flex ml-2"
          style={{ height: "var(--nav-h)", background: "var(--base)" }}
        >
          <ul
            role="menubar"
            className="list-none flex items-stretch m-0 p-[3px] h-full"
            style={{ gap: "var(--pill-gap)" }}
          >
            {items.map((item, i) => {
              const isActive = activeHref === item.href;

              return (
                <li key={item.href} role="none" className="flex h-full">
                  <a
                    role="menuitem"
                    href={item.href}
                    className="relative overflow-hidden inline-flex items-center justify-center h-full no-underline rounded-full box-border font-semibold text-[16px] leading-[0] uppercase tracking-[0.2px] whitespace-nowrap cursor-pointer px-0"
                    style={{
                      background: "var(--pill-bg)",
                      color: "var(--pill-text)",
                      paddingLeft: "var(--pill-pad-x)",
                      paddingRight: "var(--pill-pad-x)",
                    }}
                    aria-label={item.ariaLabel || item.label}
                    onMouseEnter={() => handleEnter(i)}
                    onMouseLeave={() => handleLeave(i)}
                  >
                    <span
                      className="hover-circle absolute left-1/2 bottom-0 rounded-full z-1 block pointer-events-none"
                      style={{
                        background: "var(--base)",
                        willChange: "transform",
                      }}
                      aria-hidden="true"
                      ref={(el) => {
                        circleRefs.current[i] = el;
                      }}
                    />
                    <span className="label-stack relative inline-block leading-[1] z-2">
                      <span
                        className="pill-label relative z-2 inline-block leading-[1]"
                        style={{ willChange: "transform" }}
                      >
                        {item.label}
                      </span>
                      <span
                        className="pill-label-hover absolute left-0 top-0 z-3 inline-block"
                        style={{
                          color: "var(--hover-text)",
                          willChange: "transform, opacity",
                        }}
                        aria-hidden="true"
                      >
                        {item.label}
                      </span>
                    </span>
                    {isActive && (
                      <span
                        className="absolute left-1/2 -bottom-[6px] -translate-x-1/2 w-3 h-3 rounded-full z-4"
                        style={{ background: "var(--base)" }}
                        aria-hidden="true"
                      />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        <button
          ref={hamburgerRef}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
          className="md:hidden rounded-full border-0 flex flex-col items-center justify-center gap-1 cursor-pointer p-0 relative"
          style={{
            width: "var(--nav-h)",
            height: "var(--nav-h)",
            background: "var(--base)",
          }}
        >
          <span
            className="hamburger-line w-4 h-0.5 rounded origin-center"
            style={{ background: "var(--pill-bg)" }}
          />
          <span
            className="hamburger-line w-4 h-0.5 rounded origin-center"
            style={{ background: "var(--pill-bg)" }}
          />
        </button>
      </nav>

      <div
        ref={mobileMenuRef}
        className="md:hidden absolute top-[3em] left-4 right-4 rounded-[27px] z-998 origin-top"
        style={{ ...cssVars, background: "var(--base)" }}
      >
        <ul className="list-none m-0 p-[3px] flex flex-col gap-[3px]">
          {items.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="block py-3 px-4 text-[16px] font-medium rounded-[50px] transition-colors duration-200"
                style={{
                  background: "var(--pill-bg)",
                  color: "var(--pill-text)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--base)";
                  e.currentTarget.style.color = "var(--hover-text)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--pill-bg)";
                  e.currentTarget.style.color = "var(--pill-text)";
                }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PillNav;
```

Perbedaan lain dari source aslinya, semuanya disengaja: `shadow-[0_8px_32px_rgba(0,0,0,0.12)]` pada menu mobile dibuang karena bayangan abu-abu berada di luar palet dua warna; `transition-all duration-[10ms]` pada garis hamburger dibuang karena GSAP yang menganimasikannya, bukan CSS; posisi luar diubah dari `absolute` menjadi `fixed` dan dipusatkan, karena ini situs one-page yang di-scroll.

- [ ] **Step 3: Pasang PillNav di `App.tsx`**

Hapus baris import `StaggeredMenu`. `App.tsx` sudah punya baris
`import { parseLogoImage } from "./components/MetallicPaint";` — **gabungkan**
default export ke baris yang sama, jangan tambahkan import kedua dari modul yang
sama:

```tsx
import MetallicPaint, { parseLogoImage } from "./components/MetallicPaint";
import PillNav from "./components/PillNav";
```

Ganti array `menuItems` (yang memakai key `link`) dengan bentuk yang dipakai PillNav (key `href`):

```tsx
const menuItems = [
  { label: "Home", href: "#home", ariaLabel: "Ke bagian atas" },
  { label: "About", href: "#about", ariaLabel: "Tentang saya" },
  { label: "Projects", href: "#projects", ariaLabel: "Project saya" },
  { label: "Contact", href: "#contact", ariaLabel: "Hubungi saya" },
];
```

Hapus array `socialItems` — hanya StaggeredMenu yang memakainya, dan isinya placeholder (`https://instagram.com`, `https://twitter.com`). Link sosial yang asli sudah ada di section Contact. `noUnusedLocals` akan menggagalkan build kalau array ini tertinggal.

Ganti seluruh blok `{/* MENU */}` (div pembungkus + `<StaggeredMenu ... />`) dengan:

```tsx
{/* MENU */}
<PillNav
  logo={
    logoImageData ? (
      <MetallicPaint imageData={logoImageData} />
    ) : (
      <img
        src={logo}
        alt=""
        className="block w-full h-full object-contain"
      />
    )
  }
  logoAlt="Ahmad Tazusyarofi"
  items={menuItems}
  baseColor="#000000"
  pillColor="#faf7f5"
  pillTextColor="#000000"
  hoveredPillTextColor="#faf7f5"
/>
```

Fallback `<img>` itu penting: `logoImageData` bernilai `null` sampai `parseLogoImage` selesai, dan `MetallicPaint` menuntut `imageData` bertipe `ImageData` (bukan nullable). Tanpa fallback, logo akan berupa lingkaran hitam kosong selama pemuatan.

- [ ] **Step 4: Tambahkan `id="home"` di Hero**

Pada elemen `<main>` pembungkus Hero di `App.tsx`, tambahkan `id="home"`. Saat ini link `#home` di menu menunjuk ke elemen yang tidak ada, jadi kliknya tidak melakukan apa-apa.

- [ ] **Step 5: Hapus StaggeredMenu**

```bash
rm src/components/StaggeredMenu.tsx
```

Verifikasi: `grep -rn "StaggeredMenu" src/`
Expected: tidak ada hasil.

- [ ] **Step 6: Jalankan build dan lint**

Run: `npm run build && npm run lint`
Expected: build lolos; jumlah error lint tidak naik dari baseline task sebelumnya.

- [ ] **Step 7: Pemeriksaan visual**

Run: `npm run dev`

Yang harus benar di desktop:
- Bar nav hitam mengambang di tengah atas, tetap terlihat saat di-scroll
- Empat pill krem: HOME, ABOUT, PROJECTS, CONTACT
- Hover pada satu pill: lingkaran hitam naik dari bawah, teks lama naik keluar dan teks krem masuk menggantikan
- Logo bulat hitam di kiri, isinya efek cairan logam yang bergerak dalam krem dan hitam — **tanpa semburat biru**
- Hover pada logo: berputar penuh satu kali
- Klik tiap pill benar-benar melompat ke section-nya, termasuk HOME

Yang harus benar di mobile (≤640px):
- Pill tersembunyi, tombol hamburger muncul di kanan
- Klik hamburger: dua garis berubah jadi X, panel menu turun
- Klik satu item: menu tertutup dan halaman melompat ke section

- [ ] **Step 8: Commit**

```bash
git add -A portfolio_frontend/
git commit -m "Ganti StaggeredMenu dengan PillNav berlogo MetallicPaint"
```

---

### Task 4: Ekstrak dan restyle Hero

Task pertama yang memecah `App.tsx`. Hero kehilangan robot Spline di Task 2, jadi kolom kirinya sekarang berdiri sendiri dan tata letaknya perlu diatur ulang.

**Files:**
- Create: `portfolio_frontend/src/sections/Hero.tsx`
- Modify: `portfolio_frontend/src/App.tsx`

**Interfaces:**
- Consumes: `SplitText` dari `@/components/SplitText`, `RotatingText` dari `@/components/RotatingText`.
- Produces: `export default function Hero()` — tanpa props. State `phraseIndex` yang tadinya di `App.tsx` pindah ke dalam Hero karena hanya `RotatingText` di Hero yang memakainya.

- [ ] **Step 1: Buat `src/sections/Hero.tsx`**

```tsx
import { motion } from "motion/react";
import { useState } from "react";

import RotatingText from "@/components/RotatingText";
import SplitText from "@/components/SplitText";

const PHRASES = [
  { prefix: "I'm", word: "Ahmad Tazusyarofi" },
  { prefix: "I'm", word: "a Web Developer" },
];

export default function Hero() {
  const [phraseIndex, setPhraseIndex] = useState(0);

  return (
    <main
      id="home"
      className="relative flex min-h-screen items-center justify-center px-6"
    >
      <motion.section
        className="w-full max-w-4xl text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        <SplitText
          text="Hey, there"
          tag="h1"
          className="font-display text-5xl md:text-7xl lg:text-8xl text-secondary"
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="-100px"
          textAlign="center"
        />

        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <span className="font-display text-4xl md:text-6xl lg:text-7xl text-secondary">
            {PHRASES[phraseIndex].prefix}
          </span>

          <RotatingText
            texts={PHRASES.map((p) => p.word)}
            onNext={(index) => setPhraseIndex(index)}
            mainClassName="font-display bg-secondary text-background overflow-hidden rounded-lg px-3 py-1 md:py-2 justify-center text-3xl md:text-5xl lg:text-6xl"
            staggerFrom="last"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-120%" }}
            staggerDuration={0.025}
            splitLevelClassName="overflow-hidden pb-1"
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            rotationInterval={3000}
          />
        </div>

        <p className="mx-auto mt-8 max-w-xl text-base md:text-lg text-secondary">
          I&rsquo;m a web developer who loves building smooth, interactive, and
          visually clean interfaces for the web.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <a
            href="#projects"
            className="inline-flex items-center justify-center rounded-full bg-secondary px-6 py-3 text-sm font-semibold uppercase tracking-wide text-background transition-transform duration-200 hover:-translate-y-0.5"
          >
            View my work
          </a>

          <a
            href="#contact"
            className="inline-flex items-center justify-center rounded-full border border-secondary px-6 py-3 text-sm font-semibold uppercase tracking-wide text-secondary transition-colors duration-200 hover:bg-secondary hover:text-background"
          >
            Contact me
          </a>
        </div>
      </motion.section>
    </main>
  );
}
```

Keputusan tata letak: Hero yang tadinya dua kolom (teks kiri, robot kanan) menjadi satu kolom terpusat, karena kolom kanan sudah kosong sejak robot Spline dibuang. Heading dinaikkan ukurannya (`text-8xl` di layar besar) supaya tetap mengisi ruang — dengan palet dua warna, skala tipografi yang memikul bobot visual.

Perhatikan: `font-display` tidak dipasangkan dengan `font-bold` di mana pun. Archivo Black sudah berat dengan sendirinya.

- [ ] **Step 2: Pakai Hero di `App.tsx`**

Tambahkan import:

```tsx
import Hero from "./sections/Hero";
```

Hapus seluruh blok `<main>` Hero yang lama dari `App.tsx` dan ganti dengan `<Hero />`.

Hapus juga dari `App.tsx`: konstanta `phrases`, state `phraseIndex`, dan fungsi `handleAnimationComplete` bila tidak lagi ada pemakainya. Bersihkan import `SplitText` dan `RotatingText` yang jadi menggantung.

- [ ] **Step 3: Restyle penanda "Scroll to explore"**

Blok di bawah Hero masih memakai `text-slate-400` dan `bg-slate-500/60`. Ganti dengan:

```tsx
<div className="relative flex justify-center pb-10 text-xs uppercase tracking-[0.3em] text-secondary pointer-events-none">
  <span className="flex items-center gap-3">
    <span className="inline-block h-px w-8 bg-secondary" />
    Scroll to explore
    <span className="inline-block h-px w-8 bg-secondary" />
  </span>
</div>
```

Catat juga: class `-mt-15` dan `h-1px` yang lama diganti — `h-1px` bukan utility Tailwind yang valid (yang benar `h-px`), jadi garis itu selama ini tidak pernah punya tinggi.

- [ ] **Step 4: Ganti background pembungkus utama**

Pada div terluar di `App.tsx`, ganti `bg-slate-900` menjadi `bg-background`:

```tsx
<div className="relative min-h-screen bg-background overflow-x-hidden">
```

- [ ] **Step 5: Jalankan build dan lint**

Run: `npm run build && npm run lint`
Expected: build lolos; jumlah error lint tidak naik dari baseline task sebelumnya.

- [ ] **Step 6: Pemeriksaan visual**

Run: `npm run dev`

Yang harus benar:
- Hero satu kolom terpusat di atas latar krem, teks hitam
- "Hey, there" beranimasi per huruf saat muat
- Kotak RotatingText berlatar hitam dengan teks krem, berganti tiap 3 detik
- Tombol "View my work" hitam solid; "Contact me" bergaris, dan membalik jadi hitam saat hover
- Garis "Scroll to explore" benar-benar terlihat di kiri-kanan teks
- Di mobile: heading tidak terpotong dan tombol tidak meluber

- [ ] **Step 7: Commit**

```bash
git add -A portfolio_frontend/
git commit -m "Ekstrak dan restyle section Hero"
```

---

### Task 5: Ekstrak dan restyle About

**Files:**
- Create: `portfolio_frontend/src/sections/About.tsx`
- Modify: `portfolio_frontend/src/App.tsx`

**Interfaces:**
- Consumes: `BlurText`, `DecryptedText`, `LogoLoop`, `Lanyard` dari `@/components/*`; `icons` dari `@/lib/utils-icon`.
- Produces: `export default function About()` — tanpa props. Array `iconsLogo` yang tadinya di `App.tsx` pindah ke dalam About.

- [ ] **Step 1: Buat `src/sections/About.tsx`**

```tsx
import { motion } from "motion/react";

import BlurText from "@/components/BlurText";
import DecryptedText from "@/components/DecryptedText";
import Lanyard from "@/components/Lanyard";
import LogoLoop from "@/components/LogoLoop";
import { icons } from "@/lib/utils-icon";

const TECH_LOGOS = [
  { src: icons.html, alt: "HTML" },
  { src: icons.css, alt: "CSS" },
  { src: icons.js, alt: "JavaScript" },
  { src: icons.bootstrap, alt: "Bootstrap" },
  { src: icons.tailwind, alt: "TailwindCSS" },
  { src: icons.react, alt: "React" },
  { src: icons.vue, alt: "Vue" },
  { src: icons.laravel, alt: "Laravel" },
  { src: icons.ci, alt: "CodeIgniter" },
];

const BIO =
  "Hello! My name is Ahmad Tazusyarofi — a creative web developer from Indonesia with a passion for building smooth, interactive, and meaningful digital experiences. I enjoy turning ideas into functional interfaces with clean design and subtle animations. My goal is to craft websites that are visually appealing, intuitive to use, and built with care.";

export default function About() {
  return (
    <motion.section
      id="about"
      className="relative border-t border-secondary px-6 py-20 md:px-10 md:py-28"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.25 }}
    >
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-start">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <h2 className="font-display text-secondary leading-tight">
            <BlurText
              text="About Me!"
              delay={100}
              animateBy="words"
              direction="top"
              className="text-5xl md:text-7xl lg:text-8xl mb-6"
            />
          </h2>

          <p className="text-base md:text-xl leading-relaxed text-secondary min-h-[200px] md:min-h-[180px]">
            <DecryptedText
              text={BIO}
              speed={50}
              maxIterations={15}
              animateOn="view"
              revealDirection="start"
              sequential={true}
              className="text-secondary"
              encryptedClassName="text-secondary opacity-30"
            />
          </p>

          <div className="mt-10 w-full">
            <h3 className="text-xs md:text-sm font-semibold uppercase tracking-[0.45em] text-secondary">
              My Skills
            </h3>

            <div className="mt-5 border-y border-secondary py-5">
              <LogoLoop
                logos={TECH_LOGOS}
                speed={50}
                direction="left"
                logoHeight={48}
                gap={40}
                pauseOnHover
                scaleOnHover
                fadeOut={false}
                ariaLabel="Tech Stack"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <div className="h-[420px] w-full max-w-sm sm:h-[520px] lg:h-[680px] lg:max-w-full">
            <Lanyard position={[0, 0, 13]} gravity={[0, -40, 0]} />
          </div>
        </div>
      </div>
    </motion.section>
  );
}
```

Perubahan dari versi lama: shape latar `#d9d8db` dengan `rounded-tl-[150px]` dan bayangan dihapus seluruhnya — warna itu di luar palet, dan pemisah antar-section sekarang berupa `border-t border-secondary` yang tegas. `encryptedClassName` memakai `opacity-30` alih-alih `text-slate-400`: ini opacity pada elemen, bukan warna baru, jadi tetap dalam disiplin dua warna.

- [ ] **Step 2: Pakai About di `App.tsx`**

Tambahkan `import About from "./sections/About";`, hapus seluruh blok `<motion.section id="about">` yang lama, ganti dengan `<About />`. Hapus array `iconsLogo` dari `App.tsx` dan bersihkan import `BlurText`, `DecryptedText`, `Lanyard`, `LogoLoop`, dan `icons` yang jadi menggantung.

- [ ] **Step 3: Restyle marquee ScrollVelocity**

Blok marquee di antara About dan Projects masih memakai `text-white/30`. Ganti pembungkusnya menjadi:

```tsx
<div className="relative border-y border-secondary py-4 text-secondary pointer-events-none">
  <ScrollVelocity
    texts={["Creative Developer - ", "Scroll Down - "]}
    velocity={60}
    damping={60}
    stiffness={350}
    className="text-outline font-display"
  />
</div>
```

Class `.text-outline` di `App.css` memakai `-webkit-text-stroke-color: currentColor`, jadi teksnya otomatis jadi outline hitam berongga di atas krem. Tidak perlu mengubah CSS-nya.

- [ ] **Step 4: Jalankan build dan lint**

Run: `npm run build && npm run lint`
Expected: build lolos; jumlah error lint tidak naik dari baseline task sebelumnya.

- [ ] **Step 5: Pemeriksaan visual**

Run: `npm run dev`

Yang harus benar:
- Latar About krem menyatu dengan Hero, dipisah garis hitam tipis
- "About Me!" beranimasi blur per kata saat masuk viewport
- Paragraf bio ter-dekripsi huruf per huruf
- Kartu Lanyard 3D tergantung dan bisa ditarik dengan mouse
- Logo tech stack berjalan ke kiri, berhenti saat hover
- Marquee "Creative Developer" berupa huruf outline hitam berongga
- Di mobile: Lanyard tidak meluber keluar layar

Catatan tentang Lanyard: latar canvas-nya transparan, jadi seharusnya menyatu dengan krem. Kalau muncul kotak gelap di belakangnya, periksa `Lanyard.tsx` untuk `<color attach="background">` atau prop `gl={{ alpha: false }}` dan laporkan — itu perbaikan di luar cakupan langkah ini.

- [ ] **Step 6: Commit**

```bash
git add -A portfolio_frontend/
git commit -m "Ekstrak dan restyle section About"
```

---

### Task 6: Ekstrak dan restyle Projects beserta modal detailnya

Task terbesar. Kartu project gelap ber-glow ungu menjadi kartu bergaris hitam, dan modal detail dipindah ke filenya sendiri.

**Files:**
- Create: `portfolio_frontend/src/sections/Projects.tsx`
- Create: `portfolio_frontend/src/components/ProjectModal.tsx`
- Modify: `portfolio_frontend/src/App.tsx`

**Interfaces:**
- Consumes: `PROJECTS` dan tipe `ProjectItem` dari `@/lib/utils-project` (bentuk: `{ id, title, role, description, image, tech: string[], liveUrl?, codeUrl? }`); `Carousel`, `CarouselContent`, `CarouselItem` dari `@/components/ui/carousel`; `ScrollReveal` dari `@/components/ScrollReveal`.
- Produces:
  - `export default function Projects({ onSelectProject, onShowToast }: { onSelectProject: (project: ProjectItem) => void; onShowToast: (message: string) => void })`
  - `export default function ProjectModal({ project, onClose, onShowToast }: { project: ProjectItem; onClose: () => void; onShowToast: (message: string) => void })`

- [ ] **Step 1: Buat `src/components/ProjectModal.tsx`**

```tsx
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";

import type { ProjectItem } from "@/lib/utils-project";

const NO_DEMO_MESSAGE =
  "The live demo for this project is not available yet (coming soon).";

export default function ProjectModal({
  project,
  onClose,
  onShowToast,
}: {
  project: ProjectItem;
  onClose: () => void;
  onShowToast: (message: string) => void;
}) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const openLiveDemo = () => {
    if (!project.liveUrl || project.liveUrl === "#") {
      onShowToast(NO_DEMO_MESSAGE);
      return;
    }
    window.open(project.liveUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <motion.div
      className="fixed inset-0 z-1000 flex items-center justify-center bg-secondary/90 px-4"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <motion.div
        className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-secondary bg-background"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="flex h-64 items-center justify-center overflow-hidden border-b border-secondary md:h-80">
          <img
            src={project.image}
            alt={project.title}
            className="h-full w-full object-contain"
          />
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="absolute right-5 top-5 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-secondary bg-background text-secondary transition-colors hover:bg-secondary hover:text-background"
        >
          &times;
        </button>

        <div className="p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-secondary">
            {project.role}
          </p>
          <h2 className="font-display mt-2 text-2xl md:text-4xl text-secondary">
            {project.title}
          </h2>

          <div className="mt-6 grid gap-8 md:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
            <div>
              <p className="text-sm md:text-base leading-relaxed text-secondary">
                {project.description}
              </p>

              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-secondary">
                Tech Stack
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.tech.map((label) => (
                  <span
                    key={label}
                    className="inline-flex items-center rounded-full border border-secondary px-3 py-1 text-[11px] uppercase tracking-wide text-secondary"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div className="md:border-l md:border-secondary md:pl-8">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">
                Links
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.liveUrl !== undefined && (
                  <button
                    type="button"
                    onClick={openLiveDemo}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-secondary px-4 py-2 text-xs font-semibold uppercase tracking-wide text-background transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    <span>Live demo</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                )}

                {project.codeUrl && project.codeUrl !== "#" && (
                  <a
                    href={project.codeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-secondary px-4 py-2 text-xs font-semibold uppercase tracking-wide text-secondary transition-colors hover:bg-secondary hover:text-background"
                  >
                    <span>View code</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>

              <p className="mt-6 text-[11px] uppercase tracking-wide text-secondary opacity-60">
                Press ESC or click outside to dismiss.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
```

Dua perbaikan yang dibawa sekalian: versi lama menjanjikan "Press ESC to dismiss" di teksnya tapi tidak pernah memasang listener keyboard — sekarang benar-benar berfungsi. Dan modal jadi `overflow-y-auto` dengan `max-h-[90vh]`, karena versi lama bisa memotong isinya di layar pendek.

- [ ] **Step 2: Buat `src/sections/Projects.tsx`**

```tsx
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";

import ScrollReveal from "@/components/ScrollReveal";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { PROJECTS, type ProjectItem } from "@/lib/utils-project";

const NO_DEMO_MESSAGE =
  "The live demo for this project is not available yet (coming soon).";

export default function Projects({
  onSelectProject,
  onShowToast,
}: {
  onSelectProject: (project: ProjectItem) => void;
  onShowToast: (message: string) => void;
}) {
  return (
    <motion.section
      id="projects"
      className="relative px-6 py-20 md:px-10 md:py-28"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="mx-auto mb-14 max-w-4xl text-center">
        <ScrollReveal
          baseOpacity={0}
          enableBlur={true}
          baseRotation={5}
          blurStrength={10}
          containerClassName="space-y-4"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.45em] text-secondary">
            My Project
          </p>

          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl text-secondary">
            It&rsquo;s A Simple Work, But it&rsquo;s Honest
          </h2>

          <p className="text-sm md:text-lg text-secondary">
            Some of the web projects I&rsquo;ve built to learn, explore ideas,
            and turn small concepts into something people can use.
          </p>
        </ScrollReveal>
      </div>

      <div className="mx-auto max-w-6xl">
        <Carousel opts={{ align: "start", loop: true }} className="w-full">
          <CarouselContent className="-ml-4 md:-ml-6">
            {PROJECTS.map((project, index) => (
              <CarouselItem
                key={project.id}
                className="pl-4 md:basis-1/2 md:pl-6 xl:basis-1/3"
              >
                <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-secondary transition-transform duration-300 hover:-translate-y-2">
                  <div className="relative flex h-52 items-center justify-center overflow-hidden border-b border-secondary">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-full w-full object-contain grayscale transition duration-500 group-hover:grayscale-0"
                    />

                    <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-secondary px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-background">
                      {project.role}
                    </span>

                    <span className="absolute right-4 top-4 font-display text-xs text-secondary">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col gap-4 p-5 md:p-6">
                    <div>
                      <h3 className="font-display text-lg md:text-xl text-secondary">
                        {project.title}
                      </h3>
                      <p className="line-clamp-2-custom mt-2 text-sm leading-relaxed text-secondary opacity-70">
                        {project.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((label) => (
                        <span
                          key={label}
                          className="inline-flex items-center rounded-full border border-secondary px-2.5 py-1 text-[11px] uppercase tracking-wide text-secondary"
                        >
                          {label}
                        </span>
                      ))}
                    </div>

                    <div className="mt-auto flex flex-wrap gap-2 pt-2">
                      {project.liveUrl !== undefined && (
                        <button
                          type="button"
                          onClick={() => {
                            if (!project.liveUrl || project.liveUrl === "#") {
                              onShowToast(NO_DEMO_MESSAGE);
                              return;
                            }
                            window.open(
                              project.liveUrl,
                              "_blank",
                              "noopener,noreferrer"
                            );
                          }}
                          className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-background transition-transform duration-200 hover:-translate-y-0.5"
                        >
                          <span>Live demo</span>
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </button>
                      )}

                      {project.codeUrl && (
                        <button
                          type="button"
                          onClick={() => onSelectProject(project)}
                          className="inline-flex cursor-pointer items-center rounded-full border border-secondary px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-secondary transition-colors hover:bg-secondary hover:text-background"
                        >
                          Details Project
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </motion.section>
  );
}
```

Keputusan yang perlu diketahui: thumbnail diberi `grayscale` dan menjadi berwarna penuh saat hover. Screenshot project itu penuh warna, dan tanpa ini merekalah satu-satunya sumber warna di halaman — yang akan mematahkan disiplin dua warna. Hover memberi jalan untuk tetap melihat aslinya.

`e.stopPropagation()` pada tombol dibuang karena `<article>` pembungkusnya tidak lagi punya handler klik — versi lama memasang `cursor-pointer` di article padahal tidak ada `onClick` di sana.

- [ ] **Step 3: Pakai Projects dan ProjectModal di `App.tsx`**

Tambahkan import:

```tsx
import ProjectModal from "./components/ProjectModal";
import Projects from "./sections/Projects";
```

Hapus seluruh blok `<motion.section id="projects">` yang lama beserta `{selectedProject && (...)}` overlay yang lama. Ganti dengan:

```tsx
<Projects onSelectProject={setSelectedProject} onShowToast={showToast} />
```

dan, di dekat bagian bawah pohon JSX (bersebelahan dengan `<ChatWidget />`):

```tsx
{selectedProject && (
  <ProjectModal
    project={selectedProject}
    onClose={() => setSelectedProject(null)}
    onShowToast={showToast}
  />
)}
```

Hapus konstanta `projects` dari `App.tsx`. Bersihkan import `Carousel`, `CarouselContent`, `CarouselItem`, `ScrollReveal`, `ArrowUpRight`, dan `PROJECTS` yang jadi menggantung — pertahankan `type ProjectItem` karena masih dipakai state `selectedProject`.

- [ ] **Step 4: Jalankan build dan lint**

Run: `npm run build && npm run lint`
Expected: build lolos; jumlah error lint tidak naik dari baseline task sebelumnya.

- [ ] **Step 5: Pemeriksaan visual**

Run: `npm run dev`

Yang harus benar:
- Kartu project bergaris hitam 1px di atas krem, tanpa bayangan dan tanpa glow ungu
- Thumbnail abu-abu, jadi berwarna penuh saat kursor di atas kartunya
- Carousel bisa digeser dan berputar (loop)
- Klik "Details Project" membuka modal; klik di luar modal, tombol ×, **dan tombol ESC** semuanya menutupnya
- Klik "Live demo" pada project yang `liveUrl`-nya `"#"` (misalnya "Travel Ticket Booking Form") memunculkan toast, bukan membuka tab kosong
- Klik "Live demo" pada project yang punya URL asli membuka tab baru
- Di mobile: satu kartu per layar, modal bisa di-scroll

- [ ] **Step 6: Commit**

```bash
git add -A portfolio_frontend/
git commit -m "Ekstrak dan restyle section Projects beserta modal detail"
```

---

### Task 7: Ekstrak dan restyle Contact, ekstrak Toast, rampingkan App.tsx

Task penutup. Setelah ini `App.tsx` hanya merangkai section dan memegang state lintas-section.

**Files:**
- Create: `portfolio_frontend/src/sections/Contact.tsx`
- Create: `portfolio_frontend/src/components/Toast.tsx`
- Modify: `portfolio_frontend/src/App.tsx`

**Interfaces:**
- Consumes: ikon `Github`, `Instagram`, `Linkedin`, `Twitter`, `ArrowUpRight` dari `lucide-react`.
- Produces:
  - `export default function Contact()` — tanpa props
  - `export default function Toast({ message, isVisible, onClose }: { message: string; isVisible: boolean; onClose: () => void })`

- [ ] **Step 1: Buat `src/components/Toast.tsx`**

```tsx
import { motion } from "motion/react";

export default function Toast({
  message,
  isVisible,
  onClose,
}: {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="pointer-events-none fixed bottom-4 left-0 right-0 z-1000 px-4 sm:bottom-6"
    >
      <div className="pointer-events-auto mx-auto flex w-full max-w-lg items-start gap-3 rounded-2xl border border-secondary bg-background px-4 py-3">
        <div className="flex-1">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.25em] text-secondary">
            Info
          </p>
          <p className="text-sm text-secondary">{message}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="ml-2 cursor-pointer text-xs font-medium uppercase tracking-wide text-secondary hover:underline"
        >
          Close
        </button>
      </div>
    </motion.div>
  );
}
```

Titik hijau `bg-emerald-400` yang lama dibuang — warna di luar palet.

- [ ] **Step 2: Buat `src/sections/Contact.tsx`**

```tsx
import { ArrowUpRight, Github, Instagram, Linkedin, Twitter } from "lucide-react";
import { motion } from "motion/react";

const CONTACT_EMAIL = "tazusyaroffiahmad@gmail.com";

const SOCIALS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/ahmdrr_/",
    Icon: Instagram,
  },
  { label: "Twitter", href: "https://twitter.com", Icon: Twitter },
  {
    label: "GitHub",
    href: "https://github.com/AhmadTazusyarofi",
    Icon: Github,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/ahmad-tazusyarofi-92b1a0341/",
    Icon: Linkedin,
  },
];

export default function Contact() {
  const mailtoHref = `mailto:${CONTACT_EMAIL}?subject=Project%20Inquiry&body=Hi%20Ahmad%2C%0D%0A`;

  return (
    <motion.section
      id="contact"
      className="relative border-t border-secondary px-6 py-20 md:px-10 md:py-28"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.25 }}
    >
      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-secondary">
          Get in touch
        </p>

        <h2 className="font-display mt-4 text-3xl md:text-5xl lg:text-6xl text-secondary">
          Let&rsquo;s work on something cool together.
        </h2>

        <p className="mt-6 max-w-2xl text-sm md:text-lg text-secondary">
          I&rsquo;m a web developer focused on smooth, playful interfaces and
          clean user experiences. If you have an idea or a product in mind,
          I&rsquo;d love to help you turn it into something real on the web.
        </p>

        <dl className="mt-12 grid gap-8 border-t border-secondary pt-8 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary opacity-60">
              Availability
            </dt>
            <dd className="mt-2 text-sm text-secondary">
              Open for freelance &amp; collaboration projects.
            </dd>
          </div>

          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary opacity-60">
              Email
            </dt>
            <dd className="mt-2">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-sm text-secondary underline underline-offset-4"
              >
                {CONTACT_EMAIL}
              </a>
            </dd>
          </div>
        </dl>

        <div className="mt-12 flex flex-col gap-8 border-t border-secondary pt-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary opacity-60">
              Social
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {SOCIALS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-secondary px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-secondary transition-colors hover:bg-secondary hover:text-background"
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              href={mailtoHref}
              className="inline-flex items-center justify-center rounded-full bg-secondary px-6 py-3 text-sm font-semibold uppercase tracking-wide text-background transition-transform duration-200 hover:-translate-y-0.5"
            >
              Say hello
            </a>

            <a
              href="/CV/CV ATS - AHMAD TAZUSYAROFI.pdf"
              download="Ahmad-Tazusyarofi-CV.pdf"
              className="inline-flex items-center justify-center rounded-full border border-secondary px-5 py-3 text-sm font-semibold uppercase tracking-wide text-secondary transition-colors hover:bg-secondary hover:text-background"
            >
              Download CV
              <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
```

Tiga perubahan dari versi lama: kartu glassmorphism (`bg-slate-900/70 backdrop-blur-xl` + bayangan + glow ungu `blur-3xl`) menjadi blok terbuka yang dipisah garis; empat link sosial yang tadinya ditulis berulang jadi satu array yang di-`map`; dan `onClick` yang memanggil `e.preventDefault()` lalu menyetel `window.location.href` ke href yang sama dihapus — `href` mailto sudah bekerja sendiri, handler itu tidak melakukan apa pun selain menduplikasi perilaku default.

Emoji 👋 pada tombol "Say hello" dibuang: emoji dirender berwarna oleh sistem, di luar palet dua warna.

- [ ] **Step 3: Tulis ulang `src/App.tsx` sepenuhnya**

Ganti seluruh isi `src/App.tsx` dengan:

```tsx
import { useEffect, useRef, useState } from "react";
import "./App.css";

import ChatWidget from "./components/ChatWidget";
import LoadingScreen from "./components/LoadingScreen";
import MetallicPaint, { parseLogoImage } from "./components/MetallicPaint";
import PillNav from "./components/PillNav";
import ProjectModal from "./components/ProjectModal";
import ScrollVelocity from "./components/ScrollVelocity";
import Toast from "./components/Toast";
import About from "./sections/About";
import Contact from "./sections/Contact";
import Hero from "./sections/Hero";
import Projects from "./sections/Projects";

import logo from "@/assets/logo.svg?url";
import type { ProjectItem } from "./lib/utils-project";

const MENU_ITEMS = [
  { label: "Home", href: "#home", ariaLabel: "Ke bagian atas" },
  { label: "About", href: "#about", ariaLabel: "Tentang saya" },
  { label: "Projects", href: "#projects", ariaLabel: "Project saya" },
  { label: "Contact", href: "#contact", ariaLabel: "Hubungi saya" },
];

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [logoImageData, setLogoImageData] = useState<ImageData | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(
    null
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isToastVisible, setIsToastVisible] = useState(false);

  const logoCacheRef = useRef<ImageData | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadLogo() {
      if (logoCacheRef.current) {
        setLogoImageData(logoCacheRef.current);
        return;
      }

      try {
        const res = await fetch(logo);
        const blob = await res.blob();
        const file = new File([blob], "logo.svg", { type: blob.type });
        const { imageData } = await parseLogoImage(file);
        logoCacheRef.current = imageData;

        if (!cancelled) setLogoImageData(imageData);
      } catch (err) {
        console.error("Failed to load metallic logo:", err);
      }
    }

    loadLogo();
    return () => {
      cancelled = true;
    };
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setIsToastVisible(true);
    window.setTimeout(() => setIsToastVisible(false), 3000);
  };

  if (isLoading) {
    return <LoadingScreen finishLoading={() => setIsLoading(false)} />;
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      <PillNav
        logo={
          logoImageData ? (
            <MetallicPaint imageData={logoImageData} />
          ) : (
            <img src={logo} alt="" className="block h-full w-full object-contain" />
          )
        }
        logoAlt="Ahmad Tazusyarofi"
        items={MENU_ITEMS}
        baseColor="#000000"
        pillColor="#faf7f5"
        pillTextColor="#000000"
        hoveredPillTextColor="#faf7f5"
      />

      <Hero />

      <div className="relative flex justify-center pb-10 text-xs uppercase tracking-[0.3em] text-secondary pointer-events-none">
        <span className="flex items-center gap-3">
          <span className="inline-block h-px w-8 bg-secondary" />
          Scroll to explore
          <span className="inline-block h-px w-8 bg-secondary" />
        </span>
      </div>

      <About />

      <div className="relative border-y border-secondary py-4 text-secondary pointer-events-none">
        <ScrollVelocity
          texts={["Creative Developer - ", "Scroll Down - "]}
          velocity={60}
          damping={60}
          stiffness={350}
          className="text-outline font-display"
        />
      </div>

      <Projects onSelectProject={setSelectedProject} onShowToast={showToast} />

      <Contact />

      <ChatWidget />

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onShowToast={showToast}
        />
      )}

      {toastMessage && (
        <Toast
          message={toastMessage}
          isVisible={isToastVisible}
          onClose={() => setIsToastVisible(false)}
        />
      )}
    </div>
  );
}

export default App;
```

Perhatikan satu perbaikan halus: `const [isLoading, setIsLoading]` dipindah ke atas bersama state lain, dan `if (isLoading) return ...` ditaruh **setelah** semua hook. Versi lama mendeklarasikan `isLoading` di tengah komponen dengan early return tepat di bawahnya — susunan yang secara kebetulan masih sah, tapi setiap hook baru yang ditambahkan di bawahnya akan melanggar Rules of Hooks. Susunan baru menutup jebakan itu.

- [ ] **Step 4: Restyle ChatWidget dan LoadingScreen ke palet**

Kedua file ini belum pernah dibuka sepanjang plan, jadi kerjakan berurutan:
baca dulu, baru ubah.

Run: `grep -n "slate-\|#5227ff\|emerald\|bg-white\|text-white\|bg-black\|text-black\|rgba(" src/components/ChatWidget.tsx src/components/LoadingScreen.tsx`

Baca setiap baris yang muncul beserta konteksnya, lalu petakan tiap warna ke
token berdasarkan **peran elemennya**, bukan berdasarkan kemiripan warna:

| Peran elemen | Ganti dengan |
|---|---|
| Permukaan panel, latar bubble asisten, latar input | `bg-background` |
| Garis tepi panel, input, dan bubble | `border-secondary` |
| Teks isi, label, placeholder | `text-secondary` |
| Tombol kirim, tombol chat mengambang, bubble pesan **pengguna** | `bg-secondary` + `text-background` |
| Bayangan (`shadow-*`, `rgba(...)`) | dihapus — bayangan abu-abu di luar palet |

`LoadingScreen` menganimasikan stroke SVG; stroke dan fill logonya menjadi
`var(--secondary)` di atas latar `var(--background)`. Jangan ubah durasi timer
mana pun di file itu — pengaturan waktu loading berada di luar scope plan ini.

Setelahnya, verifikasi tidak ada warna lama yang tersisa **di seluruh `src/`**:

Run: `grep -rn "slate-\|#5227ff\|#d9d8db\|emerald-\|#B19EEF" src/`
Expected: tidak ada hasil. Kalau masih ada, bereskan sebelum lanjut.

- [ ] **Step 5: Jalankan build dan lint**

Run: `npm run build && npm run lint`
Expected: build lolos; jumlah error lint tidak naik dari baseline task sebelumnya.

- [ ] **Step 6: Konfirmasi App.tsx sudah ramping**

Run: `wc -l src/App.tsx`
Expected: di bawah 150 baris (dari 1003 baris semula).

- [ ] **Step 7: Pemeriksaan visual menyeluruh**

Run: `npm run dev`

Telusuri halaman dari atas ke bawah, di desktop dan mobile:
- Seluruh situs hanya memakai krem dan hitam — tidak ada abu-abu, ungu, atau hijau yang tersisa selain thumbnail project saat hover
- Keempat link nav melompat ke section yang benar
- Widget chat terbuka, bisa mengirim pesan, dan mengikuti palet
- Layar loading mengikuti palet
- Toast muncul saat "Live demo" ditekan pada project tanpa demo
- Modal project buka dan tutup lewat ketiga caranya
- Tidak ada scroll horizontal di lebar mana pun

- [ ] **Step 8: Commit**

```bash
git add -A portfolio_frontend/
git commit -m "Ekstrak Contact dan Toast, rampingkan App.tsx jadi perangkai section"
```

---

## Definition of Done

- [ ] `npm run build` lolos, dan jumlah error `npm run lint` tidak lebih tinggi dari baseline 44
- [ ] `grep -rn "slate-\|#5227ff\|#d9d8db\|emerald-" src/` tidak menghasilkan apa pun
- [ ] `grep -rn "pointerEvents" src/` tidak menghasilkan apa pun
- [ ] `src/App.tsx` di bawah 150 baris
- [ ] `src/sections/` berisi tepat empat file: `Hero.tsx`, `About.tsx`, `Projects.tsx`, `Contact.tsx`
- [ ] `package.json` tidak lagi memuat `ogl`, `@use-gesture/react`, `framer-motion`, `react-router-dom`
- [ ] Nav, modal, toast, carousel, dan chat widget semuanya berfungsi di desktop dan mobile
