import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import "./App.css";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import BlurText from "./components/BlurText";
import ChatWidget from "./components/ChatWidget";
import DecryptedText from "./components/DecryptedText";
import DomeGallery from "./components/DomeGallery";
import Lanyard from "./components/Lanyard";
import LaserFlow from "./components/LaserFlow";
import LoadingScreen from "./components/LoadingScreen";
import LogoLoop from "./components/LogoLoop";
import { parseLogoImage } from "./components/MetallicPaint";
import Ribbons from "./components/Ribbons";
import RotatingText from "./components/RotatingText";
import ScrollReveal from "./components/ScrollReveal";
import ScrollVelocity from "./components/ScrollVelocity";
import StaggeredMenu from "./components/StaggeredMenu";
import TextPressure from "./components/TextPressure";

import logo from "@/assets/logo.svg?url";
import { Github, Instagram, Linkedin, Twitter } from "lucide-react";
import { icons } from "./lib/utils-icon";
import { PROJECTS, type ProjectItem } from "./lib/utils-project";

function App() {
  const phrases = [
    { prefix: "My name is", word: "Ahmad Tazusyarofi" },
    { prefix: "I'm a", word: "Web Developer" },
  ];

  const handleAnimationComplete = () => {
    console.log("Animation completed!");
  };

  const [phraseIndex, setPhraseIndex] = useState(0);
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

        if (!cancelled) {
          setLogoImageData(imageData);
        }
      } catch (err) {
        console.error("Failed to load metallic logo:", err);
      }
    }

    loadLogo();
    return () => {
      cancelled = true;
    };
  }, []);

  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    return <LoadingScreen finishLoading={() => setIsLoading(false)} />;
  }

  const menuItems = [
    { label: "Home", ariaLabel: "Go to home page", link: "#home" },
    { label: "About", ariaLabel: "Learn about us", link: "#about" },
    { label: "MyProject", ariaLabel: "View our my project", link: "#projects" },
    {
      label: "Certifications",
      ariaLabel: "View our my certifications",
      link: "#certifications",
    },
    { label: "Contact", ariaLabel: "Get in touch", link: "#contact" },
  ];

  const socialItems = [
    { label: "Instagram", link: "https://instagram.com" },
    { label: "Twitter", link: "https://twitter.com" },
    { label: "GitHub", link: "https://github.com" },
    { label: "LinkedIn", link: "https://linkedin.com" },
  ];

  const iconsLogo = [
    { src: icons.html, alt: "html" },
    { src: icons.css, alt: "css" },
    { src: icons.js, alt: "js" },
    { src: icons.bootstrap, alt: "bootstrap" },
    { src: icons.tailwind, alt: "tailwindcss" },
    { src: icons.react, alt: "react" },
    { src: icons.vue, alt: "vue" },
    { src: icons.laravel, alt: "laravel" },
    { src: icons.ci, alt: "CI" },
  ];

  const projects = PROJECTS;
  const CONTACT_EMAIL = "tazusyaroffiahmad@gmail.com";

  const showToast = (message: string) => {
    setToastMessage(message);
    setIsToastVisible(true);

    window.setTimeout(() => {
      setIsToastVisible(false);
    }, 3000);
  };

  const headingVariants = {
    hidden: { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  } as const;

  return (
    <div className="relative min-h-screen bg-slate-900 overflow-x-hidden">
      {/* RIBBONS BACKGROUND */}
      <div className="pointer-events-none fixed inset-0" style={{ zIndex: 10 }}>
        <Ribbons
          baseThickness={30}
          colors={["#5227FF"]}
          speedMultiplier={0.5}
          maxAge={500}
          enableFade={false}
        />
      </div>

      {/* MENU */}
      <div className="fixed top-6 right-6 z-50">
        <StaggeredMenu
          position="right"
          isFixed={true}
          items={menuItems}
          socialItems={socialItems}
          displaySocials
          displayItemNumbering
          menuButtonColor="#ffffff"
          openMenuButtonColor="#5227FF"
          changeMenuColorOnOpen
          colors={["#B19EEF", "#5227FF"]}
          accentColor="#5227FF"
          onMenuOpen={() => console.log("Menu opened")}
          onMenuClose={() => console.log("Menu closed")}
          logoImageData={logoImageData}
        />
      </div>

      {/* HERO */}
      <main className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <section
          id="home"
          className="w-full max-w-4xl flex flex-col items-center text-center gap-10"
        >
          <div className="flex items-center justify-center">
            <TextPressure
              text="Welcome!"
              flex
              alpha={false}
              stroke={false}
              width
              weight
              italic
              textColor="#ffffff"
              strokeColor="#ff0000"
              minFontSize={300}
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-3xl md:text-6xl font-extrabold">
            <span className="text-slate-100">
              {phrases[phraseIndex].prefix}
            </span>

            <RotatingText
              texts={phrases.map((p) => p.word)}
              onNext={(index) => setPhraseIndex(index)}
              mainClassName="px-2 sm:px-2 md:px-3 bg-[#5227ff] text-white overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
              staggerFrom="last"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-120%" }}
              staggerDuration={0.025}
              splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              rotationInterval={3000}
            />
          </div>
        </section>
      </main>

      {/* ABOUT ME SECTION */}
      <section
        id="about"
        className="relative z-10 pt-14 md:pt-18 pb-14 md:pb-16 overflow-x-hidden"
      >
        {/* SHAPE PUTIH DI BELAKANG */}
        <div className="pointer-events-none absolute top-24 md:top-28 left-0 right-0 bottom-10 md:bottom-14 bg-[#d9d8db] rounded-tl-[80px] md:rounded-tl-[150px] shadow-[0_20px_60px_rgba(0,0,0,0.12)]" />

        {/* KONTEN */}
        <div className="relative mx-auto max-w-6xl px-4 md:px-8 lg:px-10 flex flex-col gap-10 lg:grid lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-start z-10">
          {/* TEKS + SKILLS */}
          <div className="space-y-5 pt-16 sm:pt-18 md:pt-20 text-slate-900 flex flex-col items-center lg:items-start text-center lg:text-left">
            <h2 className="text-slate-800 font-bold leading-tight">
              <BlurText
                text="About Me!"
                delay={100}
                animateBy="words"
                direction="top"
                onAnimationComplete={handleAnimationComplete}
                className="text-5xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl mb-2"
              />
            </h2>

            {/* PARAGRAF */}
            <p className="text-base sm:text-lg md:text-2xl leading-relaxed text-slate-900 min-h-[150px] sm:min-h-[170px] md:min-h-[190px]">
              <DecryptedText
                text="Hello! My name is Ahmad Tazusyarofi — a creative web developer from Indonesia with a passion for building smooth, interactive, and meaningful digital experiences. I enjoy turning ideas into functional interfaces with clean design and subtle animations. My goal is to craft websites that are visually appealing, intuitive to use, and built with care. Every project helps me grow, explore new ideas, and create something valuable for people on the web."
                speed={50}
                maxIterations={15}
                animateOn="view"
                revealDirection="start"
                sequential={true}
                className="text-slate-900"
                encryptedClassName="text-slate-400"
              />
            </p>

            {/* SKILLS / TECH STACK */}
            <div className="mt-2 md:mt-3 space-y-3 w-full">
              <h3 className="text-sm sm:text-base md:text-2xl font-semibold uppercase tracking-[0.45em] text-slate-500 text-center lg:text-left">
                My Skills
              </h3>

              <div className="bg-transparent py-2 px-1 sm:px-2 rounded-lg flex justify-center lg:justify-start">
                <LogoLoop
                  logos={iconsLogo}
                  speed={50}
                  direction="left"
                  logoHeight={60}
                  gap={24}
                  pauseOnHover
                  scaleOnHover
                  fadeOut={false}
                  ariaLabel="Tech Stack"
                />
              </div>
            </div>
          </div>

          {/* LANYARD */}
          <div className="flex justify-center lg:justify-end mt-6 lg:mt-10">
            <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-full h-[420px] sm:h-[480px] md:h-[620px] lg:h-[720px]">
              <Lanyard position={[0, 0, 13]} gravity={[0, -40, 0]} />
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="relative z-10 text-white/30 pointer-events-none">
        <ScrollVelocity
          texts={["Creative Developer - ", "Scroll Down - "]}
          velocity={60}
          damping={60}
          stiffness={350}
          className="text-outline"
        />
      </div>

      {/* MY PROJECT SECTION */}
      <section
        id="projects"
        className="relative z-50 mt-16 md:mt-24 px-4 md:px-8 lg:px-12"
        style={{ pointerEvents: "auto" }}
      >
        {/* heading */}
        <div className="mx-auto max-w-5xl text-center mb-10 md:mb-14">
          <ScrollReveal
            baseOpacity={0}
            enableBlur={true}
            baseRotation={5}
            blurStrength={10}
            containerClassName="space-y-4"
          >
            <p className="text-xs font-semibold tracking-[0.45em] uppercase text-slate-400 mb-3">
              My Project
            </p>

            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-50 drop-shadow-sm">
              It's A Simple Work, But it's Honest
            </h2>

            <p className="mt-3 text-sm md:text-xl text-slate-400">
              Some of the web projects I've built to learn, explore ideas, and
              turn small concepts into something people can use.
            </p>
          </ScrollReveal>
        </div>

        {/* Card */}
        <div className="relative z-50 mx-auto max-w-6xl">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="relative z-40 w-full"
          >
            <CarouselContent className="-ml-4 md:-ml-6">
              {projects.map((project, index) => (
                <CarouselItem
                  key={project.id}
                  className="pl-4 md:pl-6 md:basis-1/2 xl:basis-1/3"
                >
                  <article
                    className="group relative z-40 h-full cursor-pointer rounded-2xl border border-slate-800/70 bg-slate-900/60
                 overflow-hidden shadow-[0_18px_45px_rgba(15,23,42,0.65)]
                 transition-all duration-300
                 hover:-translate-y-3 hover:shadow-[0_25px_70px_rgba(15,23,42,0.9)]"
                    style={{
                      isolation: "isolate",
                      pointerEvents: "auto",
                    }}
                  >
                    {/* gradient glow belakang card */}
                    <div
                      className="pointer-events-none absolute inset-0 opacity-0 blur-3xl
                   transition-opacity duration-500 group-hover:opacity-100"
                      style={{
                        background:
                          "radial-gradient(circle at 0% 0%, rgba(82,39,255,0.55), transparent 55%), radial-gradient(circle at 100% 100%, rgba(45,212,191,0.5), transparent 55%)",
                        zIndex: 0,
                      }}
                    />

                    {/* isi card */}
                    <div
                      className="relative z-40 flex h-full flex-col rounded-2xl bg-slate-950/70 backdrop-blur-xl overflow-hidden transition-colors duration-300 group-hover:bg-slate-950"
                      style={{ pointerEvents: "auto" }}
                    >
                      {/* image */}
                      <div className="relative overflow-hidden rounded-t-2xl bg-slate-900 flex items-center justify-center h-52">
                        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-slate-950/40 via-slate-950/0 to-slate-900/0 z-10" />
                        <img
                          src={project.image}
                          alt={project.title}
                          className="max-h-full w-full object-contain transition duration-500
                       brightness-75
                       group-hover:brightness-100"
                        />

                        {/* badge role */}
                        <div className="absolute left-4 top-4 z-20 flex items-center gap-2">
                          <span className="inline-flex items-center rounded-full bg-slate-950/70 px-3 py-1 text-[11px] font-medium text-slate-200">
                            <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            {project.role}
                          </span>
                        </div>

                        {/* index mini */}
                        <span className="absolute right-4 top-4 z-20 text-xs font-semibold text-slate-400">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>

                      {/* content */}
                      <div className="flex flex-1 flex-col gap-4 p-5 md:p-6">
                        <div>
                          <h3 className="text-lg md:text-xl font-semibold text-slate-50">
                            {project.title}
                          </h3>
                          <p className="mt-1 text-sm text-slate-400 leading-relaxed line-clamp-2-custom">
                            {project.description}
                          </p>
                        </div>

                        {/* tech chips */}
                        <div className="mt-1 flex flex-wrap gap-2">
                          {project.tech.map((label) => (
                            <span
                              key={label}
                              className="inline-flex items-center rounded-full border border-slate-700/70
                           bg-slate-900/60 px-2.5 py-1 text-[11px] uppercase tracking-wide text-slate-300
                           transition-colors duration-300
                           hover:border-slate-400 hover:text-slate-100
                           group-hover:border-slate-400 group-hover:text-slate-100"
                            >
                              {label}
                            </span>
                          ))}
                        </div>

                        {/* actions */}
                        <div className="mt-3 flex items-center justify-between gap-3 pt-1">
                          <div
                            className="flex gap-2"
                            style={{ position: "relative", zIndex: 10 }}
                          >
                            {project.liveUrl !== undefined && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();

                                  if (
                                    !project.liveUrl ||
                                    project.liveUrl === "#"
                                  ) {
                                    showToast(
                                      "The live demo for this project is not available yet (coming soon)."
                                    );
                                    return;
                                  }

                                  window.open(
                                    project.liveUrl,
                                    "_blank",
                                    "noopener,noreferrer"
                                  );
                                }}
                                className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 text-slate-900
                             px-3 py-1.5 text-xs font-semibold tracking-wide
                             transition-all duration-200
                             hover:bg-white hover:-translate-y-0.5 cursor-pointer
                             group-hover:-translate-y-0.5"
                                style={{ pointerEvents: "auto" }}
                              >
                                <span>Live demo</span>
                                <span className="text-[13px]">↗</span>
                              </button>
                            )}

                            {project.codeUrl && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedProject(project);
                                }}
                                className="inline-flex items-center gap-1.5 rounded-full border border-slate-600
                             px-3 py-1.5 text-xs font-semibold text-slate-200
                             transition-all duration-200
                             hover:border-slate-300 hover:text-white cursor-pointer
                             group-hover:border-slate-300 group-hover:text-white"
                                style={{ pointerEvents: "auto" }}
                              >
                                <span>Details Project</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </section>

      {/* Certifications */}
      <section
        className="relative z-10 mt-15 md:mt-16 px-4 overflow-x-hidden"
        id="certifications"
      >
        {/* Heading yang BERULANG animasinya */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.7 }} // <= BUKAN once:true
          className="mb-8 md:mb-10"
        >
          <motion.h2
            variants={headingVariants}
            className="text-center text-4xl md:text-5xl font-bold text-slate-50 mb-2"
          >
            Certifications
          </motion.h2>

          <motion.p
            variants={headingVariants}
            transition={{ delay: 0.08 }} // sedikit delay biar collapse-nya enak
            className="text-center text-sm md:text-xl text-slate-400"
          >
            A snapshot of courses and certifications I’ve completed to sharpen
            my skills as a web developer.
          </motion.p>
        </motion.div>

        <div
          className="flex items-center justify-center mx-auto -mt-30"
          style={{ maxWidth: "100%", height: "100vh" }}
        >
          <div style={{ width: "100%", maxWidth: "1200px", height: "100%" }}>
            <DomeGallery overlayBlurColor="transparent" grayscale={false} />
          </div>
        </div>

        {/* Laser Flow */}
        <div className="relative mx-auto mt-[-125px] h-[380px] w-full max-w-5xl flex items-center justify-center overflow-hidden">
          <LaserFlow
            className="rounded-4xl overflow-hidden"
            horizontalBeamOffset={0}
            verticalBeamOffset={-0.05}
            flowSpeed={0.35}
            fogIntensity={0.55}
            wispDensity={1.1}
            color="#5227ff"
          />
        </div>
      </section>

      {/* PROJECT DETAIL OVERLAY */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-999 flex items-center justify-center bg-slate-950/80 backdrop-blur-xl px-4"
          style={{ pointerEvents: "auto" }}
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="relative w-full max-w-5xl rounded-3xl border border-slate-800/70 
                bg-slate-900/90 shadow-[0_32px_120px_rgba(15,23,42,0.95)] overflow-hidden"
            style={{ pointerEvents: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* header image */}
            <div className="relative h-72 md:h-96 overflow-hidden bg-slate-950 flex items-center justify-center">
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                className="max-h-full w-full object-contain brightness-75 transition-transform duration-500 hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-slate-950/90 via-slate-950/20 to-slate-950/10" />

              <div className="absolute left-6 bottom-6 flex flex-col gap-2">
                <span className="inline-flex items-center rounded-full bg-slate-950/80 px-3 py-1 text-[11px] font-medium text-slate-200">
                  <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {selectedProject.role}
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-50 drop-shadow">
                  {selectedProject.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="absolute right-5 top-5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-950/80 text-slate-200 text-sm font-semibold border border-slate-700 hover:bg-slate-800 hover:text-white cursor-pointer"
                style={{ pointerEvents: "auto" }}
              >
                ×
              </button>
            </div>

            {/* content */}
            <div className="grid gap-6 p-6 md:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] md:p-8">
              <div className="space-y-4">
                <p className="text-sm md:text-base leading-relaxed text-slate-200">
                  {selectedProject.description}
                </p>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400 mb-2">
                    Tech Stack
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tech.map((label) => (
                      <span
                        key={label}
                        className="inline-flex items-center rounded-full border border-slate-700/80 bg-slate-900/80 px-3 py-1 text-[11px] uppercase tracking-wide text-slate-200"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4 md:border-l md:border-slate-800 md:pl-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400 mb-2">
                    Links
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.liveUrl !== undefined && (
                      <button
                        type="button"
                        onClick={() => {
                          if (
                            !selectedProject.liveUrl ||
                            selectedProject.liveUrl === "#"
                          ) {
                            showToast(
                              "The live demo for this project is not available yet (coming soon)."
                            );
                            return;
                          }

                          window.open(
                            selectedProject.liveUrl,
                            "_blank",
                            "noopener,noreferrer"
                          );
                        }}
                        className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 text-slate-900 px-4 py-1.5 text-xs font-semibold tracking-wide hover:bg-white hover:-translate-y-0.5 transition-transform duration-200 cursor-pointer"
                        style={{ pointerEvents: "auto" }}
                      >
                        <span>Live demo</span>
                        <span className="text-[13px]">↗</span>
                      </button>
                    )}

                    {selectedProject.codeUrl &&
                      selectedProject.codeUrl !== "#" && (
                        <a
                          href={selectedProject.codeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-full border border-slate-600 px-4 py-1.5 text-xs font-semibold text-slate-200 hover:border-slate-300 hover:text-white cursor-pointer"
                        >
                          <span>View code</span>
                          <span className="text-[13px]">↗</span>
                        </a>
                      )}
                  </div>
                </div>

                <div className="pt-2">
                  <p className="text-xs text-slate-500">
                    This project page is part of my portfolio, focused on clean
                    layout, subtle gradients, and smooth interactions.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedProject(null)}
                    className="inline-flex items-center justify-center rounded-full bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-100 hover:bg-slate-700 cursor-pointer"
                    style={{ pointerEvents: "auto" }}
                  >
                    Close
                  </button>

                  <span className="text-[11px] text-slate-500">
                    Press ESC or click outside to dismiss.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GET IN TOUCH */}
      <section
        id="contact"
        className="relative z-10 -mt-42 px-4 md:px-8 lg:px-12 pb-20"
        style={{ isolation: "isolate" }}
      >
        {/* dekorasi glow belakang */}
        <div
          className="pointer-events-none absolute inset-x-0 -top-24 mx-auto h-84 w-84 rounded-full 
               bg-[#5227ff] opacity-30 blur-3xl"
        />

        <div
          className="relative mx-auto max-w-4xl rounded-3xl border border-slate-800/70 
                bg-slate-900/70 backdrop-blur-xl px-6 py-8 md:px-10 md:py-10 
                shadow-[0_24px_80px_rgba(15,23,42,0.9)]"
          style={{
            isolation: "isolate",
            position: "relative",
            zIndex: 1,
            pointerEvents: "auto",
          }}
        >
          {/* label kecil */}
          <p className="text-xs font-semibold tracking-[0.35em] uppercase text-slate-400 mb-3">
            Get in touch
          </p>

          {/* heading utama */}
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-50 mb-3 ">
            Let's work on something cool together.
          </h2>

          {/* deskripsi pendek */}
          <p className="text-sm md:text-base text-slate-400 max-w-2xl">
            I'm a web developer focused on smooth, playful interfaces and clean
            user experiences. If you have an idea or a product in mind, I'd love
            to help you turn it into something real on the web.
          </p>

          {/* BODY: availability + email + social + buttons */}
          <div className="mt-6 space-y-5">
            {/* availability */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Availability
              </p>
              <p className="text-sm text-slate-200">
                Open for freelance & collaboration projects.
              </p>
            </div>

            {/* email */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Email
              </p>
              <a
                href="mailto:tazusyaroffiahmad@gmail.com"
                className="text-sm text-slate-100 underline underline-offset-4 decoration-slate-500/60 
                     hover:decoration-[#5227ff] hover:text-white transition-colors cursor-pointer"
                style={{ pointerEvents: "auto" }}
              >
                tazusyaroffiahmad@gmail.com
              </a>
            </div>

            {/* SOCIAL + BUTTONS DALAM SATU ROW */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              {/* social di kiri */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 mb-2">
                  Social
                </p>
                <div className="flex flex-wrap gap-2">
                  <a
                    href="https://www.instagram.com/ahmdrr_/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-slate-800/80 
                         px-3 py-1.5 text-xs font-medium text-slate-100
                         hover:bg-[#E1306C] hover:text-white transition-colors cursor-pointer"
                    style={{ pointerEvents: "auto" }}
                  >
                    <Instagram className="w-4 h-4" />
                    <span>Instagram</span>
                  </a>

                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-slate-800/80 
                         px-3 py-1.5 text-xs font-medium text-slate-100
                         hover:bg-black hover:text-white transition-colors cursor-pointer"
                    style={{ pointerEvents: "auto" }}
                  >
                    <Twitter className="w-4 h-4" />
                    <span>Twitter</span>
                  </a>

                  <a
                    href="https://github.com/AhmadTazusyarofi"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-slate-800/80 
                         px-3 py-1.5 text-xs font-medium text-slate-100
                         hover:bg-slate-950 hover:text-white transition-colors cursor-pointer"
                    style={{ pointerEvents: "auto" }}
                  >
                    <Github className="w-4 h-4" />
                    <span>GitHub</span>
                  </a>

                  <a
                    href="https://www.linkedin.com/in/ahmad-tazusyarofi-92b1a0341/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-slate-800/80 
                         px-3 py-1.5 text-xs font-medium text-slate-100
                         hover:bg-[#0A66C2] hover:text-white transition-colors cursor-pointer"
                    style={{ pointerEvents: "auto" }}
                  >
                    <Linkedin className="w-4 h-4" />
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>

              {/* buttons di kanan */}
              <div className="flex flex-row flex-wrap gap-2 items-center justify-end">
                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=Project%20Inquiry&body=Hi%20Ahmad%2C%0D%0A`}
                  onClick={(e) => {
                    e.preventDefault(); // cegah behaviour aneh
                    window.location.href = `mailto:${CONTACT_EMAIL}?subject=Project%20Inquiry&body=Hi%20Ahmad%2C%0D%0A`;
                  }}
                  className="inline-flex items-center justify-center rounded-full bg-[#5227ff] 
       px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#5227ff]/40
       hover:shadow-[#5227ff]/60 hover:-translate-y-0.5 
       transition-shadow duration-200 cursor-pointer"
                  style={{ pointerEvents: "auto" }}
                >
                  Say hello
                  <span className="ml-1.5 text-base">👋</span>
                </a>

                <a
                  href="/CV/CV ATS - AHMAD TAZUSYAROFI.pdf"
                  download="Ahmad-Tazusyarofi-CV.pdf"
                  className="inline-flex items-center justify-center rounded-full border border-slate-600 
       px-4 py-2.5 text-sm font-semibold text-slate-200
       hover:border-slate-300 hover:text-white hover:-translate-y-0.5 transition-transform duration-200 cursor-pointer"
                  style={{ pointerEvents: "auto" }}
                >
                  Download CV
                  <span className="ml-1.5 text-xs">↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating AI Chatbot */}
      <ChatWidget />

      {/* Toast Alert */}
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: isToastVisible ? 1 : 0,
            y: isToastVisible ? 0 : 20,
          }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-4 left-0 right-0 z-999 px-4 sm:bottom-6"
          style={{ pointerEvents: "none" }}
        >
          <div
            className="mx-auto flex w-full max-w-lg items-start gap-3 rounded-2xl border border-slate-700/80 bg-slate-900/95 px-4 py-3 shadow-[0_18px_45px_rgba(15,23,42,0.9)] backdrop-blur-xl"
            style={{ pointerEvents: "auto" }}
          >
            <div className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400 mb-1">
                Info
              </p>
              <p className="text-sm text-slate-100">{toastMessage}</p>
            </div>
            <button
              type="button"
              onClick={() => setIsToastVisible(false)}
              className="ml-2 text-xs font-medium text-slate-400 hover:text-slate-100 cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default App;
