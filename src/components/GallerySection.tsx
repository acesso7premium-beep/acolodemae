import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const images = [
  { src: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&h=400&fit=crop", alt: "Criança em atividade lúdica" },
  { src: "https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=600&h=400&fit=crop", alt: "Oficina de arte" },
  { src: "https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=600&h=400&fit=crop", alt: "Atividade em grupo" },
  { src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop", alt: "Família reunida" },
  { src: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&h=400&fit=crop", alt: "Brincadeiras inclusivas" },
  { src: "https://images.unsplash.com/photo-1491013516836-7db643ee125a?w=600&h=400&fit=crop", alt: "Criança feliz" },
  { src: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=600&h=400&fit=crop", alt: "Evento cultural" },
  { src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=400&fit=crop", alt: "Voluntariado" },
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
          className="mb-16 text-center"
        >
          <span className="mb-3 inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            Galeria
          </span>
          <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
            Momentos que Inspiram
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4"
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
                src={images[selected].src.replace("w=600&h=400", "w=1200&h=800")}
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
