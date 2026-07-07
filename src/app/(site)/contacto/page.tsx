import type { Metadata } from "next";
import { ContactForm } from "@/components/ui/ContactForm";
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
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-[6vw]">
          <div className="md:sticky md:top-28 md:self-start">
            <RevealSequence>
              <SectionLabel variant="title" tone="on-light" className="block text-left">
                Conte-nos o essencial
              </SectionLabel>
              <RevealOnScroll as="p" className="type-body-lg mt-6 max-w-md text-gmt-muted">
                Quanto mais soubermos sobre o seu negócio e objetivos, mais
                concreta será a nossa resposta. Preencha o formulário — respondemos
                em 24 horas.
              </RevealOnScroll>
              <RevealOnScroll className="mt-8">
                <a
                  href="tel:+351913628211"
                  className="type-label inline-flex items-center gap-2 text-gmt-text underline-offset-4 hover:underline"
                >
                  Prefere ligar? +351 913 628 211
                </a>
              </RevealOnScroll>
            </RevealSequence>
          </div>

          <div>
            <RevealOnScroll variant="media">
              <ContactForm />
            </RevealOnScroll>
          </div>
        </div>
      </section>
    </>
  );
}
