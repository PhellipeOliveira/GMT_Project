/**
 * Mensagem "flutuante" do launcher do agente, correlacionada com a área do site.
 *
 * v1: baseada na ROTA (pathname). É robusta e cobre todas as páginas.
 * Para granularidade por SEÇÃO (scroll), ver `data-agent-hint` em ChatWidget:
 * qualquer elemento com esse atributo, ao entrar no viewport, sobrepõe o label.
 */

export const DEFAULT_AGENT_LABEL = "Olá, posso ajudar?";

type RouteMessage = {
  match: (pathname: string) => boolean;
  label: string;
};

const ROUTE_MESSAGES: RouteMessage[] = [
  { match: (p) => p === "/", label: "Olá! Quer conhecer a GMT?" },
  { match: (p) => p.startsWith("/servicos"), label: "Dúvidas sobre os serviços?" },
  { match: (p) => p.startsWith("/portfolio"), label: "Quer um projeto assim?" },
  { match: (p) => p.startsWith("/sobre"), label: "Quer saber quem somos?" },
  { match: (p) => p.startsWith("/contacto"), label: "Posso agendar a sua reunião" },
];

export function getAgentLabelForPath(pathname: string | null | undefined): string {
  if (!pathname) return DEFAULT_AGENT_LABEL;
  const found = ROUTE_MESSAGES.find((r) => r.match(pathname));
  return found ? found.label : DEFAULT_AGENT_LABEL;
}
