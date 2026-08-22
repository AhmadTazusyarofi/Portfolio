import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

/* Disimpan di level modul supaya perpindahan route bisa mereset posisi scroll
   lewat Lenis, bukan lewat window.scrollTo yang akan berebut dengannya. */
let lenisInstance: Lenis | null = null;

export function scrollToTop() {
  if (lenisInstance) {
    lenisInstance.scrollTo(0, { immediate: true });
  } else {
    window.scrollTo(0, 0);
  }
}

/**
 * Kunci scroll halaman selama overlay terbuka.
 *
 * Saat Lenis aktif, `stop()` adalah caranya — Lenis memasang class
 * `lenis-stopped` yang CSS-nya sudah menangani overflow. Menyetel
 * `body.overflow` secara manual justru akan berebut dengannya. Fallback
 * `overflow: hidden` hanya dipakai kalau Lenis tidak berjalan sama sekali
 * (mis. pengguna mengaktifkan prefers-reduced-motion).
 */
export function setScrollLocked(locked: boolean) {
  if (lenisInstance) {
    if (locked) lenisInstance.stop();
    else lenisInstance.start();
    return;
  }
  document.body.style.overflow = locked ? "hidden" : "";
}

/** Offset negatif memberi ruang untuk PillNav yang posisinya fixed di atas. */
export function scrollToHash(id: string) {
  const el = document.getElementById(id);
  if (!el) return;

  if (lenisInstance) {
    lenisInstance.scrollTo(el, { offset: -80 });
  } else {
    el.scrollIntoView({ behavior: "smooth" });
  }
}

/**
 * Smooth scroll berbasis Lenis.
 *
 * Sinkronisasi dengan ScrollTrigger di bawah ini bukan opsional: Lenis
 * memindahkan halaman lewat transform, bukan lewat scroll native, sehingga
 * ScrollTrigger tidak akan tahu posisi sebenarnya kalau tidak diberi tahu.
 * Tanpa ini, SplitText, ScrollReveal, StrokeText, dan section Statement akan
 * memicu animasinya di posisi yang salah — atau tidak sama sekali.
 */
export function useSmoothScroll() {
  useEffect(() => {
    // Hormati pengguna yang mematikan animasi di level sistem operasi.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Biar klik <a href="#about"> di PillNav ikut mulus, bukan melompat.
      anchors: true,
    });
    lenisInstance = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    // Satu rAF loop saja: Lenis dijalankan oleh ticker GSAP, bukan loop sendiri.
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);
}
