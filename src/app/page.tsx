import { HeroCinematic } from "@/components/hero";
import { ProductGallery } from "@/components/product-gallery";
import { AnimateIn } from "@/components/ui/animate-in";

export default function Home() {
  return (
    <>
      <main className="flex-1">
        {/* Hero Section (Modularized) */}
        <HeroCinematic />

        {/* Galería Dinámica por Categorías */}
        <section className="py-16 px-4 container mx-auto overflow-hidden">
          <AnimateIn delay={0.2}>

            <ProductGallery />
          </AnimateIn>
        </section>
      </main>
    </>
  );
}
