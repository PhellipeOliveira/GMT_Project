"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";

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

type FormStatus = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [selecionados, setSelecionados] = useState<string[]>([]);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [shake, setShake] = useState(false);

  function toggle(servico: string) {
    setSelecionados((prev) =>
      prev.includes(servico)
        ? prev.filter((s) => s !== servico)
        : [...prev, servico],
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;

    if (!form.checkValidity()) {
      setShake(true);
      window.setTimeout(() => setShake(false), 400);
      form.reportValidity();
      return;
    }

    setStatus("submitting");
    const data = Object.fromEntries(new FormData(form).entries());

    await new Promise((r) => setTimeout(r, 800));
    console.log("Contacto (estático):", { ...data, servicos: selecionados });
    setStatus("success");
  }

  if (status === "success") {
    return (
      <div className="form-success rounded-lg border border-gmt-border bg-gmt-bg-alt p-8">
        <h3 className="type-h3">Mensagem enviada</h3>
        <p className="type-body mt-3 text-gmt-muted">
          Obrigado pelo contacto. Responderemos em breve.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex flex-col gap-5 ${shake ? "form-shake" : ""} ${status === "submitting" ? "form-fade-out form-fade-out--hidden" : ""}`}
    >
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
              className="input-gmt type-body peer w-full rounded-lg border border-gmt-border bg-gmt-bg-alt px-4 pb-2 pt-6 text-gmt-text outline-none focus:border-gmt-accent"
            />
            <label
              htmlFor={campo.id}
              className="type-body pointer-events-none absolute left-4 top-4 text-gmt-muted transition-all duration-200 peer-focus:top-2 peer-focus:text-[12px] peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[12px]"
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
                className="flex items-center gap-3 text-left opacity-80 transition-opacity duration-300 hover:opacity-100"
              >
                <span
                  className={`flex size-6 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
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
          className="input-gmt type-body peer w-full resize-none rounded-lg border border-gmt-border bg-gmt-bg-alt px-4 pb-2 pt-6 text-gmt-text outline-none focus:border-gmt-accent"
        />
        <label
          htmlFor="mensagem"
          className="type-body pointer-events-none absolute left-4 top-4 text-gmt-muted transition-all duration-200 peer-focus:top-2 peer-focus:text-[12px] peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[12px]"
        >
          Conte-nos sobre o seu projeto *
        </label>
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn-submit group mt-2"
      >
        {status === "submitting" ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            A enviar…
          </>
        ) : (
          <>
            Enviar mensagem
            <span className="transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </>
        )}
      </button>
    </form>
  );
}
