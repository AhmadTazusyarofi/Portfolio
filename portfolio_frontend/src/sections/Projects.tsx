import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

import ProjectCard from "@/components/ProjectCard";
import { PROJECTS } from "@/lib/utils-project";

/* Empat teratas di utils-project.ts adalah client project — yang paling layak
   ditampilkan sebagai "Featured". Ubah irisan ini kalau urutannya berubah. */
const FEATURED = PROJECTS.slice(0, 4);

export default function Projects() {
  return (
    <motion.section
      id="projects"
      className="relative px-6 py-20 md:px-10 md:py-28"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="mx-auto max-w-6xl">
        {/* items-end menyejajarkan tombol dengan baris terakhir heading,
            bukan dengan bagian atasnya. */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-display text-4xl leading-[1.05] text-secondary sm:text-5xl md:text-6xl lg:text-7xl">
            Featured
            <br />
            Project
          </h2>

          <Link
            to="/work"
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-secondary px-6 py-3 text-sm font-semibold uppercase tracking-wide text-secondary transition-colors duration-200 hover:bg-secondary hover:text-background focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary sm:self-auto"
          >
            View all projects
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2">
          {FEATURED.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </motion.section>
  );
}
