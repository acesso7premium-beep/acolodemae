import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo-colo-de-mae.png";

const navItems = [
  { label: "Sobre", href: "/#sobre" },
  { label: "Atividades", href: "/#atividades" },
  { label: "Equipe", href: "/#equipe" },
  { label: "Galeria", href: "/#galeria" },
  { label: "Contato", href: "/#contato" },
];

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-[76px] items-center justify-between px-4">
        <a href="#" className="flex items-center gap-3">
          <img
            src={logo}
            alt="Logo Associação Colo de Mãe"
            className="h-[52px] w-auto"
          />
          <span className="hidden font-heading text-lg font-bold text-foreground sm:inline">
            Colo de Mãe
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {item.label}
            </a>
          ))}
          <Button
            asChild
            className="rounded-full bg-tea-yellow px-6 py-2 text-sm font-bold text-background shadow-[0_8px_24px_-6px_hsl(var(--tea-yellow)/0.5)] ring-2 ring-tea-yellow/40 ring-offset-2 ring-offset-background transition-all hover:-translate-y-0.5 hover:bg-[#FFD700] hover:shadow-[0_12px_32px_-8px_hsl(var(--tea-yellow)/0.7)]"
          >
            <a href="/entrar">Entrar</a>
          </Button>
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="text-foreground md:hidden"
          aria-label="Abrir menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border/50 bg-background/95 backdrop-blur-md md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
                >
                  {item.label}
                </a>
              ))}
              <Button
                asChild
                className="mt-2 rounded-full bg-tea-yellow py-3 text-sm font-bold text-background shadow-[0_8px_24px_-6px_hsl(var(--tea-yellow)/0.5)] ring-2 ring-tea-yellow/40 ring-offset-2 ring-offset-background transition-all hover:bg-[#FFD700]"
              >
                <a href="/entrar" onClick={() => setOpen(false)}>
                  Entrar
                </a>
              </Button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
