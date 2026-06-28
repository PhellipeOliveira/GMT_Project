import type { Metadata } from "next";
import { Mail, Phone, Link2, MapPin } from "lucide-react";
import { ContactForm } from "@/components/ui/ContactForm";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { RevealSequence } from "@/components/ui/reveal-sequence";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Agende uma reunião gratuita e sem compromisso com a GMT. Email, WhatsApp e LinkedIn. Lisboa, Portugal.",
};

const CANAIS = [
  {
    icone: Mail,
    label: "Email",
    valor: "contato@phellipeoliveira.org",
    href: "mailto:contato@phellipeoliveira.org",
  },
  {
    icone: Phone,
    label: "WhatsApp / Telefone",
    valor: "+351 913 628 211",
    href: "tel:+351913628211",
  },
  {
    icone: Link2,
    label: "LinkedIn",
    valor: "linkedin.com/in/phellipeoliveira-org",
    href: "https://linkedin.com/in/phellipeoliveira-org/",
  },
  {
    icone: MapPin,
    label: "Localização",
    valor: "Lisboa, Portugal",
    href: undefined,
  },
];

export default function ContactoPage() {
  return (
    <>
      <section className="flex flex-col gap-12 px-5 pb-16 pt-28 md:min-h-[70vh] md:flex-row md:gap-[5vw] md:px-[5vw] md:pt-[6vw]">
      <div className="flex flex-col justify-between md:w-2/5">
        <div>
          <RevealSequence>
            <RevealOnScroll as="p" className="type-label text-gmt-muted">
              Contacto
            </RevealOnScroll>
            <RevealOnScroll as="h1" className="type-h2 mt-4">
              Vamos conversar
            </RevealOnScroll>
            <RevealOnScroll as="p" className="type-body-lg mt-6 max-w-md text-gmt-muted">
              Agende uma reunião gratuita e sem compromisso. Conte-nos sobre o seu
              negócio e desenhamos o plano certo para si.
            </RevealOnScroll>
          </RevealSequence>
        </div>

        <ul className="mt-12 flex flex-col gap-6">
          {CANAIS.map((canal, i) => {
            const Icone = canal.icone;
            const conteudo = (
              <span className="flex items-start gap-4">
                <span className="rounded-lg border border-gmt-border p-2.5 text-gmt-text">
                  <Icone size={18} strokeWidth={1.5} />
                </span>
                <span>
                  <span className="type-label block text-gmt-muted">
                    {canal.label}
                  </span>
                  <span className="type-body mt-1 block text-gmt-text">
                    {canal.valor}
                  </span>
                </span>
              </span>
            );
            return (
              <li key={canal.label}>
                <RevealOnScroll variant="media" delay={i * 0.08}>
                  {canal.href ? (
                    <a
                      href={canal.href}
                      target={canal.href.startsWith("http") ? "_blank" : undefined}
                      rel={
                        canal.href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="hover:opacity-80"
                    >
                      {conteudo}
                    </a>
                  ) : (
                    conteudo
                  )}
                </RevealOnScroll>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="md:w-3/5">
        <RevealOnScroll variant="media" delay={0.08}>
          <ContactForm />
        </RevealOnScroll>
      </div>
      </section>

      <section className="section-cta px-5 py-20 text-center md:px-[5vw] md:py-[8vw]">
        <RevealSequence>
          <RevealOnScroll as="h2" className="type-h3 mx-auto max-w-2xl">
            Preferimos falar pessoalmente?
          </RevealOnScroll>
          <RevealOnScroll as="p" className="type-body mt-4 text-gmt-muted">
            Agende uma reunião gratuita — respondemos em 24 horas.
          </RevealOnScroll>
          <RevealOnScroll variant="media">
            <a href="tel:+351913628211" className="btn-submit mt-8">
            Ligar agora
          </a>
          </RevealOnScroll>
        </RevealSequence>
      </section>
    </>
  );
}
