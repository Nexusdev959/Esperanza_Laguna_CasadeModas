"use client";

import { ChevronDown, ShoppingBag, Plus, Minus, Package, Tag, ArrowLeft, Star, ThumbsUp, Loader2 } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AnimateIn } from "@/components/ui/animate-in";
import { useNotification } from "@/components/ui/notification-provider";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import useSWR, { useSWRConfig } from "swr";
import { useCartStore } from "@/store/cart";

export default function ProductDetail() {
  const params = useParams();
  const id = params.id as string;
  const [purchaseMode, setPurchaseMode] = useState<"unidad" | "lote">("unidad");
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M");
  const { showNotification } = useNotification();

  const [isReviewing, setIsReviewing] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const { addItem } = useCartStore();
  const { mutate } = useSWRConfig();

  // Fetch product data
  const { data: product, error, isLoading } = useSWR(`/products/${id}`, async (url) => {
    const res = await api.get(url);
    return res.data;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h2 className="text-2xl font-bold">Ocurrió un Error</h2>
        <p className="text-[var(--muted)]">No se pudo cargar el producto. Verifica que el enlace sea correcto.</p>
        <Link href="/" className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
          Volver al Inicio
        </Link>
      </div>
    );
  }

  const basePrice = product.price;
  const currentPrice = purchaseMode === "lote" ? basePrice * 0.8 : basePrice; // 20% discount for batches
  const lotSize = 12; // A batch contains 12 units

  const handleAddToCart = () => {
    const totalUnits = purchaseMode === "lote" ? quantity * lotSize : quantity;
    const cartId = `${product.id}-${selectedSize}-${purchaseMode}`;
    
    addItem({
      id: cartId,
      productId: product.id,
      name: product.name,
      price: currentPrice,
      quantity: totalUnits,
      image: Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/800x1000?text=Sin+Imagen',
      size: selectedSize
    });

    showNotification(`Añadido al carrito: ${totalUnits} unidad(es) de ${product.name}`, "success");
  };

  const increment = () => setQuantity(q => q + 1);
  const decrement = () => setQuantity(q => Math.max(1, q - 1));

  const handleSubmitReview = async () => {
    try {
      const token = localStorage.getItem('jwt_token');
      if (!token) {
        showNotification("Debes iniciar sesión para calificar", "error");
        return;
      }
      if (!comment.trim()) {
        showNotification("Escribe un comentario", "error");
        return;
      }
      setIsSubmittingReview(true);
      await api.post('/reviews', {
        productId: product.id,
        rating,
        comment,
        title: "Reseña de Producto"
      });
      showNotification("¡Reseña publicada con éxito!", "success");
      setIsReviewing(false);
      setComment("");
      setRating(5);
      mutate(`/products/${id}`);
    } catch (e: any) {
      showNotification(e?.response?.data?.error || "Error al enviar la reseña", "error");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Determine main image and additional images
  const images = Array.isArray(product.images) && product.images.length > 0 
    ? product.images 
    : ['https://via.placeholder.com/800x1000?text=Sin+Imagen'];
  
  const mainImage = images[0];
  const detailImages = images.slice(1, 3); // Get up to 2 extra images

  return (
    <>
      <main className="container max-w-5xl mx-auto px-4 py-20">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mb-8 group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Volver a la tienda
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          {/* Product Images */}
          <AnimateIn delay={0.1} className="space-y-4">
            <div className="aspect-[4/5] bg-[var(--surface)] overflow-hidden rounded-2xl border border-[var(--border-color)]">
              <img 
                src={mainImage} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>
            {detailImages.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {detailImages.map((img: string, index: number) => (
                  <div key={index} className="aspect-[4/5] bg-[var(--surface)] overflow-hidden rounded-xl border border-[var(--border-color)]">
                    <img 
                      src={img} 
                      alt={`Detalle ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </AnimateIn>

          {/* Product Info */}
          <AnimateIn delay={0.2} className="flex flex-col">
            <div className="mb-6">
              <div className="inline-block px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-medium tracking-widest uppercase mb-3">
                {product.category || 'Colección'}
              </div>
              <h1 className="text-2xl md:text-3xl font-serif text-[var(--foreground)] mb-2">{product.name}</h1>
              <div className="flex items-end gap-3">
                <p className="text-xl text-[var(--foreground)] font-medium">{currentPrice.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</p>
                {purchaseMode === "lote" && (
                  <p className="text-xs text-[var(--muted)] line-through mb-0.5">{basePrice.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</p>
                )}
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-[var(--muted)] leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* Compra por Lote o Unidad */}
            <div className="mb-6 bg-[var(--surface)] border border-[var(--border-color)] rounded-xl p-1.5 flex">
              <button 
                onClick={() => setPurchaseMode("unidad")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-all ${purchaseMode === "unidad" ? "bg-[var(--background)] shadow-sm border border-[var(--border-color)] text-[var(--foreground)]" : "text-[var(--muted)] hover:text-[var(--foreground)]"}`}
              >
                <Tag className="w-3 h-3" /> Por Unidad
              </button>
              <button 
                onClick={() => setPurchaseMode("lote")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-all ${purchaseMode === "lote" ? "bg-primary/10 border border-primary/20 text-primary shadow-sm" : "text-[var(--muted)] hover:text-[var(--foreground)]"}`}
              >
                <Package className="w-3 h-3" /> Al Mayor (Lote x{lotSize})
              </button>
            </div>

            {/* Size Selector (Static for now as size is usually an attribute of the cart, unless product has specific variants) */}
            <div className="mb-8">
               <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-medium text-[var(--foreground)]">Talla</span>
                <button className="text-[10px] text-[var(--muted)] hover:text-primary transition-colors underline underline-offset-4">Guía de tallas</button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {['XS', 'S', 'M', 'L'].map(size => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 rounded-lg border text-xs font-medium transition-all ${
                      selectedSize === size 
                        ? 'border-primary bg-primary/5 text-primary' 
                        : 'border-[var(--border-color)] text-[var(--muted)] hover:border-[var(--foreground)] hover:text-[var(--foreground)]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex gap-3 mb-8">
              <div className="flex items-center border border-[var(--border-color)] rounded-xl p-1 bg-[var(--surface)]">
                <button onClick={decrement} className="p-2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"><Minus className="w-4 h-4" /></button>
                <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                <button onClick={increment} className="p-2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"><Plus className="w-4 h-4" /></button>
              </div>
              <Button onClick={handleAddToCart} variant="primary" className="flex-1 py-2 flex justify-center items-center gap-2 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 text-sm">
                <ShoppingBag className="w-4 h-4" />
                <span>Añadir a la bolsa</span>
              </Button>
            </div>
          </AnimateIn>
        </div>

        {/* Ratings and Reviews Section */}
        <AnimateIn delay={0.3} className="mt-24 pt-12 border-t border-[var(--border-color)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Rating Summary */}
            <div className="lg:col-span-1 space-y-6">
              <h2 className="text-xl font-serif text-[var(--foreground)]">Calificaciones y reseñas</h2>
              
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-5xl font-medium text-[var(--foreground)]">{product.ratingAvg?.toFixed(1) || '0.0'}</p>
                  <div className="flex text-yellow-400 my-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} className={`w-4 h-4 ${star <= (product.ratingAvg || 0) ? 'fill-yellow-400' : 'fill-transparent text-[var(--border-color)]'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-[var(--muted)]">{product.reviewsCount || 0} reseñas</p>
                </div>
              </div>
              
              <div className="pt-4">
                {!isReviewing ? (
                  <Button variant="outline" className="w-full" onClick={() => setIsReviewing(true)}>Escribir una reseña</Button>
                ) : (
                  <div className="bg-[var(--surface)] border border-[var(--border-color)] p-4 rounded-xl space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium">Tu Calificación</h3>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            onClick={() => setRating(star)}
                            className={`w-5 h-5 cursor-pointer transition-colors ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-transparent text-[var(--border-color)]'}`} 
                          />
                        ))}
                      </div>
                    </div>
                    <textarea 
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                      placeholder="¿Qué te pareció el producto?"
                      className="w-full p-3 bg-[var(--background)] border border-[var(--border-color)] rounded-lg text-sm resize-none h-24 outline-none focus:border-primary"
                    />
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1" onClick={() => setIsReviewing(false)}>Cancelar</Button>
                      <Button variant="primary" className="flex-1" disabled={isSubmittingReview} onClick={handleSubmitReview}>
                        {isSubmittingReview ? <Loader2 className="w-4 h-4 animate-spin" /> : "Publicar"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Comments List */}
            <div className="lg:col-span-2 space-y-8">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((review: any, i: number) => (
                  <div key={i} className="border-b border-[var(--border-color)] pb-6 last:border-0">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[var(--surface)] border border-[var(--border-color)] overflow-hidden">
                          <img src={`https://ui-avatars.com/api/?name=${review.user?.name?.replace(' ', '+') || 'Usuario'}&background=random`} alt={review.user?.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[var(--foreground)]">{review.user?.name || 'Usuario Anónimo'}</p>
                          <p className="text-xs text-[var(--muted)]">{new Date(review.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex text-yellow-400 mb-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star key={star} className={`w-3 h-3 ${star <= review.rating ? 'fill-yellow-400' : 'fill-transparent text-[var(--border-color)]'}`} />
                      ))}
                    </div>
                    <p className="text-sm text-[var(--muted)] mb-3 leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-[var(--muted)]">
                  Aún no hay reseñas para este producto. ¡Sé el primero en calificarlo!
                </div>
              )}
            </div>
          </div>
        </AnimateIn>

      </main>
    </>
  );
}
