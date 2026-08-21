import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const STATEMENT =
  "From first sketch to shipped product. Interfaces that stay clear under pressure, built to load fast, feel effortless, and hold up long after launch, shaped by careful structure and deliberate detail.";

export default function Statement() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    const words = el.querySelectorAll(".reveal-word");
    if (!words.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { opacity: 0.15 },
        {
          opacity: 1,
          stagger: 0.1,
          ease: "power1.out",
          // scrub mengikat progres animasi ke posisi scroll, jadi kata-katanya
          // ikut mundur kalau pengguna scroll ke atas lagi.
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "bottom 60%",
            scrub: 0.8,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex w-full items-center justify-center overflow-hidden py-28 md:py-40"
    >
      <div className="mx-auto flex max-w-7xl justify-center px-6 text-center md:px-12">
        <p
          ref={textRef}
          className="max-w-5xl select-none text-[28px] font-medium leading-[1.2] tracking-tight text-secondary sm:text-[40px] md:text-[52px] lg:text-[60px]"
        >
          {STATEMENT.split(" ").map((word, index) => (
            <span
              key={index}
              className="reveal-word mr-[0.24em] inline-block will-change-[opacity]"
              style={{ opacity: 0.15 }}
            >
              {word}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
