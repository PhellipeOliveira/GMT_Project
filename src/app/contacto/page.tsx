import type { Metadata } from "next";
import { ContactForm } from "@/components/ui/ContactForm";
import { GMTLightFooter } from "@/components/ui/GMTLightFooter";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { RevealSequence } from "@/components/ui/reveal-sequence";
import { SectionLabel } from "@/components/ui/SectionLabel";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Agende uma reunião gratuita e sem compromisso com a GMT.",
};

export default function ContactoPage() {
  return (
    <>
      <section className="not-prose px-5 pt-28 pb-12 md:px-[5vw] md:pt-[11vw] md:pb-16">
        <RevealSequence>
          <SectionLabel variant="title" tone="on-light" className="block text-left">
            Contacto
          </SectionLabel>
          <RevealOnScroll as="h1" className="type-h2 mt-6 max-w-3xl">
            Vamos conversar
          </RevealOnScroll>
          <RevealOnScroll as="p" className="type-body-lg mt-8 max-w-2xl text-gmt-muted">
            Agende uma reunião gratuita e sem compromisso. Conte-nos sobre o seu
            negócio e desenhamos o plano certo para si.
          </RevealOnScroll>
        </RevealSequence>
      </section>

      <section className="not-prose border-t border-gmt-border px-5 py-12 md:px-[5vw] md:py-16">
        <RevealOnScroll variant="media">
          <div className="mx-auto max-w-2xl">
            <ContactForm />
          </div>
        </RevealOnScroll>
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

      <GMTLightFooter />
    </>
  );
}
