import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "A Associação Colo de Mãe transformou a vida do meu filho. Ele encontrou um espaço de acolhimento onde se sente seguro e feliz. Sou eternamente grata por todo o carinho da equipe.",
    name: "Maria S.",
    relation: "Mãe do Pedro, 7 anos",
  },
  {
    quote:
      "Quando recebemos o diagnóstico, nos sentimos perdidos. A Colo de Mãe nos deu orientação, apoio emocional e mostrou que não estávamos sozinhos nessa jornada.",
    name: "Luciana R.",
    relation: "Mãe da Beatriz, 5 anos",
  },
  {
    quote:
      "As atividades em grupo fizeram uma diferença enorme no desenvolvimento social do meu filho. Ele está mais confiante e comunicativo. A equipe é incrível!",
    name: "Patrícia M.",
    relation: "Mãe do Gabriel, 9 anos",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const TestimonialsSection = () => {
  return (
    <section id="depoimentos" className="bg-muted/50 py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <span className="mb-3 inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            Depoimentos
          </span>
          <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
            Histórias que nos Inspiram
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Veja o que as famílias atendidas pela Associação Colo de Mãe têm a
            dizer sobre a experiência de acolhimento.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-8 md:grid-cols-3"
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              variants={item}
              className="relative rounded-xl border border-border bg-card p-8 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
            >
              <Quote className="mb-4 h-8 w-8 text-primary/30" />
              <p className="mb-6 leading-relaxed text-muted-foreground">
                "{t.quote}"
              </p>
              <div>
                <p className="font-heading font-bold text-foreground">
                  {t.name}
                </p>
                <p className="text-sm text-primary">{t.relation}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
