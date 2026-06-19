import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/briefing/sucesso")({
  head: () => ({
    meta: [
      { title: "Briefing enviado" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Success,
});

function Success() {
  return (
    <div className="min-h-screen bg-brand-bg text-white flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full bg-brand-card border border-brand-border rounded-3xl p-10 text-center shadow-2xl shadow-black/40"
      >
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.1 }}
          className="size-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 grid place-items-center mx-auto mb-6"
        >
          <CheckCircle2 className="size-10 text-emerald-400" />
        </motion.div>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mb-4">
          Seu briefing foi enviado com sucesso!
        </h1>
        <p className="text-brand-text-muted leading-relaxed">
          Recebemos todas as informações e em breve entraremos em contato para dar
          continuidade ao seu projeto.
        </p>
        <Link
          to="/"
          className="inline-flex mt-8 items-center justify-center bg-brand-primary hover:bg-brand-primary/90 text-white px-6 py-3 rounded-full font-medium transition-all"
        >
          Voltar ao início
        </Link>
      </motion.div>
    </div>
  );
}
