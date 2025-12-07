import React, { useEffect, useRef, useMemo } from "react";
import type { ReactNode, RefObject } from "react"; // ⬅️ type-only import
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: ReactNode;
  scrollContainerRef?: RefObject<HTMLElement>;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  containerClassName?: string;
  textClassName?: string;
  rotationEnd?: string;
  wordAnimationEnd?: string;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = "",
  textClassName = "",
  rotationEnd = "bottom bottom",
  wordAnimationEnd = "bottom bottom",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // apakah children string (mode per-kata) atau JSX (mode block)
  const isStringChild = useMemo(() => typeof children === "string", [children]);

  const splitText = useMemo(() => {
    if (!isStringChild) return children;

    const text = children as string;
    return text.split(/(\s+)/).map((word, index) => {
      if (word.match(/^\s+$/)) return word;
      return (
        <span className="inline-block word" key={index}>
          {word}
        </span>
      );
    });
  }, [children, isStringChild]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scroller =
      scrollContainerRef && scrollContainerRef.current
        ? scrollContainerRef.current
        : window;

    // ROTASI container
    const rotateTween = gsap.fromTo(
      el,
      { transformOrigin: "0% 50%", rotate: baseRotation },
      {
        ease: "none",
        rotate: 0,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: "top bottom",
          end: rotationEnd,
          scrub: true,
        },
      }
    );

    // kalau string → animasi per kata
    const wordElements = isStringChild
      ? el.querySelectorAll<HTMLElement>(".word")
      : null;

    let opacityTween: gsap.core.Tween | null = null;
    let blurTween: gsap.core.Tween | null = null;

    if (wordElements && wordElements.length) {
      opacityTween = gsap.fromTo(
        wordElements,
        { opacity: baseOpacity, willChange: "opacity" },
        {
          ease: "none",
          opacity: 1,
          stagger: 0.05,
          scrollTrigger: {
            trigger: el,
            scroller,
            start: "top bottom-=20%",
            end: wordAnimationEnd,
            scrub: true,
          },
        }
      );

      if (enableBlur) {
        blurTween = gsap.fromTo(
          wordElements,
          { filter: `blur(${blurStrength}px)` },
          {
            ease: "none",
            filter: "blur(0px)",
            stagger: 0.05,
            scrollTrigger: {
              trigger: el,
              scroller,
              start: "top bottom-=20%",
              end: wordAnimationEnd,
              scrub: true,
            },
          }
        );
      }
    } else {
      // kalau children JSX → animasi seluruh block
      opacityTween = gsap.fromTo(
        el,
        {
          opacity: baseOpacity,
          filter: enableBlur ? `blur(${blurStrength}px)` : "none",
        },
        {
          ease: "none",
          opacity: 1,
          filter: "blur(0px)",
          scrollTrigger: {
            trigger: el,
            scroller,
            start: "top bottom-=20%",
            end: wordAnimationEnd,
            scrub: true,
          },
        }
      );
    }

    return () => {
      rotateTween.scrollTrigger?.kill();
      opacityTween?.scrollTrigger?.kill();
      blurTween?.scrollTrigger?.kill();
    };
  }, [
    scrollContainerRef,
    enableBlur,
    baseRotation,
    baseOpacity,
    rotationEnd,
    wordAnimationEnd,
    blurStrength,
    isStringChild,
  ]);

  return (
    <div ref={containerRef} className={`my-5 ${containerClassName}`}>
      {isStringChild ? (
        <p
          className={`text-[clamp(1.6rem,4vw,3rem)] leading-normal font-semibold ${textClassName}`}
        >
          {splitText}
        </p>
      ) : (
        children
      )}
    </div>
  );
};

export default ScrollReveal;
