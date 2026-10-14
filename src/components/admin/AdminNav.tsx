import Link from "next/link";
import { LayoutDashboard, Building2, MapPinned, Users, Briefcase, Inbox, LogOut } from "lucide-react";
import { logoutAction } from "@/server/actions/auth";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/enquiries", label: "Enquiries", icon: Inbox },
  { href: "/admin/properties", label: "Properties", icon: Building2 },
  { href: "/admin/projects", label: "Projects", icon: MapPinned },
  { href: "/admin/team", label: "Team", icon: Users },
  { href: "/admin/careers", label: "Careers", icon: Briefcase },
  { href: "/admin/applications", label: "Applications", icon: Inbox },
];

export function AdminNav({ email }: { email: string }) {
  return (
    <aside className="w-full md:w-56 shrink-0 border-b md:border-b-0 md:border-r hairline bg-parchment-dim">
      <div className="p-5 border-b hairline">
        <p className="font-serif text-lg text-ink">Brookfield</p>
        <p className="text-[11px] text-brass mt-0.5">Admin</p>
      </div>
      <nav className="p-3 flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-ink-soft hover:bg-white hover:text-ink whitespace-nowrap"
            >
              <Icon size={16} />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 mt-auto border-t hairline hidden md:block">
        <p className="px-3 text-xs text-slate truncate mb-2">{email}</p>
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-ink-soft hover:bg-white hover:text-ink w-full"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
