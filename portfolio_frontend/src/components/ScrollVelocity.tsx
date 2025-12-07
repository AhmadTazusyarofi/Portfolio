import React, { useRef, useLayoutEffect, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
} from "motion/react";

interface VelocityMapping {
  input: number[];
  output: number[];
}

interface VelocityTextProps {
  children: React.ReactNode;
  baseVelocity: number;
  scrollContainerRef?: React.RefObject<HTMLElement>;
  className?: string;
  damping?: number;
  stiffness?: number;
  numCopies?: number;
  velocityMapping?: VelocityMapping;
  parallaxClassName?: string;
  scrollerClassName?: string;
  parallaxStyle?: React.CSSProperties;
  scrollerStyle?: React.CSSProperties;
}

interface ScrollVelocityProps {
  scrollContainerRef?: React.RefObject<HTMLElement>;
  texts: string[];
  velocity?: number;
  className?: string;
  damping?: number;
  stiffness?: number;
  numCopies?: number;
  velocityMapping?: VelocityMapping;
  parallaxClassName?: string;
  scrollerClassName?: string;
  parallaxStyle?: React.CSSProperties;
  scrollerStyle?: React.CSSProperties;
}

function useElementWidth<T extends HTMLElement>(
  ref: React.RefObject<T | null>
): number {
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    function updateWidth() {
      if (ref.current) {
        setWidth(ref.current.offsetWidth);
      }
    }
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [ref]);

  return width;
}

function wrap(min: number, max: number, v: number): number {
  const range = max - min;
  const mod = (((v - min) % range) + range) % range;
  return mod + min;
}

/**
 * Satu baris teks yang berjalan, bereaksi terhadap scroll
 */
const VelocityText: React.FC<VelocityTextProps> = ({
  children,
  baseVelocity,
  scrollContainerRef,
  className = "",
  damping = 50,
  stiffness = 400,
  numCopies = 6,
  velocityMapping,
  parallaxClassName,
  scrollerClassName,
  parallaxStyle,
  scrollerStyle,
}) => {
  const baseX = useMotionValue(0);

  // sumber scroll
  const scrollOptions = scrollContainerRef
    ? { container: scrollContainerRef }
    : {};
  const { scrollY } = useScroll(scrollOptions);

  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping,
    stiffness,
  });

  // mapping ke faktor kecil, di-clamp supaya tidak meledak
  const velocityFactor = useTransform(
    smoothVelocity,
    velocityMapping?.input || [-1000, 0, 1000],
    velocityMapping?.output || [-4, 0, 4],
    { clamp: true }
  );

  const copyRef = useRef<HTMLSpanElement>(null);
  const copyWidth = useElementWidth(copyRef);

  const x = useTransform(baseX, (v) => {
    if (copyWidth === 0) return "0px";
    return `${wrap(-copyWidth, 0, v)}px`;
  });

  const directionFactor = useRef<number>(1);

  useAnimationFrame((_, delta) => {
    if (copyWidth === 0) return;

    // pergerakan dasar tanpa scroll
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    const vFactor = velocityFactor.get();

    // ubah arah jika scroll berlawanan
    if (vFactor < 0) {
      directionFactor.current = -1;
    } else if (vFactor > 0) {
      directionFactor.current = 1;
    }

    // tambahkan efek scroll, pakai |vFactor| supaya smooth
    moveBy += directionFactor.current * moveBy * Math.abs(vFactor);

    baseX.set(baseX.get() + moveBy);
  });

  const spans = [];
  for (let i = 0; i < numCopies; i++) {
    spans.push(
      <span
        className={`shrink-0 ${className}`}
        key={i}
        ref={i === 0 ? copyRef : null}
      >
        {children}
      </span>
    );
  }

  return (
    <div
      className={`${parallaxClassName ?? ""} relative overflow-hidden`}
      style={parallaxStyle}
    >
      <motion.div
        className={`${
          scrollerClassName ?? ""
        } flex whitespace-nowrap text-center font-sans text-4xl font-bold tracking-[-0.02em] md:text-[5rem] md:leading-5rem`}
        style={{ x, ...scrollerStyle }}
      >
        {spans}
      </motion.div>
    </div>
  );
};

export const ScrollVelocity: React.FC<ScrollVelocityProps> = ({
  scrollContainerRef,
  texts = [],
  velocity = 100,
  className = "",
  damping = 50,
  stiffness = 400,
  numCopies = 6,
  velocityMapping = { input: [-1000, 0, 1000], output: [-4, 0, 4] },
  parallaxClassName,
  scrollerClassName,
  parallaxStyle,
  scrollerStyle,
}) => {
  return (
    <section aria-hidden="true">
      {texts.map((text, index) => (
        <VelocityText
          key={index}
          className={className}
          baseVelocity={index % 2 !== 0 ? -velocity : velocity}
          scrollContainerRef={scrollContainerRef}
          damping={damping}
          stiffness={stiffness}
          numCopies={numCopies}
          velocityMapping={velocityMapping}
          parallaxClassName={parallaxClassName}
          scrollerClassName={scrollerClassName}
          parallaxStyle={parallaxStyle}
          scrollerStyle={scrollerStyle}
        >
          {text}&nbsp;
        </VelocityText>
      ))}
    </section>
  );
};

export default ScrollVelocity;
