import Link from "next/link";
import { Building2, MapPinned, Users, Briefcase, Inbox } from "lucide-react";
import { adminListProperties } from "@/server/db/queries/properties";
import { adminListProjects } from "@/server/db/queries/projects";
import { adminListTeam } from "@/server/db/queries/team";
import { adminListCareers } from "@/server/db/queries/careers";
import { adminListEnquiries } from "@/server/db/queries/enquiries";
import { adminListApplications } from "@/server/db/queries/applications";

export default async function AdminDashboardPage() {
  const [properties, projects, team, careers, enquiries, applications] = await Promise.all([
    adminListProperties(),
    adminListProjects(),
    adminListTeam(),
    adminListCareers(),
    adminListEnquiries(),
    adminListApplications(),
  ]);

  const publishedCareers = careers.filter((c) => c.status === "published");
  const newEnquiries = enquiries.filter((e) => e.status === "new").length;
  const newApplications = applications.filter((a) => a.status === "new").length;

  const cards = [
    {
      href: "/admin/enquiries",
      label: "Enquiries",
      count: enquiries.length,
      note: `${newEnquiries} new`,
      icon: Inbox,
    },
    {
      href: "/admin/properties",
      label: "Properties",
      count: properties.length,
      note: `${properties.filter((p) => p.availability === "available").length} available`,
      icon: Building2,
    },
    {
      href: "/admin/projects",
      label: "Projects",
      count: projects.length,
      note: `${projects.filter((p) => p.published).length} published`,
      icon: MapPinned,
    },
    {
      href: "/admin/team",
      label: "Team members",
      count: team.length,
      note: `${team.filter((t) => t.published).length} shown`,
      icon: Users,
    },
    {
      href: "/admin/careers",
      label: "Vacancies",
      count: careers.length,
      note: `${publishedCareers.length} published`,
      icon: Briefcase,
    },
    {
      href: "/admin/applications",
      label: "Applications",
      count: applications.length,
      note: `${newApplications} new`,
      icon: Inbox,
    },
  ];

  return (
    <div>
      <h1 className="font-serif text-2xl text-ink mb-1">Dashboard</h1>
      <p className="text-sm text-slate mb-8">
        Manage what appears on the public website.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className="border hairline p-6 hover:border-brass transition-colors"
            >
              <Icon size={20} className="text-brass mb-4" />
              <p className="text-2xl font-serif text-ink">{card.count}</p>
              <p className="text-sm text-ink-soft mt-0.5">{card.label}</p>
              <p className="text-xs text-slate mt-1">{card.note}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
