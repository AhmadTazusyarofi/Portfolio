import About from "@/sections/About";
import Contact from "@/sections/Contact";
import Footer from "@/sections/Footer";
import Hero from "@/sections/Hero";
import Projects from "@/sections/Projects";
import Statement from "@/sections/Statement";
import ScrollVelocity from "@/components/ScrollVelocity";

export default function Home() {
  return (
    <>
      <Hero />

      <About />

      <div className="pointer-events-none relative border-y border-secondary py-4 text-secondary">
        <ScrollVelocity
          texts={["Creative Developer - ", "Scroll Down - "]}
          velocity={60}
          damping={60}
          stiffness={350}
          className="text-outline font-display"
        />
      </div>

      <Statement />

      <Projects />

      <Contact />

      <Footer />
    </>
  );
}
