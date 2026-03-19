import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative flex min-h-screen items-center pt-16">
      <div className="container mx-auto grid items-center gap-12 px-4 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col gap-6"
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-block w-fit rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary"
          >
            Associação Colo de Mãe TEA
          </motion.span>

          <h1 className="font-heading text-4xl font-extrabold leading-tight text-foreground md:text-5xl lg:text-6xl">
            Cuidar com{" "}
            <span className="text-primary">amor</span>, incluir com o{" "}
            <span className="text-primary">coração.</span>
          </h1>

          <p className="max-w-lg text-lg text-muted-foreground">
            Acolhimento, desenvolvimento e inclusão para crianças com Transtorno do
            Espectro Autista e suas famílias. Com amor, dedicação e respeito, criamos
            um espaço seguro onde cada criança pode ser ela mesma.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="gap-2 font-semibold">
              <a href="#atividades">
                Conheça nossas Atividades
                <ArrowDown size={18} />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-border font-semibold text-foreground hover:border-primary hover:text-primary">
              <a href="#contato">Fale Conosco</a>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative"
        >
          <div className="overflow-hidden rounded-2xl border border-border/50 shadow-2xl shadow-primary/5">
            <img
              src="https://colo-de-mae-doacao.lovable.app/assets/hero-image-BVD0Gznx.jpg"
              alt="Crianças em atividades na Associação Colo de Mãe TEA"
              className="h-auto w-full object-cover"
              loading="eager"
            />
          </div>
          <div className="absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-2xl bg-primary/20 blur-3xl" />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
