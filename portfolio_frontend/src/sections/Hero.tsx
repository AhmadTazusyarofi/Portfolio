import { motion } from "motion/react";
import { useEffect, useState } from "react";

import StrokeText from "@/components/StrokeText";

/* StrokeText menggambar satu baris <text> SVG dan tidak bisa wrap sendiri,
   jadi versi dua baris berarti dua instance. Keduanya tidak boleh sekadar
   di-toggle pakai `hidden`, karena komponen ini mengukur lewat getBBox() yang
   mengembalikan nol pada elemen display:none dan tidak pernah mengukur ulang.
   matchMedia memastikan hanya varian yang dipakai yang ter-mount. */
function useIsSmallScreen() {
  const [isSmall, setIsSmall] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsSmall(mq.matches);

    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isSmall;
}

/* font-display = Archivo Black. Tanpa class ini <text> SVG mewarisi font-sans
   dari body, dan fontWeight 400 di sana berarti Archivo Regular — hurufnya
   jadi ramping. Archivo Black hanya punya satu weight, jadi ketebalan datang
   dari pemilihan family, bukan dari angka fontWeight. */
const STROKE_PROPS = {
  className: "font-display",
  strokeColor: "#000000",
  fillColor: "#000000",
  drawDuration: 1.6,
  fillDelay: 0.2,
  stagger: 0.05,
  ease: "power2.out",
  trigger: "mount" as const,
  fillMode: "wipe" as const,
  fontWeight: 400,
};

/* strokeWidth dan letterSpacing sama-sama bersatuan user SVG, jadi keduanya
   harus ikut skala fontSize. Rasio 1.4/128 dan -4/128 adalah proporsi asli
   dari contoh ReactBits. Nilai tetap -4 pada teks kecil membuat hurufnya
   saling tumpang tindih. */
const strokeFor = (fontSize: number) =>
  Number(((1.4 / 128) * fontSize).toFixed(2));

const trackingFor = (fontSize: number) =>
  Number(((-4 / 128) * fontSize).toFixed(2));

export default function Hero() {
  const isSmall = useIsSmallScreen();

  return (
    <main
      id="home"
      className="relative flex min-h-screen items-center justify-center px-6"
    >
      <motion.section
        className="w-full max-w-6xl text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        {isSmall ? (
          /* Dua baris dengan fontSize sama, jadi tinggi hurufnya seragam.
             Baris terlebar ("THERE!") yang menentukan lebar penuh. */
          <div className="flex flex-col items-stretch gap-1">
            <StrokeText
              {...STROKE_PROPS}
              text="HI"
              fontSize={72}
              strokeWidth={strokeFor(72)}
              letterSpacing={trackingFor(72)}
            />
            <StrokeText
              {...STROKE_PROPS}
              text="THERE!"
              fontSize={72}
              strokeWidth={strokeFor(72)}
              letterSpacing={trackingFor(72)}
            />
          </div>
        ) : (
          <StrokeText
            {...STROKE_PROPS}
            text="HI THERE!"
            fontSize={220}
            strokeWidth={strokeFor(220)}
            letterSpacing={trackingFor(220)}
          />
        )}

        <p className="mx-auto mt-8 max-w-xl text-base md:text-lg text-secondary">
          I&rsquo;m a web developer who loves building smooth, interactive, and
          visually clean interfaces for the web.
        </p>
      </motion.section>

      {/* Sejajar dengan tombol ChatWidget yang fixed di bottom-6 right-6.
          Dibuat absolute, bukan fixed, supaya ikut tergulir bersama hero
          alih-alih menempel di layar sepanjang halaman. */}
      <div className="pointer-events-none absolute bottom-6 left-6 w-[180px] sm:w-[260px] md:w-[300px]">
        <StrokeText
          {...STROKE_PROPS}
          text="2026 - WEB DEVELOPER"
          fontSize={40}
          strokeWidth={strokeFor(40)}
          letterSpacing={trackingFor(40)}
        />
      </div>
    </main>
  );
}
