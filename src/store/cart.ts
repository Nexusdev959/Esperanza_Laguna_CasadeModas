import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type InsigniaOption = 'COMPLETAS' | 'SOLO_BANDA' | 'SOLO_CAMISA' | 'NINGUNA';

// Integrante de un lote: quién usará cada uniforme (la talla viene de la línea si ya la tiene)
export interface ClubMember {
  name: string;
  rh: string;
  size?: string;
}

export interface CartItem {
  id: string; // usually productId + personalized props
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  size?: string;
  personalization?: string; // Nombre bordado en la insignia
  union?: string;
  association?: string;
  details?: string; // Especificaciones exactas del cliente para esta línea
  option?: string; // Opción elegida (ej. la clase)
  optionLabel?: string; // Cómo se llama la opción (ej. "Clase")
  isUniform?: boolean;
  insignias?: InsigniaOption;
  sizes?: string[]; // Tallas del producto, para elegirlas por integrante en un lote
  members?: ClubMember[];
}

// Mismas reglas que el servidor: desde 3 uniformes es lote (15 días hábiles); por unidad, 10
export const LOT_MIN_UNIFORMS = 3;
export const LEAD_DAYS = { unit: 10, lot: 15 };
export const RH_OPTIONS = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
export const INSIGNIA_LABELS: Record<string, string> = {
  COMPLETAS: 'Insignias en banda y camisa',
  SOLO_BANDA: 'Insignias solo en la banda',
  SOLO_CAMISA: 'Insignias solo en la camisa',
  NINGUNA: 'Sin insignias',
};

// shortcut: solo salta sábados y domingos, no los festivos de Colombia; por eso se muestra como fecha aproximada
export const addBusinessDays = (from: Date, days: number) => {
  const date = new Date(from);
  let added = 0;
  while (added < days) {
    date.setDate(date.getDate() + 1);
    if (date.getDay() !== 0 && date.getDay() !== 6) added++;
  }
  return date;
};

export const uniformUnits = (items: { isUniform?: boolean | null; quantity: number }[]) =>
  items.reduce((sum, i) => sum + (i.isUniform ? i.quantity : 0), 0);

// "Talla M · Insignias solo en la banda · Nombre: Orión · Unión: … (Asociación …)" para mostrar lo que se va a confeccionar
export const itemDetails = (i: { size?: string | null; personalization?: string | null; union?: string | null; association?: string | null; insignias?: string | null; details?: string | null; option?: string | null; optionLabel?: string | null; product?: { optionLabel?: string | null } | null }) =>
  [
    i.option && `${i.optionLabel || i.product?.optionLabel || 'Opción'}: ${i.option}`,
    i.size && `Talla ${i.size}`,
    i.insignias && i.insignias !== 'COMPLETAS' && INSIGNIA_LABELS[i.insignias],
    i.personalization && `Nombre: ${i.personalization}`,
    i.union && `Unión: ${i.union}${i.association ? ` (${i.association})` : ''}`,
    i.details && `Detalles: ${i.details}`,
  ]
    .filter(Boolean)
    .join(" · ");

// La lista del lote sigue a la cantidad: se agregan filas vacías o se quitan las últimas
const fitMembers = (members: ClubMember[] = [], quantity: number) =>
  Array.from({ length: quantity }, (_, n) => members[n] ?? { name: '', rh: '' });

interface CartStore {
  items: CartItem[];
  clubName: string;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateMember: (id: string, index: number, member: Partial<ClubMember>) => void;
  setClubName: (clubName: string) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      clubName: '',
      addItem: (item) => set((state) => {
        const existing = state.items.find((i) => i.id === item.id);
        if (existing) {
          return {
            items: state.items.map((i) =>
              // Se suman los integrantes ya anotados con los que trae la nueva tanda
              i.id === item.id
                ? { ...i, quantity: i.quantity + item.quantity, members: i.isUniform ? fitMembers([...fitMembers(i.members, i.quantity), ...(item.members ?? [])], i.quantity + item.quantity) : i.members }
                : i
            ),
          };
        }
        return { items: [...state.items, { ...item, members: item.isUniform ? fitMembers(item.members, item.quantity) : undefined }] };
      }),
      removeItem: (id) => set((state) => ({
        items: state.items.filter((i) => i.id !== id),
      })),
      updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map((i) => (i.id === id ? { ...i, quantity, members: i.isUniform ? fitMembers(i.members, quantity) : i.members } : i)),
      })),
      updateMember: (id, index, member) => set((state) => ({
        items: state.items.map((i) =>
          i.id === id ? { ...i, members: fitMembers(i.members, i.quantity).map((m, n) => (n === index ? { ...m, ...member } : m)) } : i
        ),
      })),
      setClubName: (clubName) => set({ clubName }),
      clearCart: () => set({ items: [], clubName: '' }),
      getTotal: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
    }),
    {
      name: 'pilypage-cart',
    }
  )
);
