import { Link } from "react-router-dom";

import type { ProjectItem } from "@/lib/utils-project";

export default function ProjectCard({ project }: { project: ProjectItem }) {
  return (
    <Link
      to={`/work/${project.id}`}
      className="group flex flex-col focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary"
    >
      {/* Bingkai dan gambar memakai durasi berbeda (500ms vs 700ms) supaya
          gambarnya terasa mengambang di dalam bingkai saat hover. */}
      <div className="relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden rounded-[24px] border border-secondary p-4 transition-transform duration-500 ease-out group-hover:scale-[1.01]">
        <img
          src={project.image}
          alt={project.title}
          loading="lazy"
          decoding="async"
          className="max-h-full max-w-full object-contain transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>

      <div className="mt-4 flex flex-col gap-1 pl-1">
        <h3 className="font-display text-xl tracking-tight text-secondary md:text-2xl">
          {project.title}
        </h3>
        <p className="text-[15px] font-medium text-secondary opacity-60">
          {project.role}
        </p>
      </div>
    </Link>
  );
}
