import { ProductCard } from "@/components/product-card";

export default function PreviewPage() {
  const dummyProduct = {
    id: 9999,
    name: "Uniforme de Conquistadores Femenino",
    price: 195000,
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=600&h=800",
    category: "Uniforme Reglamentario",
    status: "Nuevo",
  };

  const dummyProduct2 = {
    id: 9998,
    name: "Insignia de Guía Mayor Bordada",
    price: 45000,
    image: "https://images.unsplash.com/photo-1614088514555-d601b3d072f0?auto=format&fit=crop&q=80&w=600&h=800",
    category: "Especialidades y Parches",
  };

  return (
    <div className="min-h-screen bg-[#050807] pt-32 pb-20 px-8 flex flex-col items-center">
      <h1 className="text-3xl font-serif text-[#d4af37] mb-12 text-center">
        Previsualización Temporal de Tarjetas
      </h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-5xl">
        <ProductCard product={dummyProduct} />
        <ProductCard product={dummyProduct2} />
      </div>
    </div>
  );
}
