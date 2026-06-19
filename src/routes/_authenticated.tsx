import { createFileRoute, Outlet, redirect, Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { LayoutDashboard, LogOut } from "lucide-react";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      throw redirect({ to: "/auth" });
    }
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id);
    const isAdmin = roles?.some((r) => r.role === "admin");
    if (!isAdmin) {
      await supabase.auth.signOut();
      throw redirect({ to: "/auth" });
    }
    return { user: data.user };
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const navigate = useNavigate();
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  return (
    <div className="min-h-screen bg-brand-bg text-white">
      <div className="flex">
        <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-brand-border min-h-screen sticky top-0 p-6 bg-brand-card/30">
          <Link to="/" className="text-base font-semibold tracking-tight mb-10">
            BRIEFING<span className="text-brand-primary">.</span>
          </Link>
          <nav className="space-y-1 text-sm">
            <Link
              to="/admin"
              activeProps={{ className: "bg-brand-card text-white" }}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-brand-text-muted hover:bg-brand-card hover:text-white transition-colors"
            >
              <LayoutDashboard className="size-4" /> Dashboard
            </Link>
          </nav>
          <button
            onClick={handleSignOut}
            className="mt-auto flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-brand-text-muted hover:bg-brand-card hover:text-white transition-colors"
          >
            <LogOut className="size-4" /> Sair
          </button>
        </aside>
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
