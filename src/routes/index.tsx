import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Navbar } from "@/components/landing/Navbar";
import { ArrowRight, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Briefing para Desenvolvimento de Site" },
      {
        name: "description",
        content:
          "Formulário consultivo para entender seu negócio e desenvolver uma proposta personalizada de site institucional.",
      },
      { property: "og:title", content: "Briefing para Desenvolvimento de Site" },
      {
        property: "og:description",
        content:
          "Formulário consultivo para entender seu negócio e desenvolver uma proposta personalizada de site institucional.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-brand-bg text-white">
      <Navbar />
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-24 md:pt-32 md:pb-40 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-card border border-brand-border text-xs font-medium text-brand-text-muted mb-8"
        >
          <Sparkles className="size-3 text-brand-primary" />
          Consultoria estruturada · 9 seções · ~15 min
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.05] text-balance"
        >
          Briefing para Desenvolvimento de Site
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-brand-text-muted text-lg md:text-xl mt-6 max-w-2xl mx-auto leading-relaxed text-pretty"
        >
          Este formulário nos ajudará a entender seu negócio em profundidade para
          desenvolver uma proposta personalizada — alinhada aos seus objetivos,
          ao seu público e à identidade da sua marca.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            to="/briefing"
            className="group inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-primary/90 text-white px-7 py-3.5 rounded-full font-medium transition-all shadow-xl shadow-brand-primary/20 hover:-translate-y-0.5"
          >
            Iniciar Briefing
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <span className="text-xs text-brand-text-muted/70">
            Suas respostas ficam salvas automaticamente no navegador.
          </span>
        </motion.div>
      </section>

      <footer className="border-t border-brand-border py-8 px-6 text-center text-xs text-brand-text-muted">
        © {new Date().getFullYear()} · Briefing para Desenvolvimento de Site
      </footer>
    </div>
  );
}
