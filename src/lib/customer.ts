// Quién hizo el pedido, con o sin cuenta: nunca "anónimo" si el pedido trae nombre, teléfono o WhatsApp
type OrderContact = {
  user?: { name?: string | null; email?: string | null } | null;
  contactName?: string | null;
  contactPhone?: string | null;
  whatsappKey?: string | null;
} | null | undefined;

export const customerName = (o: OrderContact) =>
  o?.user?.name || o?.contactName || (o?.contactPhone ? `Cliente ${o.contactPhone}` : o?.whatsappKey ? "Cliente de WhatsApp" : "Cliente sin datos");

/** Teléfono o correo para ubicarlo; con BSUID (sin teléfono) se responde por Admin → Chats. */
export const customerContact = (o: OrderContact) =>
  o?.contactPhone || o?.user?.email || (o?.whatsappKey ? "WhatsApp sin número (ver Chats)" : "");
