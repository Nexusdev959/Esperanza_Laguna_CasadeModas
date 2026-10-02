import { ProductCard, Product } from "@/components/product-card";
import { AnimateIn } from "@/components/ui/animate-in";

// Simulated database
const MOCK_PRODUCTS: Record<string, Product[]>  = {};

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const category = (await params).category;
  
  // Format category name for display
  const titleMap: Record<string, string> = {
    men: "Hombres",
    women: "Mujeres",
    new: "Nueva Colección",
    lookbook: "Lookbook Editorial",
    all: "Todas las Colecciones"
  };
  
  const displayTitle = titleMap[category] || category.charAt(0).toUpperCase() + category.slice(1);
  const products = MOCK_PRODUCTS[category] || [...(MOCK_PRODUCTS.men || []), ...(MOCK_PRODUCTS.women || [])];

  return (
    <>
      <main className="flex-1 pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-serif text-[var(--foreground)] uppercase tracking-widest">{displayTitle}</h1>
            <p className="text-[var(--muted)] max-w-2xl mx-auto">Explora nuestra selección curada de piezas contemporáneas.</p>
          </div>

          {products.length > 0 ? (
            <AnimateIn delay={0.2}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </AnimateIn>
          ) : (
            <div className="text-center py-20 text-[var(--muted)]">
              <p>No hay productos disponibles en esta colección por el momento.</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
