import { motion } from "framer-motion";
import img01 from "@/assets/team/01-fernanda-aguiar.png";
import img02 from "@/assets/team/02-andrea-ferrari.jpg";
import img03 from "@/assets/team/03-juliana-leonardo.jpeg";
import img04 from "@/assets/team/04-liliam-castro.jpeg";
import img05 from "@/assets/team/05-nicole-meireles.jpg";
import img06 from "@/assets/team/06-fabiana.jpeg";
import img07 from "@/assets/team/07-jhenifer-pereira.jpg";
import img08 from "@/assets/team/08-jennifer-dias.jpg";
import img09 from "@/assets/team/09-vanessa-cassiano.jpg";

const team = [
  { name: "Fernanda Aguiar", role: "Presidente", image: img01 },
  { name: "Andrea Ferrari", role: "Nutricionista", image: img02 },
  { name: "Juliana Leonardo Silva", role: "Psicopedagoga", image: img03 },
  { name: "Liliam Castro", role: "Terapeuta Ocupacional", image: img04 },
  { name: "Nicole Meireles", role: "Fonoaudióloga", image: img05 },
  { name: "Fabiana", role: "Arte Terapeuta", image: img06 },
  { name: "Jhenifer Pereira", role: "Terapeuta", image: img07 },
  { name: "Jennifer Dias", role: "Acolhimento", image: img08 },
  { name: "Vanessa Cassiano", role: "Acolhimento", image: img09 },
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
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
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
