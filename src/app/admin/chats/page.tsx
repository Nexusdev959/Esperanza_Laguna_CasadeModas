"use client";

import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { MessagesSquare, Search, Send, Bot, BotOff, ArrowLeft, FileText, Check, CheckCheck, AlertCircle, User } from "lucide-react";
import { isAxiosError } from "axios";
import { api, fetcher } from "@/lib/api";
import { getSocket } from "@/lib/socket";
import { formatCOP } from "@/lib/price";
import { useNotification } from "@/components/ui/notification-provider";

// Contrato con el backend: ver "CRM de WhatsApp" en TAREAS_USUARIO.md (Pilypage)
type Message = {
  id: string;
  direction: "IN" | "OUT";
  author?: string | null; // BOT | nombre del asesor
  type: string;
  body?: string | null;
  mediaUrl?: string | null; // URL firmada
  status?: "sent" | "delivered" | "read" | "failed" | null;
  createdAt: string;
};
type Chat = {
  phone: string; // Clave del chat: teléfono o, si el cliente usa nombre de usuario, su BSUID de WhatsApp ("CO.123...")
  bsuid?: string | null;
  username?: string | null;
  name?: string | null;
  status: "OPEN" | "PENDING" | "CLOSED";
  unread: number;
  botPausedUntil?: string | null;
  lastInboundAt?: string | null;
  notes?: string | null;
  user?: { id: string; name: string; email: string } | null;
  lastMessage?: Message | null;
};
type ChatDetail = {
  contact: Chat;
  messages: Message[];
  orders: { id: string; status: string; totalAmount: number; paidAmount: number; createdAt: string }[];
};

const STATUS_FILTERS = [
  { key: "OPEN", label: "Abiertos" },
  { key: "PENDING", label: "En espera" },
  { key: "CLOSED", label: "Cerrados" },
] as const;

const ORDER_STATUS: Record<string, string> = {
  PENDING_ADVANCE: "Pendiente de abono",
  IN_PREPARATION: "En preparación",
  IN_CONFECTION: "En confección",
  QUALITY_CONTROL: "Control de calidad",
  PENDING_FINAL_PAY: "Pendiente de pago final",
  READY_TO_SHIP: "Listo para envío",
  SHIPPED: "Enviado",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
};

const DAY = 24 * 3600_000;
// Meta solo permite texto libre hasta 24 h después del último mensaje del cliente; después, plantilla
const windowOpen = (c?: Chat | null) => !!c?.lastInboundAt && Date.now() - new Date(c.lastInboundAt).getTime() < DAY;
const botPaused = (c?: Chat | null) => !!c?.botPausedUntil && new Date(c.botPausedUntil).getTime() > Date.now();
const hasPhone = (c: Chat) => /^\d{8,15}$/.test(c.phone);
const displayName = (c: Chat) => c.user?.name || c.name || (c.username && `@${c.username}`) || (hasPhone(c) ? `+${c.phone}` : "Usuario de WhatsApp");
const contactLine = (c: Chat) => (hasPhone(c) ? `+${c.phone}` : [c.username && `@${c.username}`, "Sin número (usuario de WhatsApp)"].filter(Boolean).join(" · "));
// El BSUID lleva punto y letras: siempre codificado en la URL
const chatUrl = (key: string, rest = "") => `/whatsapp/chats/${encodeURIComponent(key)}${rest}`;
const time = (iso: string) => {
  const d = new Date(iso);
  return Date.now() - d.getTime() < DAY
    ? d.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })
    : d.toLocaleDateString("es-CO", { day: "2-digit", month: "short" });
};
const apiError = (e: unknown, fallback: string): string => (isAxiosError(e) && e.response?.data?.error) || fallback;
const preview = (m?: Message | null) => {
  if (!m) return "";
  if (m.body) return m.body;
  return m.type === "image" ? "Imagen" : m.type === "document" ? "Documento" : m.type === "order" ? "Pedido del catálogo" : "Mensaje";
};

export default function AdminChatsPage() {
  const { showNotification } = useNotification();
  const [filter, setFilter] = useState<(typeof STATUS_FILTERS)[number]["key"]>("OPEN");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [template, setTemplate] = useState("");
  const [notesDraft, setNotesDraft] = useState<string | null>(null); // null = sin editar, se muestra lo guardado
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // El socket es el aviso principal; el refresco cada 30 s cubre una conexión caída
  const chats = useSWR<Chat[]>(`/whatsapp/chats?status=${filter}`, fetcher, { refreshInterval: 30_000 });
  const detail = useSWR<ChatDetail>(selected ? chatUrl(selected) : null, fetcher, {
    refreshInterval: 30_000,
    onError: (e) => console.error("[Chats] No se pudo cargar el chat", selected, e),
  });
  const templates = useSWR<{ name: string; label: string }[]>("/whatsapp/templates", fetcher);
  const contact = detail.data?.contact;
  const { mutate: refreshChats } = chats;
  const { mutate: refreshDetail } = detail;

  useEffect(() => {
    const socket = getSocket();
    socket.emit("join_whatsapp_room");
    const onMessage = ({ phone }: { phone: string }) => {
      refreshChats();
      if (phone === selected) refreshDetail();
    };
    socket.on("whatsapp_message", onMessage);
    return () => { socket.off("whatsapp_message", onMessage); };
  }, [selected, refreshChats, refreshDetail]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ block: "end" }); }, [detail.data?.messages.length]);

  const patch = async (data: Partial<{ status: Chat["status"]; botPaused: boolean; notes: string }>) => {
    try {
      await api.patch(chatUrl(selected!), data);
      detail.mutate();
      chats.mutate();
    } catch (e) {
      showNotification(apiError(e, "No se pudo actualizar el chat"), "error");
    }
  };

  const send = async () => {
    if (!selected || sending) return;
    const open = windowOpen(contact);
    if (open ? !text.trim() : !template) return;
    setSending(true);
    setSendError(null);
    try {
      if (open) await api.post(chatUrl(selected, "/messages"), { text: text.trim() });
      else await api.post(chatUrl(selected, "/template"), { name: template });
      setText("");
      setTemplate("");
      detail.mutate();
      chats.mutate();
    } catch (e) {
      console.error("[Chats] Envío fallido", e);
      const msg = apiError(e, "No se pudo enviar el mensaje");
      setSendError(msg);
      showNotification(msg, "error");
      // 409 = se cerró la ventana de 24 h: recargar muestra las plantillas
      if (isAxiosError(e) && e.response?.status === 409) detail.mutate();
    } finally {
      setSending(false);
    }
  };

  const list = (chats.data ?? []).filter((c) => {
    const q = query.trim().toLowerCase();
    const digits = q.replace(/\D/g, "");
    return !q || displayName(c).toLowerCase().includes(q) || (!!digits && hasPhone(c) && c.phone.includes(digits)) || (!!c.username && c.username.toLowerCase().includes(q));
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 h-[calc(100vh-2rem)] flex flex-col">
      <div className="shrink-0">
        <h1 className="text-2xl font-sans font-semibold tracking-tight text-[var(--foreground)] flex items-center gap-2">
          <MessagesSquare className="w-6 h-6 text-primary" /> Chats de WhatsApp
        </h1>
        <p className="text-sm text-[var(--muted)]">Atiende a los clientes y revisa sus pedidos en un solo lugar.</p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[320px_1fr] xl:grid-cols-[320px_1fr_300px] gap-6 min-h-0">
        {/* Lista de chats */}
        <div className={`${selected ? "hidden lg:flex" : "flex"} bg-[var(--surface)] rounded-2xl border border-[var(--border-color)] shadow-sm flex-col overflow-hidden`}>
          <div className="p-4 border-b border-[var(--border-color)] space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por nombre o teléfono..."
                aria-label="Buscar chats"
                className="w-full pl-9 pr-4 py-2 bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
            <div className="flex gap-2">
              {STATUS_FILTERS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${filter === f.key ? "bg-[var(--foreground)] text-[var(--background)]" : "bg-[var(--background)] text-[var(--muted)] border border-[var(--border-color)] hover:text-[var(--foreground)]"}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {chats.error ? (
              <div className="p-8 text-center text-[var(--muted)] text-sm">No se pudieron cargar los chats.</div>
            ) : !chats.data ? (
              <div className="p-8 text-center text-[var(--muted)] text-sm">Cargando chats...</div>
            ) : list.length === 0 ? (
              <div className="p-8 text-center text-[var(--muted)] text-sm">No hay chats en esta categoría.</div>
            ) : (
              list.map((c) => (
                <button
                  key={c.phone}
                  onClick={() => { setSelected(c.phone); setNotesDraft(null); setSendError(null); }}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${selected === c.phone ? "border-primary bg-primary/5" : "border-transparent hover:bg-[var(--background)]"}`}
                >
                  <div className="flex justify-between items-center gap-2">
                    <span className="font-medium text-sm text-[var(--foreground)] truncate">{displayName(c)}</span>
                    {c.lastMessage && <span className="text-[10px] text-[var(--muted)] shrink-0">{time(c.lastMessage.createdAt)}</span>}
                  </div>
                  <div className="flex justify-between items-center gap-2 mt-1">
                    <p className="text-xs text-[var(--muted)] truncate">
                      {c.lastMessage?.direction === "OUT" && (c.lastMessage.author === "BOT" ? "Bot: " : "Tú: ")}
                      {preview(c.lastMessage)}
                    </p>
                    <div className="flex items-center gap-1 shrink-0">
                      {botPaused(c) && <BotOff className="w-3.5 h-3.5 text-amber-600" aria-label="Bot en pausa" />}
                      {c.unread > 0 && (
                        <span className="min-w-5 h-5 px-1.5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">{c.unread}</span>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Conversación */}
        <div className={`${selected ? "flex" : "hidden lg:flex"} bg-[var(--surface)] rounded-2xl border border-[var(--border-color)] shadow-sm flex-col overflow-hidden min-h-0`}>
          {!selected ? (
            <div className="flex flex-col items-center justify-center h-full text-[var(--muted)] space-y-4">
              <MessagesSquare className="w-16 h-16 opacity-20" />
              <p>Selecciona un chat para ver la conversación.</p>
            </div>
          ) : !contact ? (
            <div className="flex items-center justify-center h-full text-sm text-[var(--muted)]">{detail.error ? (
              <div className="text-center space-y-2 px-6">
                <p className="text-[var(--foreground)]">No se pudo abrir este chat: {apiError(detail.error, isAxiosError(detail.error) && !detail.error.response ? "no hay conexión con el servidor" : "error desconocido")}.</p>
                <button onClick={() => detail.mutate()} className="text-primary underline text-xs">Reintentar</button>
              </div>
            ) : "Cargando conversación..."}</div>
          ) : (
            <>
              <div className="p-4 border-b border-[var(--border-color)] flex flex-wrap items-center gap-3">
                <button onClick={() => setSelected(null)} className="lg:hidden p-1 -ml-1 text-[var(--muted)]" aria-label="Volver a la lista">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="min-w-[10rem] flex-1">
                  <h2 className="font-semibold text-[var(--foreground)] truncate">{displayName(contact)}</h2>
                  <p className="text-xs text-[var(--muted)]">{contactLine(contact)}</p>
                </div>
                {botPaused(contact) ? (
                  <>
                    <span className="flex items-center gap-1.5 text-xs font-medium text-amber-600"><BotOff className="w-3.5 h-3.5" /> Atención humana</span>
                    <button
                      onClick={() => patch({ botPaused: false })}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-primary/40 text-primary hover:bg-primary/10 transition-colors"
                    >
                      <Bot className="w-3.5 h-3.5" /> Devolver al bot
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => patch({ botPaused: true })}
                    title="El bot deja de responder mientras atiendes (también se pausa al enviar un mensaje)"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-[var(--border-color)] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                  >
                    <Bot className="w-3.5 h-3.5" /> Bot activo · Pausar
                  </button>
                )}
                <select
                  value={contact.status}
                  onChange={(e) => patch({ status: e.target.value as Chat["status"] })}
                  aria-label="Estado del chat"
                  className="px-3 py-1.5 bg-[var(--background)] border border-[var(--border-color)] rounded-lg text-xs outline-none"
                >
                  {STATUS_FILTERS.map((f) => <option key={f.key} value={f.key}>{f.label}</option>)}
                </select>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-[var(--background)]">
                {detail.data!.messages.map((m) => (
                  <div key={m.id} className={`flex ${m.direction === "OUT" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm ${m.direction === "OUT" ? (m.author === "BOT" ? "bg-[var(--surface)] border border-primary/30" : "bg-primary text-white") : "bg-[var(--surface)] border border-[var(--border-color)]"}`}>
                      {m.direction === "OUT" && m.author && (
                        <p className={`text-[10px] font-semibold mb-0.5 ${m.author === "BOT" ? "text-primary" : "text-white/80"}`}>{m.author === "BOT" ? "Bot" : m.author}</p>
                      )}
                      {m.type === "image" && m.mediaUrl && (
                        <a href={m.mediaUrl} target="_blank" rel="noopener noreferrer">
                          <img src={m.mediaUrl} alt="Imagen enviada por WhatsApp" className="rounded-lg max-h-64 mb-1" />
                        </a>
                      )}
                      {m.type === "document" && m.mediaUrl && (
                        <a href={m.mediaUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 underline mb-1">
                          <FileText className="w-4 h-4" /> Ver documento
                        </a>
                      )}
                      {(m.body || !m.mediaUrl) && <p className="whitespace-pre-line break-words">{m.body || preview(m)}</p>}
                      <div className={`flex items-center justify-end gap-1 mt-0.5 text-[10px] ${m.direction === "OUT" && m.author !== "BOT" ? "text-white/70" : "text-[var(--muted)]"}`}>
                        {time(m.createdAt)}
                        {m.direction === "OUT" && (m.status === "failed" ? <AlertCircle className="w-3 h-3 text-red-500" aria-label="No entregado" />
                          : m.status === "read" ? <CheckCheck className="w-3 h-3" aria-label="Leído" />
                          : m.status === "delivered" ? <CheckCheck className="w-3 h-3 opacity-60" aria-label="Entregado" />
                          : <Check className="w-3 h-3 opacity-60" aria-label="Enviado" />)}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              <div className="p-3 border-t border-[var(--border-color)]">
                {sendError && (
                  <p role="alert" className="mb-2 flex items-start gap-1.5 text-xs text-red-600"><AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {sendError}</p>
                )}
                {windowOpen(contact) ? (
                  <div className="flex gap-2 items-end">
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                      placeholder="Escribe una respuesta... (Shift+Enter para nueva línea)"
                      aria-label="Mensaje"
                      rows={1}
                      className="flex-1 max-h-32 p-3 bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
                    />
                    <button onClick={send} disabled={sending || !text.trim()} aria-label="Enviar" className="p-3 bg-primary text-white rounded-xl hover:bg-primary/90 disabled:opacity-50">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p role="status" className="text-xs text-amber-700 bg-amber-500/10 border border-amber-500/30 rounded-lg p-2">Pasaron más de 24 h desde el último mensaje del cliente: WhatsApp no permite texto libre, solo plantillas aprobadas. Cuando el cliente vuelva a escribir podrás responderle normalmente.</p>
                    {templates.data?.length ? (
                      <div className="flex gap-2">
                        <select
                          value={template}
                          onChange={(e) => setTemplate(e.target.value)}
                          aria-label="Plantilla"
                          className="flex-1 px-3 py-2 bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-sm outline-none"
                        >
                          <option value="">Elige una plantilla...</option>
                          {templates.data.map((t) => <option key={t.name} value={t.name}>{t.label}</option>)}
                        </select>
                        <button onClick={send} disabled={sending || !template} className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium disabled:opacity-50">Enviar</button>
                      </div>
                    ) : (
                      <p className="text-xs text-amber-600">Aún no hay plantillas configuradas.</p>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Ficha del cliente */}
        {contact && (
          <div className="hidden xl:flex bg-[var(--surface)] rounded-2xl border border-[var(--border-color)] shadow-sm flex-col overflow-y-auto p-5 space-y-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-2 flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Cliente</h3>
              {contact.user ? (
                <div className="text-sm">
                  <p className="font-medium text-[var(--foreground)]">{contact.user.name}</p>
                  <p className="text-[var(--muted)] break-all">{contact.user.email}</p>
                </div>
              ) : (
                <p className="text-sm text-[var(--muted)]">{hasPhone(contact) ? "Este número no está vinculado a ninguna cuenta." : "Llegó sin número de teléfono (usa nombre de usuario de WhatsApp): no se puede vincular a una cuenta."}</p>
              )}
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-2">Pedidos</h3>
              {detail.data!.orders.length === 0 ? (
                <p className="text-sm text-[var(--muted)]">Sin pedidos.</p>
              ) : (
                <ul className="space-y-2">
                  {detail.data!.orders.map((o) => (
                    <li key={o.id} className="p-3 rounded-xl border border-[var(--border-color)] text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="font-bold text-[var(--foreground)]">#{o.id.slice(0, 8).toUpperCase()}</span>
                        <span className="text-[var(--muted)]">{new Date(o.createdAt).toLocaleDateString("es-CO")}</span>
                      </div>
                      <p className="text-[var(--muted)]">{ORDER_STATUS[o.status] ?? o.status}</p>
                      <p className="text-[var(--foreground)]">{formatCOP(Number(o.paidAmount))} de {formatCOP(Number(o.totalAmount))}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-2">Notas internas</h3>
              <textarea
                value={notesDraft ?? contact.notes ?? ""}
                onChange={(e) => setNotesDraft(e.target.value)}
                onBlur={() => { if (notesDraft !== null && notesDraft !== (contact.notes ?? "")) patch({ notes: notesDraft }).then(() => setNotesDraft(null)); }}
                placeholder="Solo las ve el equipo..."
                aria-label="Notas internas"
                className="w-full h-28 p-3 bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
