import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowDown, ExternalLink } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-16">
      {/* Floating bubbles (TEA Festival vibe) */}
      <div className="tea-bubble left-[8%] top-[18%] h-56 w-56 bg-tea-blue animate-float" />
      <div className="tea-bubble right-[12%] top-[10%] h-72 w-72 bg-tea-green/60 animate-float" style={{ animationDelay: "1.5s" }} />
      <div className="tea-bubble left-[40%] bottom-[8%] h-80 w-80 bg-tea-yellow/30 animate-float" style={{ animationDelay: "3s" }} />
      <div className="tea-bubble right-[5%] bottom-[15%] h-48 w-48 bg-tea-cyan/40 animate-float" style={{ animationDelay: "2s" }} />

      <div className="container relative z-10 mx-auto flex flex-col items-center gap-10 px-4 text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 rounded-full border-2 border-tea-green/60 bg-tea-green/10 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-tea-green md:text-sm"
        >
          🧩 Associação Colo de Mãe — Acolhimento TEA & PcD
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="font-heading text-5xl font-extrabold leading-[1.05] tracking-tight text-foreground md:text-7xl lg:text-8xl"
        >
          Cuidar com <span className="text-tea-red">amor</span>,
          <br />
          incluir com o <span className="text-tea-yellow">coração</span>{" "}
          <span className="text-tea-cyan">💙</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="max-w-2xl text-base text-muted-foreground md:text-lg"
        >
          Acolhimento, desenvolvimento e inclusão para crianças com Transtorno do
          Espectro Autista e suas famílias. Um espaço seguro onde cada criança
          pode ser ela mesma.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Button
            asChild
            size="lg"
            className="min-h-14 rounded-full bg-tea-green px-8 font-bold text-white hover:bg-tea-green/90"
          >
            <a href="#atividades">
              Conheça nossas Atividades
              <ArrowDown size={18} />
            </a>
          </Button>

          <Button
            asChild
            size="lg"
            className="min-h-14 rounded-full bg-tea-yellow px-8 font-bold text-background shadow-lg shadow-tea-yellow/20 hover:bg-tea-yellow/90"
          >
            <a
              href="https://cartao-colo-de-mae.lovable.app/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Cartão Colo de Mãe
              <ExternalLink size={18} />
            </a>
          </Button>

        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-sm text-muted-foreground"
        >
          💙 Feito com carinho para famílias PcD e TEA
        </motion.p>
      </div>
    </section>
  );
};

export default HeroSection;
