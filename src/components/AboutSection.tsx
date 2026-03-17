import { motion } from "framer-motion";
import { Heart, Eye, Star } from "lucide-react";

const cards = [
  {
    icon: Heart,
    title: "Missão",
    text: "Promover o acolhimento, a inclusão e o desenvolvimento integral de crianças e adolescentes com Transtorno do Espectro Autista e suas famílias, por meio de atividades socioeducativas, culturais e terapêuticas.",
  },
  {
    icon: Eye,
    title: "Visão",
    text: "Ser referência em inclusão e acolhimento para famílias neurodivergentes, contribuindo para uma sociedade mais justa, empática e diversa.",
  },
  {
    icon: Star,
    title: "Valores",
    text: "Acolhimento, empatia, respeito à diversidade, protagonismo familiar, transparência e compromisso com o desenvolvimento humano.",
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
            A Associação Colo de Mãe nasceu do desejo de mães que buscavam acolhimento e
            suporte para suas famílias. Hoje, somos uma rede de apoio que transforma vidas
            por meio da inclusão e do protagonismo.
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
