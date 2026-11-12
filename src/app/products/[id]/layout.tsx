import type { Metadata } from "next";
import { API_URL } from "@/lib/api";

// La ficha es un componente de cliente: este layout le da a Google y a WhatsApp el título, la descripción,
// la foto y los datos de producto (precio, disponibilidad) que antes no veían.

type Props = { params: Promise<{ id: string }>; children: React.ReactNode };

type ApiProduct = {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock?: number;
  images?: string[];
  ratingAvg?: number;
  reviewsCount?: number;
};

const getProduct = async (id: string): Promise<ApiProduct | null> => {
  try {
    const res = await fetch(`${API_URL}/products/${encodeURIComponent(id)}`);
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
};

const shortText = (text = "", max = 155) => {
  const clean = text.replace(/[•|]/g, " ").replace(/\s+/g, " ").trim();
  return clean.length > max ? `${clean.slice(0, max - 1).trimEnd()}…` : clean;
};

export async function generateMetadata({ params }: Omit<Props, "children">): Promise<Metadata> {
  const product = await getProduct((await params).id);
  if (!product) return {};
  const title = `${product.name} · Esperanza Laguna`;
  const description = shortText(product.description) || `${product.name}, confeccionado en Colombia. Envíos a todo el país.`;
  const url = `/products/${product.id}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website", images: product.images?.[0] ? [{ url: product.images[0], alt: product.name }] : undefined },
  };
}

export default async function ProductLayout({ params, children }: Props) {
  const product = await getProduct((await params).id);
  const jsonLd = product && {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.id,
    image: product.images,
    description: shortText(product.description, 500),
    brand: { "@type": "Brand", name: "Esperanza Laguna" },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "COP",
      availability: product.stock === 0 ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      url: `https://esperanzalaguna.com/products/${product.id}`,
    },
    // Solo con reseñas reales: Google penaliza calificaciones sin respaldo
    ...(product.reviewsCount
      ? { aggregateRating: { "@type": "AggregateRating", ratingValue: product.ratingAvg, reviewCount: product.reviewsCount } }
      : {}),
  };

  return (
    <>
      {jsonLd && (
        // Se escapa "<" para que un texto del admin no pueda cerrar la etiqueta (recomendación de la guía de Next)
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      )}
      {children}
    </>
  );
}
