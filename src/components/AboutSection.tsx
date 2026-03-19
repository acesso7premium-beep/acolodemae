import { motion } from "framer-motion";
import { Heart, Eye, Star } from "lucide-react";

const cards = [
  {
    icon: Heart,
    title: "Nossa Missão",
    text: "Promover inclusão, desenvolvimento e qualidade de vida para crianças com TEA através de oficinas, apoio familiar e amor incondicional.",
  },
  {
    icon: Eye,
    title: "Nossa Visão",
    text: "Ser referência em acolhimento e desenvolvimento de crianças com TEA, construindo uma sociedade mais inclusiva e empática.",
  },
  {
    icon: Star,
    title: "Nossos Valores",
    text: "Amor, respeito, inclusão, empatia e comprometimento com cada criança e família que passa por nossas portas.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const AboutSection = () => {
  return (
    <section id="sobre" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <span className="mb-3 inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            Quem Somos
          </span>
          <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
            Sobre a Associação
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            A Associação Colo de Mãe TEA nasceu do sonho de proporcionar acolhimento,
            desenvolvimento e inclusão para crianças com Transtorno do Espectro Autista e
            suas famílias. Com amor, dedicação e respeito, criamos um espaço seguro onde
            cada criança pode ser ela mesma, desenvolver suas habilidades e sentir-se
            verdadeiramente pertencente.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-6 md:grid-cols-3"
        >
          {cards.map((card) => (
            <motion.div
              key={card.title}
              variants={item}
              className="group rounded-xl border border-border bg-card p-8 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <card.icon size={24} />
              </div>
              <h3 className="mb-2 font-heading text-xl font-bold text-foreground">
                {card.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {card.text}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
