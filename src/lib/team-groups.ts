import type { TeamMember } from "./types";

/**
 * D1 team_members has no board/team column yet. Board vs staff is inferred from
 * position titles so the public /team layout matches seeded content. Admins who
 * add members should use “Director” / “Managing Director” style titles for board
 * rows, or extend the schema later with an explicit member_group field.
 */
export function isBoardTeamMember(member: Pick<TeamMember, "position">): boolean {
  const position = member.position.trim();
  if (/^director$/i.test(position)) return true;
  if (/\bmanaging director\b/i.test(position)) return true;
  if (/\bexecutive director\b/i.test(position)) return true;
  if (/\bboard member\b/i.test(position)) return true;
  if (/\bceo\b/i.test(position)) return true;
  return false;
}

export function withTeamGroup(member: TeamMember): TeamMember {
  return {
    ...member,
    group: isBoardTeamMember(member) ? "board" : "team",
  };
}

export function splitPublishedTeam(members: TeamMember[]): {
  board: TeamMember[];
  staff: TeamMember[];
} {
  const enriched = members.map(withTeamGroup);
  return {
    board: enriched.filter((m) => m.group === "board"),
    staff: enriched.filter((m) => m.group === "team"),
  };
}
