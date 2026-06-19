import { Link } from "@tanstack/react-router";

export function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 md:px-10 py-6 border-b border-brand-border">
      <Link to="/" className="text-lg font-semibold tracking-tight">
        BRIEFING<span className="text-brand-primary">.</span>
      </Link>
      <div className="flex gap-6 md:gap-8 text-sm font-medium text-brand-text-muted">
        <Link to="/briefing" className="hover:text-white transition-colors">
          Iniciar
        </Link>
        <Link to="/auth" className="hover:text-white transition-colors">
          Entrar
        </Link>
      </div>
    </nav>
  );
}
