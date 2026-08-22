import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import ImageLightbox from "@/components/ImageLightbox";
import Toast from "@/components/Toast";
import Footer from "@/sections/Footer";
import { PROJECTS } from "@/lib/utils-project";

const NO_DEMO_MESSAGE =
  "The live demo for this project is not available yet (coming soon).";

export default function ProjectDetail() {
  const { slug } = useParams();
  const index = PROJECTS.findIndex((item) => item.id === slug);
  const project = index === -1 ? undefined : PROJECTS[index];

  /* Berputar kembali ke project pertama setelah yang terakhir, supaya kartu
     "Next project" tidak pernah menemui jalan buntu. */
  const nextProject =
    index === -1 ? undefined : PROJECTS[(index + 1) % PROJECTS.length];

  const [isImageOpen, setIsImageOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isToastVisible, setIsToastVisible] = useState(false);

  const showToast = (message: string) => {
    setToastMessage(message);
    setIsToastVisible(true);
    window.setTimeout(() => setIsToastVisible(false), 3000);
  };

  if (!project) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <h1 className="font-display text-4xl text-secondary md:text-6xl">
          Project not found
        </h1>
        <p className="mt-4 text-sm text-secondary opacity-70">
          The project you&rsquo;re looking for doesn&rsquo;t exist.
        </p>
        <Link
          to="/work"
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-secondary px-6 py-3 text-sm font-semibold uppercase tracking-wide text-secondary transition-colors hover:bg-secondary hover:text-background"
        >
          See all projects
        </Link>
      </main>
    );
  }

  const openLiveDemo = () => {
    if (!project.liveUrl || project.liveUrl === "#") {
      showToast(NO_DEMO_MESSAGE);
      return;
    }
    window.open(project.liveUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <main className="relative px-6 pb-24 pt-32 md:px-10 md:pt-40">
        <div className="mx-auto max-w-5xl">
          {/* <Link
            to="/work"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-secondary opacity-60 transition-opacity hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary"
          >
            <ArrowUpRight className="h-3.5 w-3.5 -rotate-135" />
            All projects
          </Link> */}

          <p className="mt-10 text-xs font-semibold uppercase tracking-[0.3em] text-secondary opacity-60">
            {project.role}
          </p>

          <h1 className="font-display mt-4 text-4xl leading-[1.05] text-secondary sm:text-5xl md:text-6xl">
            {project.title}
          </h1>

          <button
            type="button"
            onClick={() => setIsImageOpen(true)}
            aria-label={`Lihat gambar ${project.title} ukuran penuh`}
            className="mt-12 flex aspect-16/10 w-full cursor-zoom-in items-center justify-center overflow-hidden rounded-3xl border border-secondary p-6 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary"
          >
            <img
              src={project.image}
              alt={project.title}
              decoding="async"
              className="max-h-full max-w-full object-contain"
            />
          </button>

          <div className="mt-14 grid gap-10 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-secondary opacity-60">
                About this project
              </p>
              <p className="mt-4 text-base leading-relaxed text-secondary md:text-lg">
                {project.description}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-secondary opacity-60">
                Tech stack
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tech.map((label) => (
                  <span
                    key={label}
                    className="inline-flex items-center rounded-full border border-secondary px-3 py-1 text-[11px] uppercase tracking-wide text-secondary"
                  >
                    {label}
                  </span>
                ))}
              </div>

              {project.liveUrl !== undefined && (
                <button
                  type="button"
                  onClick={openLiveDemo}
                  className="mt-8 inline-flex cursor-pointer items-center gap-2 rounded-full bg-secondary px-6 py-3 text-sm font-semibold uppercase tracking-wide text-background transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary"
                >
                  Live demo
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {nextProject && (
            /* `group` dipertahankan hanya sebagai pemicu: kartunya sendiri
               tidak berubah saat hover, cuma lingkaran panahnya. */
            <Link
              to={`/work/${nextProject.id}`}
              className="group mt-20 flex items-center justify-between gap-6 rounded-3xl border border-secondary p-6 text-secondary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary md:mt-28 md:p-10"
            >
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] opacity-60">
                  Next project
                </p>
                <h2 className="font-display mt-3 truncate text-2xl leading-tight md:text-4xl">
                  {nextProject.title}
                </h2>
              </div>

              <span
                aria-hidden="true"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-secondary text-secondary transition-colors duration-300 group-hover:bg-secondary group-hover:text-background md:h-14 md:w-14"
              >
                <ArrowRight className="h-5 w-5" />
              </span>
            </Link>
          )}
        </div>
      </main>

      <Footer />

      <ImageLightbox
        src={project.image}
        alt={project.title}
        isOpen={isImageOpen}
        onClose={() => setIsImageOpen(false)}
      />

      {toastMessage && (
        <Toast
          message={toastMessage}
          isVisible={isToastVisible}
          onClose={() => setIsToastVisible(false)}
        />
      )}
    </>
  );
}
