import { motion } from "framer-motion";
import { Puzzle, Users, HandHeart, Package } from "lucide-react";

const activities = [
  {
    icon: Puzzle,
    title: "Oficinas de Desenvolvimento",
    description:
      "Música, arte e atividades sensoriais que estimulam o desenvolvimento e a expressão das crianças.",
  },
  {
    icon: Users,
    title: "Apoio às Famílias",
    description:
      "Orientação, acolhimento e suporte emocional para mães, pais e familiares em todas as fases.",
  },
  {
    icon: HandHeart,
    title: "Inclusão Social",
    description:
      "Eventos, encontros e atividades que promovem a integração das crianças na comunidade.",
  },
  {
    icon: Package,
    title: "Necessidades Básicas",
    description:
      "Lanches nutritivos, transporte e materiais pedagógicos para garantir o bem-estar das crianças.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const ActivitiesSection = () => {
  return (
    <section id="atividades" className="bg-secondary/30 py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <span className="mb-3 inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            O Que Fazemos
          </span>
          <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
            Nossas Atividades
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Sua contribuição faz diferença real na vida das nossas crianças e suas famílias.
            Desenvolvemos projetos que acolhem, incluem e transformam.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {activities.map((act) => (
            <motion.div
              key={act.title}
              variants={item}
              whileHover={{ y: -6 }}
              className="group cursor-pointer rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <act.icon size={28} />
              </div>
              <h3 className="mb-2 font-heading text-lg font-bold text-foreground">
                {act.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {act.description}
              </p>
              <span className="mt-4 inline-block text-sm font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                Saiba mais →
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ActivitiesSection;
