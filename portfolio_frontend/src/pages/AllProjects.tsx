import ProjectCard from "@/components/ProjectCard";
import Footer from "@/sections/Footer";
import { PROJECTS } from "@/lib/utils-project";

export default function AllProjects() {
  return (
    <>
      <main className="relative px-6 pb-24 pt-32 md:px-10 md:pt-40">
        <div className="mx-auto max-w-6xl">
          {/* <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-secondary opacity-60 transition-opacity hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary"
          >
            <ArrowUpRight className="h-3.5 w-3.5 -rotate-135" />
            Back home
          </Link> */}

          <h1 className="font-display mt-8 text-4xl leading-[1.05] text-secondary sm:text-5xl md:text-6xl lg:text-7xl">
            All
            <br />
            Projects
          </h1>

          <p className="mt-6 max-w-xl text-sm text-secondary opacity-70 md:text-base">
            {PROJECTS.length} projects built to learn, explore ideas, and turn
            small concepts into something people can use.
          </p>

          <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2">
            {PROJECTS.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
