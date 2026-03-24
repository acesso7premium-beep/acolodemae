import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";
import whatsappLogo from "@/assets/logo_whatsapp.png";

const WHATSAPP_NUMBER = "5511962206252";

const FloatingWhatsApp = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleSend = () => {
    const text = message.trim() || "Olá! Gostaria de mais informações.";
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`,
      "_blank"
    );
    setMessage("");
    setOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="mb-2 w-80 overflow-hidden rounded-2xl shadow-2xl border border-border"
          >
            {/* Header */}
            <div className="flex items-center gap-3 bg-[#075E54] px-4 py-3">
              <img src={whatsappLogo} alt="" className="h-10 w-10 rounded-full" />
              <div className="flex-1">
                <p className="text-sm font-bold text-white">Clara — Colo de Mãe</p>
                <p className="text-xs text-white/70">Online 24h</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Fechar"
              >
                <X size={20} />
              </button>
            </div>

            {/* Chat body */}
            <div className="bg-[#ECE5DD] p-4">
              <div className="inline-block max-w-[85%] rounded-lg rounded-tl-none bg-white px-3 py-2 shadow-sm">
                <p className="text-sm text-gray-800">
                  Olá! 👋 Como podemos ajudar você? Envie sua mensagem e
                  responderemos o mais rápido possível.
                </p>
                <span className="mt-1 block text-right text-[10px] text-gray-400">
                  Agora
                </span>
              </div>
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 bg-[#F0F0F0] px-3 py-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Digite sua mensagem..."
                className="flex-1 rounded-full border-none bg-white px-4 py-2 text-sm text-gray-800 outline-none placeholder:text-gray-400"
              />
              <button
                onClick={handleSend}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-white transition-colors hover:bg-[#20bd5a]"
                aria-label="Enviar mensagem"
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen(!open)}
        aria-label="Fale conosco pelo WhatsApp"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.2, type: "spring" }}
        whileHover={{ scale: 1.1 }}
        className="flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-shadow hover:shadow-xl"
      >
        <img src={whatsappLogo} alt="WhatsApp" className="h-14 w-14 rounded-full" />
      </motion.button>
    </div>
  );
};

export default FloatingWhatsApp;
