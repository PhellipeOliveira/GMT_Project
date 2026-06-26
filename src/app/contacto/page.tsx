import type { Metadata } from "next";
import { Mail, Phone, Link2, MapPin } from "lucide-react";
import { ContactForm } from "@/components/ui/ContactForm";
import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import { RevealText } from "@/components/ui/RevealText";

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
    <section className="relative flex flex-col gap-12 overflow-hidden px-5 pb-16 pt-28 md:min-h-screen md:flex-row md:gap-[5vw] md:px-[5vw] md:pt-[6vw]">
      <PlaceholderMedia
        id="CON-01"
        descricao="fundo decorativo · 16:9"
        cor="#0a0f1e"
        className="pointer-events-none absolute inset-0 opacity-30"
        sizes="100vw"
      />
      <div className="pointer-events-none absolute inset-0 bg-gmt-bg/70" />

      <div className="relative z-10 flex flex-col justify-between md:w-2/5">
        <div>
          <p className="type-label text-gmt-muted">Contacto</p>
          <RevealText as="h1" className="type-h2 mt-4 text-[#c7c7c7]">
            Vamos conversar
          </RevealText>
          <RevealText as="p" className="type-body-lg mt-6 max-w-md text-gmt-muted">
            Agende uma reunião gratuita e sem compromisso. Conte-nos sobre o seu
            negócio e desenhamos o plano certo para si.
          </RevealText>
        </div>

        <ul className="mt-12 flex flex-col gap-6">
          {CANAIS.map((canal) => {
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
              </li>
            );
          })}
        </ul>
      </div>

      <div className="relative z-10 md:w-3/5">
        <ContactForm />
      </div>
    </section>
  );
}
