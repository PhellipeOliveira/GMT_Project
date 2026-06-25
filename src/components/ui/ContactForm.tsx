"use client";

import { useState } from "react";
import { Check } from "lucide-react";

const SERVICOS_INTERESSE = [
  "Automação & IA",
  "Criação de Conteúdo",
  "Publicidade Digital",
  "Branding & Estratégia",
  "Websites",
  "Inteligência Artificial",
  "Analytics & Otimização",
  "Pacotes de Marketing",
];

const CAMPOS = [
  { id: "nome", label: "Nome", type: "text", required: true },
  { id: "email", label: "Email", type: "email", required: true },
  { id: "telefone", label: "Telefone", type: "tel", required: false },
  { id: "empresa", label: "Empresa", type: "text", required: false },
] as const;

export function ContactForm() {
  const [selecionados, setSelecionados] = useState<string[]>([]);

  function toggle(servico: string) {
    setSelecionados((prev) =>
      prev.includes(servico)
        ? prev.filter((s) => s !== servico)
        : [...prev, servico],
    );
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    console.log("Contacto (estático):", { ...data, servicos: selecionados });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <input
        type="text"
        name="_hp_website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {CAMPOS.map((campo) => (
          <div key={campo.id} className="relative">
            <input
              id={campo.id}
              name={campo.id}
              type={campo.type}
              required={campo.required}
              placeholder=" "
              className="type-body peer w-full rounded-lg border border-gmt-border bg-gmt-bg-alt px-4 pb-2 pt-6 text-gmt-text outline-none transition-colors focus:border-gmt-accent"
            />
            <label
              htmlFor={campo.id}
              className="type-body pointer-events-none absolute left-4 top-4 text-gmt-muted transition-all peer-focus:top-2 peer-focus:text-[12px] peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[12px]"
            >
              {campo.label}
              {campo.required && " *"}
            </label>
          </div>
        ))}
      </div>

      <div className="mt-2">
        <h3 className="type-label text-gmt-muted">Serviços de interesse</h3>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          {SERVICOS_INTERESSE.map((servico) => {
            const ativo = selecionados.includes(servico);
            return (
              <button
                key={servico}
                type="button"
                onClick={() => toggle(servico)}
                aria-pressed={ativo}
                className="flex items-center gap-3 text-left"
              >
                <span
                  className={`flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
                    ativo
                      ? "border-gmt-accent bg-gmt-accent text-white"
                      : "border-gmt-border"
                  }`}
                >
                  {ativo && <Check size={12} />}
                </span>
                <span
                  className={`type-body transition-opacity ${
                    ativo ? "text-gmt-text opacity-100" : "text-gmt-muted opacity-70"
                  }`}
                >
                  {servico}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative mt-2">
        <textarea
          id="mensagem"
          name="mensagem"
          required
          rows={4}
          placeholder=" "
          className="type-body peer w-full resize-none rounded-lg border border-gmt-border bg-gmt-bg-alt px-4 pb-2 pt-6 text-gmt-text outline-none transition-colors focus:border-gmt-accent"
        />
        <label
          htmlFor="mensagem"
          className="type-body pointer-events-none absolute left-4 top-4 text-gmt-muted transition-all peer-focus:top-2 peer-focus:text-[12px] peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[12px]"
        >
          Conte-nos sobre o seu projeto *
        </label>
      </div>

      <button
        type="submit"
        className="type-body type-medium group mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-gmt-accent px-8 py-3 text-white transition-all duration-200 hover:scale-[1.02] hover:bg-gmt-accent-2"
      >
        Enviar mensagem
        <span className="transition-transform group-hover:translate-x-1">→</span>
      </button>
    </form>
  );
}
