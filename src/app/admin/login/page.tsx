import type { Metadata } from "next";
import { loginAction } from "@/server/actions/auth";
import { Banner } from "@/components/admin/Banner";

export const metadata: Metadata = {
  title: "Admin Login | Brookfield Realty",
};

interface PageProps {
  searchParams: Promise<{ error?: string; from?: string }>;
}

export default async function AdminLoginPage({ searchParams }: PageProps) {
  const { error, from } = await searchParams;

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="font-serif text-2xl text-parchment">Brookfield</p>
          <p className="text-xs text-brass-light mt-1 tracking-wide">
            Admin
          </p>
        </div>

        <form action={loginAction} className="bg-parchment border hairline p-7">
          <Banner error={error} />
          <input type="hidden" name="from" value={from ?? "/admin"} />

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm text-ink-soft mb-1.5">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoFocus
              className="w-full border hairline bg-white px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-brass"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm text-ink-soft mb-1.5">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full border hairline bg-white px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-brass"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-ink text-parchment py-2.5 text-sm font-medium hover:bg-ink-soft"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
