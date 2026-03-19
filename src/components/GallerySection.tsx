import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const images = [
  { src: "https://colo-de-mae-doacao.lovable.app/assets/child-1-DCQDwOaZ.jpg", alt: "Criança em atividade musical" },
  { src: "https://colo-de-mae-doacao.lovable.app/assets/child-2-Z64jds-P.jpg", alt: "Criança tocando instrumento" },
  { src: "https://colo-de-mae-doacao.lovable.app/assets/child-3-rmmr0248.jpg", alt: "Criança com tambor" },
  { src: "https://colo-de-mae-doacao.lovable.app/assets/activity-1-W5QrYSBk.jpg", alt: "Grupo de crianças em oficina de música" },
  { src: "https://colo-de-mae-doacao.lovable.app/assets/activity-2-Dvm78u4g.jpg", alt: "Crianças aprendendo com instrumentos musicais" },
  { src: "https://colo-de-mae-doacao.lovable.app/assets/parent-photo-2-yVJ0-3j3.jpg", alt: "Grupo de mães em atividade de artesanato" },
  { src: "https://colo-de-mae-doacao.lovable.app/assets/parent-photo-3-dFX8cQ6e.jpg", alt: "Instrutora ajudando criança em atividade" },
  { src: "https://colo-de-mae-doacao.lovable.app/assets/parent-photo-4-4IJqgEdO.jpg", alt: "Mães e instrutores em oficina criativa" },
  { src: "https://colo-de-mae-doacao.lovable.app/assets/parent-photo-5-DNld9-BG.jpg", alt: "Mães participando de atividade artística" },
  { src: "https://colo-de-mae-doacao.lovable.app/assets/parent-photo-6-CeYHpZKQ.jpg", alt: "Momento afetuoso entre mãe e filhos" },
];

const GallerySection = () => {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <section id="galeria" className="bg-secondary/30 py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-6 text-center"
        >
          <span className="mb-3 inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            Galeria
          </span>
          <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
            Momentos que Inspiram
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Veja a alegria e o desenvolvimento das nossas crianças nas oficinas e atividades.
            Momentos de cuidado, aprendizado e conexão que fazem a diferença.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          className="grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-4"
        >
          {images.map((img, i) => (
            <motion.button
              key={i}
              variants={{ hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1 } }}
              whileHover={{ scale: 1.04 }}
              onClick={() => setSelected(i)}
              className="group overflow-hidden rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label={`Ver ${img.alt}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-110 md:h-52"
                loading="lazy"
              />
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 p-4 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-h-[85vh] max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute -right-2 -top-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-card text-foreground shadow-lg transition-colors hover:bg-primary hover:text-primary-foreground"
                aria-label="Fechar"
              >
                <X size={20} />
              </button>
              <img
                src={images[selected].src}
                alt={images[selected].alt}
                className="max-h-[80vh] w-auto rounded-xl shadow-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default GallerySection;
