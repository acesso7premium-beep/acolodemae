import { Instagram } from "lucide-react";
import { motion } from "framer-motion";

const FloatingInstagram = () => {
  return (
    <motion.a
      href="https://www.instagram.com/colodemaetea/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Siga no Instagram"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1, type: "spring" }}
      whileHover={{ scale: 1.1 }}
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-shadow hover:shadow-xl hover:shadow-primary/40"
    >
      <Instagram size={24} />
    </motion.a>
  );
};

export default FloatingInstagram;
