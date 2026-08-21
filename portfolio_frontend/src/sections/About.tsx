import { motion } from "motion/react";
import { Suspense, lazy, useEffect, useRef, useState } from "react";

import BlurText from "@/components/BlurText";
import LogoLoop from "@/components/LogoLoop";
import SplitText from "@/components/SplitText";
import { icons } from "@/lib/utils-icon";

/* Lanyard menyeret three, @react-three/fiber, drei, rapier, dan meshline —
   bagian terbesar dari bundle. Di-lazy-load supaya halaman bisa tampil dulu,
   baru kanvas 3D-nya menyusul. */
const Lanyard = lazy(() => import("@/components/Lanyard"));

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
  "I'm Ahmad Tazusyarofi — a creative web developer from Indonesia with a passion for building smooth, interactive, and meaningful digital experiences. I enjoy turning ideas into functional interfaces with clean design and subtle animations. My goal is to craft websites that are visually appealing, intuitive to use, and built with care.";

export default function About() {
  const lanyardSlotRef = useRef<HTMLDivElement>(null);
  const [shouldLoadLanyard, setShouldLoadLanyard] = useState(false);

  /* React.lazy baru mengambil chunk-nya saat komponen benar-benar dirender.
     Karena About ada di beranda, tanpa gerbang ini chunk 3,2 MB itu tetap
     diunduh saat halaman dimuat. Observer menundanya sampai pengguna
     mendekati section — rootMargin memberi waktu unduh sebelum terlihat. */
  useEffect(() => {
    const el = lanyardSlotRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadLanyard(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.section
      id="about"
      className="relative px-6 py-20 md:px-10 md:py-28"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.25 }}
    >
      {/* items-start: HEY! dan bio rata atas, tidak ikut terdorong ke tengah
          mengikuti tinggi Lanyard */}
      {/* grid-cols-1 wajib eksplisit: tanpanya di bawah lg kontainer ini
          display:grid tanpa grid-template-columns, jatuh ke satu kolom
          implisit ber-sizing `auto`. min-w-0 di tiap anak mencegah grid item
          (yang default-nya min-width:auto = min-content) meluap ke samping
          alih-alih menyusut. */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)_minmax(0,1.3fr)] lg:items-start lg:gap-8">
        {/* KIRI: heading */}
        <h2 className="min-w-0 font-display leading-none text-secondary">
          <BlurText
            text="HEY!"
            delay={100}
            animateBy="words"
            direction="top"
            className="justify-center lg:justify-start text-6xl md:text-8xl lg:text-9xl"
          />
        </h2>

        {/* TENGAH: Lanyard — di mobile dipindah ke paling bawah */}
        <div className="order-last flex min-w-0 justify-center lg:order-0">
          <div
            ref={lanyardSlotRef}
            className="h-[420px] w-full max-w-sm sm:h-[520px] lg:h-[680px] lg:max-w-full"
          >
            {shouldLoadLanyard && (
              <Suspense fallback={null}>
                <Lanyard position={[0, 0, 13]} gravity={[0, -40, 0]} />
              </Suspense>
            )}
          </div>
        </div>

        {/* KANAN: bio + skills */}
        <div className="min-w-0">
          <SplitText
            text={BIO}
            tag="p"
            className="text-base md:text-lg leading-relaxed text-secondary"
            splitType="words"
            delay={20}
            duration={0.6}
            from={{ opacity: 0, y: 20 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-80px"
            textAlign="left"
          />

          <div className="mt-10">
            <h3 className="text-xs md:text-sm font-semibold uppercase tracking-[0.45em] text-secondary text-center lg:text-left">
              My Skills
            </h3>

            {/* Grayscale per-logo yang berwarna saat hover, sama seperti
                thumbnail di kartu project. Dipasang lewat arbitrary variant
                agar LogoLoop tidak perlu diubah: tiap <li> sudah jadi target
                hover-nya sendiri. transition-all dipakai supaya `filter` ikut
                beranimasi, dan specificity-nya menang atas transition-transform
                bawaan komponen. */}
            <div className="mt-5 border-y border-secondary py-5 [&_img]:grayscale [&_img]:transition-all [&_img]:duration-500 [&_li:hover_img]:grayscale-0">
              <LogoLoop
                logos={TECH_LOGOS}
                speed={50}
                direction="left"
                logoHeight={44}
                gap={36}
                pauseOnHover
                scaleOnHover
                fadeOut={false}
                ariaLabel="Tech Stack"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
