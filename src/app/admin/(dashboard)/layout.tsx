import { redirect } from "next/navigation";
import { getSession } from "@/server/auth/session";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Middleware already blocks unauthenticated requests to /admin/*, but
  // this layout checks again so the page never renders admin content
  // without a verified session, even if middleware config ever drifts.
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      <AdminNav email={session.email} />
      <div className="flex-1 min-w-0">
        <div className="max-w-5xl mx-auto px-6 py-8 md:py-10">{children}</div>
      </div>
    </div>
  );
}
