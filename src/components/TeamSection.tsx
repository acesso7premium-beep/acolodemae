import { motion } from "framer-motion";
import img01 from "@/assets/team/01-fernanda-aguiar.png";
import img02 from "@/assets/team/02-beatriz-isabelle.png";
import img03 from "@/assets/team/03-andrea-ferrari.png";
import img04 from "@/assets/team/04-joedson-paulo.png";
import img05 from "@/assets/team/05-juliana-leonardo.png";
import img05_1 from "@/assets/team/05.1-nileide.png";
import img06 from "@/assets/team/06-liliam-castro.png";
import img07 from "@/assets/team/07-nicole-meireles.png";
import img08 from "@/assets/team/08-fabiana.png";
import img09 from "@/assets/team/09-jhenifer-pereira.png";
import img10 from "@/assets/team/10-jennifer-dias.png";
import img11 from "@/assets/team/11-vanessa-cassiano.png";
import img12 from "@/assets/team/12-tatiane-pereira.png";

const team = [
  { name: "Fernanda Aguiar", role: "Presidente", image: img01 },
  { name: "Beatriz Isabelle dos Reis", role: "Psicóloga TCC", image: img02 },
  { name: "Andrea Ferrari", role: "Nutricionista", image: img03 },
  { name: "Joedson Paulo", role: "Coordenador e Musicoterapeuta", image: img04 },
  { name: "Juliana Leonardo Silva", role: "NeuroPsicoPedagoga", image: img05 },
  { name: "Nileide", role: "Neuropsicóloga", image: img05_1 },
  { name: "Liliam Castro", role: "Terapeuta Ocupacional", image: img06 },
  { name: "Nicole Meireles", role: "Fonoaudióloga", image: img07 },
  { name: "Fabiana", role: "Arte Terapeuta", image: img08 },
  { name: "Jhenifer Pereira", role: "Terapeuta", image: img09 },
  { name: "Jennifer Dias", role: "Acolhimento", image: img10 },
  { name: "Vanessa Cassiano", role: "Acolhimento", image: img11 },
  { name: "Tatiane Pereira Lopes", role: "Acolhimento", image: img12 },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
};

const TeamSection = () => {
  return (
    <section id="equipe" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <span className="mb-3 inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            Nossa Equipe
          </span>
          <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
            Quem Faz Acontecer
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Uma equipe dedicada e apaixonada pelo acolhimento e inclusão de famílias neurodivergentes.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {team.map((member) => (
            <motion.div
              key={member.name}
              variants={item}
              whileHover={{ scale: 1.03 }}
              className="group overflow-hidden rounded-xl border border-border bg-card text-center transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="h-64 w-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              <div className="p-5">
                <h3 className="font-heading text-lg font-bold text-foreground">
                  {member.name}
                </h3>
                <p className="mt-1 text-sm text-primary">{member.role}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TeamSection;
