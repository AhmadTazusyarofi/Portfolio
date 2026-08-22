import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import "lenis/dist/lenis.css";
import "./App.css";

import LoadingScreen from "./components/LoadingScreen";
import PillNav from "./components/PillNav";
import Home from "./pages/Home";

/* Halaman /work dan /work/:slug tidak dibutuhkan untuk memuat beranda, dan
   MetallicPaint (shader WebGL) baru dipakai setelah layar loading selesai. */
const MetallicPaint = lazy(() => import("./components/MetallicPaint"));
const ChatWidget = lazy(() => import("./components/ChatWidget"));
const AllProjects = lazy(() => import("./pages/AllProjects"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));

import logo from "@/assets/logo.svg?url";
import { useHashNav } from "./lib/useHashNav";
import {
  scrollToHash,
  scrollToTop,
  useSmoothScroll,
} from "./lib/useSmoothScroll";

/* Href diawali "/" supaya menu tetap berfungsi dari halaman /work dan
   /work/:slug — kalau hanya "#about", hash-nya cuma menempel di URL saat ini
   dan tidak membawa ke mana pun. */
const MENU_ITEMS = [
  { label: "About", href: "/#about", ariaLabel: "Tentang saya" },
  { label: "Projects", href: "/#projects", ariaLabel: "Project saya" },
  { label: "Contact", href: "/#contact", ariaLabel: "Hubungi saya" },
];

function App() {
  useSmoothScroll();

  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [logoImageData, setLogoImageData] = useState<ImageData | null>(null);

  const logoCacheRef = useRef<ImageData | null>(null);

  /* parseLogoImage menjalankan ~26 juta iterasi sinkron (100 iterasi di atas
     kanvas 512x512) untuk mengubah SVG jadi ImageData. Kalau dijalankan saat
     LoadingScreen tampil, ia mengunci main thread persis ketika animasi
     stroke-dashoffset butuh main thread di tiap frame. Jadi ditunda sampai
     layar loading selesai — sementara itu PillNav memakai <img> biasa. */
  useEffect(() => {
    if (isLoading) return;

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
        // Import dinamis, bukan statis: kalau parseLogoImage diimpor di
        // atas, seluruh modul MetallicPaint (berikut sumber shader-nya) ikut
        // masuk bundle utama dan lazy() pada komponennya jadi sia-sia.
        const { parseLogoImage } = await import("./components/MetallicPaint");
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
  }, [isLoading]);

  // Pindah route harus mulai dari atas. Lewat Lenis, bukan window.scrollTo,
  // supaya keduanya tidak berebut posisi. Kalau URL-nya membawa hash, halaman
  // tujuan perlu ter-render dulu sebelum elemennya bisa ditemukan.
  useEffect(() => {
    if (!location.hash) {
      scrollToTop();
      return;
    }

    const id = window.setTimeout(
      () => scrollToHash(location.hash.slice(1)),
      120,
    );
    return () => window.clearTimeout(id);
  }, [location.pathname, location.hash]);

  const handleNavClick = useHashNav();

  // Layar loading hanya untuk kunjungan pertama ke beranda. Menahan halaman
  // detail project selama 4,8 detik hanya untuk animasi sambutan tidak masuk akal.
  if (isLoading && location.pathname === "/") {
    return <LoadingScreen finishLoading={() => setIsLoading(false)} />;
  }

  return (
    <div className="relative min-h-screen overflow-x-clip bg-background">
      <PillNav
        logo={
          logoImageData ? (
            <Suspense fallback={null}>
              <MetallicPaint imageData={logoImageData} />
            </Suspense>
          ) : (
            <img
              src={logo}
              alt=""
              className="block h-full w-full object-contain"
            />
          )
        }
        logoAlt="Ahmad Tazusyarofi"
        logoHref="/"
        items={MENU_ITEMS}
        onItemClick={handleNavClick}
        baseColor="#000000"
        pillColor="#faf7f5"
        pillTextColor="#000000"
        hoveredPillTextColor="#faf7f5"
      />

      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work" element={<AllProjects />} />
          <Route path="/work/:slug" element={<ProjectDetail />} />
        </Routes>
      </Suspense>

      <Suspense fallback={null}>
        <ChatWidget />
      </Suspense>
    </div>
  );
}

export default App;
