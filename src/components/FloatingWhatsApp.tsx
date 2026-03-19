import { motion } from "framer-motion";
import whatsappLogo from "@/assets/logo_whatsapp.png";

const FloatingWhatsApp = () => {
  return (
    <motion.a
      href="https://wa.me/5511969772347"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Fale conosco pelo WhatsApp"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1.2, type: "spring" }}
      whileHover={{ scale: 1.1 }}
      className="fixed bottom-6 left-6 z-40 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-shadow hover:shadow-xl"
    >
      <img src={whatsappLogo} alt="WhatsApp" className="h-14 w-14 rounded-full" />
    </motion.a>
  );
};

export default FloatingWhatsApp;
