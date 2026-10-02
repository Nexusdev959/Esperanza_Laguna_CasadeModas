"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductForm } from "@/components/admin/product-form";
import { ProductTable } from "@/components/admin/product-table";

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'Conquistadores',
    audience: 'Unisex', 
    price: '',
    saleMode: 'unidad',
    isPublished: true,
    productionType: 'stock',
    estimatedDays: '7',
    sizes: { 
      XS: { active: false, qty: '' }, 
      S: { active: false, qty: '' }, 
      M: { active: false, qty: '' }, 
      L: { active: false, qty: '' }, 
      XL: { active: false, qty: '' }, 
      Única: { active: false, qty: '' } 
    }
  });

  useEffect(() => {
    // Aquí deberá ir el fetch a la BD real en producción
    // fetch('/api/v1/products').then(res => res.json()).then(setProducts)
    setProducts([]);
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(false);
    // Submit logic
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif text-[var(--foreground)]">Catálogo e Inventario</h1>
          <p className="text-sm text-[var(--muted)]">Gestiona tallas, productos por encargo y combos de uniformes.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)} 
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-transform active:scale-95 shadow-sm"
        >
          {isAdding ? <span className="rotate-45 transition-transform"><Plus className="w-5 h-5" /></span> : <Plus className="w-5 h-5" />}
          {isAdding ? 'Cancelar Edición' : 'Nuevo Producto'}
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <ProductForm 
              formData={formData} 
              setFormData={setFormData} 
              handleCreate={handleCreate} 
              onCancel={() => setIsAdding(false)} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      <ProductTable products={products} />
    </div>
  );
}
