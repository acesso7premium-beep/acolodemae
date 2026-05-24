import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowDown, ExternalLink, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-children.jpg";

const HeroSection = () => {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-20">
      {/* Floating ambient bubbles */}
      <div className="tea-bubble left-[5%] top-[20%] h-56 w-56 bg-tea-blue/40 animate-float" />
      <div className="tea-bubble left-[45%] bottom-[10%] h-72 w-72 bg-tea-yellow/15 animate-float" style={{ animationDelay: "2s" }} />
      <div className="tea-bubble right-[3%] top-[55%] h-48 w-48 bg-tea-cyan/30 animate-float" style={{ animationDelay: "1.2s" }} />

      <div className="container relative z-10 mx-auto grid grid-cols-1 items-center gap-12 px-4 lg:grid-cols-2 lg:gap-16">
        {/* LEFT — text column */}
        <div className="flex flex-col items-start gap-7 text-left">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="inline-flex items-center gap-2 rounded-full border-2 border-tea-yellow/70 bg-tea-yellow/10 px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-tea-yellow"
          >
            Associação Colo de Mãe
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="font-heading text-5xl font-extrabold leading-[1.02] tracking-tight text-foreground md:text-6xl lg:text-7xl"
          >
            Cuidar com <span className="text-tea-yellow">amor</span>,
            <br />
            incluir com o <span className="text-tea-yellow">coração.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            Acolhimento, desenvolvimento e inclusão para crianças com Transtorno
            do Espectro Autista e suas famílias. Com amor, dedicação e respeito,
            criamos um espaço seguro onde cada criança pode ser ela mesma.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap items-center gap-4 pt-2"
          >
            {/* Primary — Cartão Colo de Mãe (destaque) */}
            <Button
              asChild
              size="lg"
              className="group relative min-h-14 overflow-hidden rounded-full bg-gradient-to-r from-tea-yellow via-[#FFB347] to-tea-yellow bg-[length:200%_100%] px-8 font-bold text-background shadow-[0_12px_40px_-8px_hsl(var(--ring)/0.7)] ring-2 ring-tea-yellow/40 ring-offset-2 ring-offset-background transition-all duration-500 hover:-translate-y-0.5 hover:bg-[position:100%_0] hover:shadow-[0_20px_50px_-10px_hsl(var(--ring)/0.9)] focus-visible:ring-tea-yellow"
            >
              <a
                href="/cartao"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Abrir cadastro do Cartão Colo de Mãe em nova aba"
              >
                {/* halo pulsante */}
                <span className="pointer-events-none absolute inset-0 -z-10 animate-ping rounded-full bg-tea-yellow/40" aria-hidden />
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <Sparkles size={18} className="relative" />
                <span className="relative">Cartão Colo de Mãe</span>
                <ExternalLink size={16} className="relative transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </Button>

          </motion.div>
        </div>

        {/* RIGHT — hero image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute -inset-6 rounded-[2rem] bg-tea-yellow/20 blur-3xl" aria-hidden />
          <img
            src={heroImage}
            alt="Crianças em atividade musical inclusiva com terapeutas da Associação Colo de Mãe"
            width={1280}
            height={1024}
            className="relative w-full rounded-[2rem] object-cover shadow-2xl ring-1 ring-foreground/10"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
