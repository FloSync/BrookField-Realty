import Image from "next/image";
import type { TeamMember } from "@/lib/types";

export function TeamMemberCard({
  member,
  size = "default",
}: {
  member: TeamMember;
  size?: "board" | "team" | "default";
}) {
  const isBoard = size === "board";
  const isTeam = size === "team" || size === "default";
  const photoAspect = isBoard ? "aspect-[4/5]" : "aspect-[4/5]";
  const photoMaxWidth = isBoard
    ? "max-w-[200px] sm:max-w-[220px] md:max-w-[240px]"
    : "max-w-[160px] sm:max-w-[180px] md:max-w-[200px]";
  const nameClass = isBoard
    ? "font-serif text-xl md:text-2xl text-ink"
    : "font-serif text-lg md:text-xl text-ink";
  const roleClass = isBoard
    ? "text-sm md:text-base text-brass mt-1 font-medium"
    : "text-sm text-brass mt-0.5";
  const photoAlt = member.photoIsPlaceholder
    ? `${member.name} — photo coming soon`
    : `Portrait of ${member.name}`;

  return (
    <div className="border hairline bg-white">
      <div className="flex justify-center bg-parchment-dim px-3 pt-3 pb-2">
        <div
          className={`relative w-full ${photoMaxWidth} ${photoAspect} overflow-hidden`}
        >
        <Image
          src={member.photoUrl}
          alt={photoAlt}
          fill
          sizes={
            isBoard
              ? "(max-width: 768px) 80vw, 40vw"
              : "(max-width: 768px) 50vw, 30vw"
          }
          className={
            member.photoIsPlaceholder
              ? "object-contain p-6"
              : "object-cover object-center"
          }
          quality={member.photoIsPlaceholder ? 75 : 90}
        />
        </div>
      </div>
      <div className={isBoard ? "px-4 py-4 text-center" : "px-4 py-4 text-center"}>
        <h3 className={nameClass}>{member.name}</h3>
        {member.position ? <p className={roleClass}>{member.position}</p> : null}
        {isTeam && (
          <p className="mt-3 text-sm text-slate leading-relaxed">{member.bio}</p>
        )}
      </div>
    </div>
  );
}
