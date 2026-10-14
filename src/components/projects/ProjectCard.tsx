import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/types";
import { PROPERTY_IMAGE_QUALITY } from "@/lib/property-image";

const statusStyles: Record<Project["status"], string> = {
  Ongoing: "bg-brass/15 text-brass",
  Completed: "bg-forest/10 text-forest",
  "Coming Soon": "bg-slate/15 text-slate",
};

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article id={project.slug} className="border hairline bg-white scroll-mt-28">
      <div className="relative aspect-[16/10]">
        <Image
          src={project.imageUrl}
          alt={project.name}
          fill
          quality={PROPERTY_IMAGE_QUALITY}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 560px"
          className="object-cover object-center"
        />
        <span
          className={`absolute top-3 left-3 px-2.5 py-1 text-[11px] font-medium ${statusStyles[project.status]}`}
        >
          {project.status}
        </span>
      </div>
      <div className="p-6">
        <h3 className="font-serif text-xl text-ink">{project.name}</h3>
        <p className="text-sm text-brass mt-1">{project.location}</p>
        <p className="mt-3 text-sm text-slate leading-relaxed">
          {project.description}
        </p>
        {project.unitsInfo && (
          <p className="mt-4 text-xs text-ink-soft border-t hairline pt-4">
            {project.unitsInfo}
          </p>
        )}
        <Link
          href={`/projects#${project.slug}`}
          className="mt-5 inline-block text-sm text-brass hover:underline underline-offset-4"
        >
          View project
        </Link>
      </div>
    </article>
  );
}
