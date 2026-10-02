import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  status?: string;
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.id}`} className="group block outline-none">
      <div className="relative aspect-[3/4] bg-[var(--surface)] overflow-hidden mb-5 rounded-none shadow-sm border border-[var(--border-color)] transition-all duration-500 group-hover:shadow-md">
        
        {/* Imagen con zoom lento */}
        <img
          src={product.image}
          alt={product.name}
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-[1.5s] ease-out opacity-90 group-hover:opacity-100"
        />
        
        {/* Gradiente sutil para legibilidad del badge si es necesario */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Badge de Estado */}
        {product.status && (
          <div className="absolute top-3 left-3 bg-[var(--background)] text-[var(--foreground)] text-[10px] uppercase tracking-widest px-3 py-1 font-medium shadow-sm border border-[var(--border-color)]">
            {product.status}
          </div>
        )}

        {/* Botón Flotante de Compra */}
        <div className="absolute bottom-4 right-4 bg-primary text-primary-foreground p-3 rounded-full opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </div>
      
      {/* Tipografía Elegante y Minimalista para Tienda de Ropa */}
      <div className="space-y-1.5 px-1 text-left flex flex-col">
        <h3 className="text-sm font-medium tracking-wide text-[var(--foreground)] group-hover:text-primary transition-colors duration-300 line-clamp-1 w-full">
          {product.name}
        </h3>
        <p className="text-sm tracking-wide font-light text-[var(--muted)]">
          {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(product.price)}
        </p>
      </div>
    </Link>
  );
}
