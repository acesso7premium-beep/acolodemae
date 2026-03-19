import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail, Instagram, Youtube, Facebook } from "lucide-react";
import { toast } from "sonner";

const ContactSection = () => {
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast.success("Mensagem enviada com sucesso!");
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <section id="contato" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <span className="mb-3 inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            Contato
          </span>
          <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
            Fale Conosco
          </h2>
        </motion.div>

        <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2">
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-5 rounded-xl border border-border bg-card p-8"
          >
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input id="name" placeholder="Seu nome" required className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" placeholder="seu@email.com" required className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="message">Mensagem</Label>
              <Textarea id="message" placeholder="Escreva sua mensagem..." rows={5} required className="mt-1.5" />
            </div>
            <Button type="submit" size="lg" className="w-full font-semibold" disabled={sending}>
              {sending ? "Enviando..." : "Enviar Mensagem"}
            </Button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center gap-8"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <MapPin size={22} />
              </div>
              <div>
                <h4 className="font-heading font-bold text-foreground">Endereço</h4>
                <p className="text-sm text-muted-foreground">
                  Avenida Professor Joaquim Barreto, 40<br />
                  Centro — Cotia, SP
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Phone size={22} />
              </div>
              <div>
                <h4 className="font-heading font-bold text-foreground">Telefone / WhatsApp</h4>
                <p className="text-sm text-muted-foreground">(11) 91190-8336</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Mail size={22} />
              </div>
              <div>
                <h4 className="font-heading font-bold text-foreground">E-mail</h4>
                <p className="text-sm text-muted-foreground">colodemaetea25@gmail.com</p>
              </div>
            </div>

            <div className="mt-4 flex gap-4">
              <a
                href="https://www.instagram.com/colodemaetea/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                aria-label="YouTube"
              >
                <Youtube size={20} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
