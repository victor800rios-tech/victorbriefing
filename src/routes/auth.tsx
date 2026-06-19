import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Entrar · Administração" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
      }
      navigate({ to: "/admin" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Falha ao autenticar.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-white flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Link
          to="/"
          className="block text-center text-lg font-semibold tracking-tight mb-8"
        >
          BRIEFING<span className="text-brand-primary">.</span>
        </Link>
        <div className="bg-brand-card border border-brand-border rounded-2xl p-8">
          <h1 className="text-2xl font-semibold tracking-tight">
            {mode === "signin" ? "Entrar" : "Criar conta"}
          </h1>
          <p className="text-sm text-brand-text-muted mt-1.5">
            Acesso à área administrativa.
          </p>

          <form onSubmit={handle} className="mt-6 space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-brand-bg border border-brand-border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Senha
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-brand-bg border border-brand-border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-brand-primary hover:bg-brand-primary/90 rounded-xl font-medium transition-all inline-flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading && <Loader2 className="size-4 animate-spin" />}
              {mode === "signin" ? "Entrar" : "Criar conta"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="mt-6 w-full text-center text-sm text-brand-text-muted hover:text-white transition-colors"
          >
            {mode === "signin"
              ? "Não tem conta? Criar agora"
              : "Já tem conta? Entrar"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
