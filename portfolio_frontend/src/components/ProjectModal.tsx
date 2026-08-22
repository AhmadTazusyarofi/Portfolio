import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";

import type { ProjectItem } from "@/lib/utils-project";

const NO_DEMO_MESSAGE =
  "The live demo for this project is not available yet (coming soon).";

export default function ProjectModal({
  project,
  onClose,
  onShowToast,
}: {
  project: ProjectItem;
  onClose: () => void;
  onShowToast: (message: string) => void;
}) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const openLiveDemo = () => {
    if (!project.liveUrl || project.liveUrl === "#") {
      onShowToast(NO_DEMO_MESSAGE);
      return;
    }
    window.open(project.liveUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <motion.div
      className="fixed inset-0 z-1000 flex items-center justify-center bg-secondary/90 px-4"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <motion.div
        className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-secondary bg-background"
        // Tanpa ini, scroll di dalam modal akan menggeser halaman di belakangnya
        data-lenis-prevent
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="flex h-64 items-center justify-center overflow-hidden border-b border-secondary md:h-80">
          <img
            src={project.image}
            alt={project.title}
            className="h-full w-full object-contain"
          />
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="absolute right-5 top-5 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-secondary bg-background text-secondary transition-colors hover:bg-secondary hover:text-background"
        >
          &times;
        </button>

        <div className="p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-secondary">
            {project.role}
          </p>
          <h2 className="font-display mt-2 text-2xl md:text-4xl text-secondary">
            {project.title}
          </h2>

          <div className="mt-6 grid gap-8 md:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
            <div>
              <p className="text-sm md:text-base leading-relaxed text-secondary">
                {project.description}
              </p>

              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-secondary">
                Tech Stack
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.tech.map((label) => (
                  <span
                    key={label}
                    className="inline-flex items-center rounded-full border border-secondary px-3 py-1 text-[11px] uppercase tracking-wide text-secondary"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div className="md:border-l md:border-secondary md:pl-8">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">
                Links
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.liveUrl !== undefined && (
                  <button
                    type="button"
                    onClick={openLiveDemo}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-secondary px-4 py-2 text-xs font-semibold uppercase tracking-wide text-background transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    <span>Live demo</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                )}

                {project.codeUrl && project.codeUrl !== "#" && (
                  <a
                    href={project.codeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-secondary px-4 py-2 text-xs font-semibold uppercase tracking-wide text-secondary transition-colors hover:bg-secondary hover:text-background"
                  >
                    <span>View code</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>

              <p className="mt-6 text-[11px] uppercase tracking-wide text-secondary opacity-60">
                Press ESC or click outside to dismiss.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
