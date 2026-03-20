import { Instagram, Youtube, Facebook } from "lucide-react";
import logo from "@/assets/logo-colo-de-mae.png";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card py-12">
      <div className="container mx-auto flex flex-col items-center gap-6 px-4 md:flex-row md:justify-between">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Logo Colo de Mãe"
            className="h-8 w-auto"
          />
          <span className="font-heading text-sm font-bold text-foreground">
            Colo de Mãe
          </span>
        </div>

        <nav className="flex flex-wrap justify-center gap-6">
          {["Sobre", "Atividades", "Equipe", "Galeria", "Contato"].map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              {l}
            </a>
          ))}
        </nav>

        <div className="flex gap-3">
          <a href="https://www.instagram.com/colodemaetea/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-primary" aria-label="Instagram">
            <Instagram size={18} />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-primary" aria-label="YouTube">
            <Youtube size={18} />
          </a>
          <a href="https://www.facebook.com/p/Associa%C3%A7%C3%A3o-Colo-de-M%C3%A3e-TEA-61582749415573/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-primary" aria-label="Facebook">
            <Facebook size={18} />
          </a>
        </div>
      </div>
      <p className="mt-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Associação Colo de Mãe. Todos os direitos reservados.
      </p>
    </footer>
  );
};

export default Footer;
