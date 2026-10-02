"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductForm } from "@/components/admin/product-form";
import { ProductTable } from "@/components/admin/product-table";
import { useNotification } from "@/components/ui/notification-provider";
import { api } from "@/lib/api";

export default function AdminProducts() {
  const { showNotification } = useNotification();
  const [products, setProducts] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Conquistadores',
    audience: ['Unisex'], 
    price: '',
    saleMode: 'unidad',
    isPublished: true,
    productionType: 'stock',
    estimatedDays: '7',
    requiresPersonalization: false,
    images: [] as File[],
    sizes: { 
      XS: { active: false, qty: '' }, 
      S: { active: false, qty: '' }, 
      M: { active: false, qty: '' }, 
      L: { active: false, qty: '' }, 
      XL: { active: false, qty: '' }, 
      Única: { active: false, qty: '' } 
    }
  });

  const loadProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      showNotification("No se pudieron cargar los productos", "error");
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('price', formData.price);
      data.append('saleMode', formData.saleMode);
      data.append('isPublished', String(formData.isPublished));
      data.append('productionType', formData.productionType);
      data.append('estimatedDays', formData.estimatedDays);
      data.append('requiresPersonalization', String(formData.requiresPersonalization));
      
      // Enviar audience como array JSON
      data.append('audience', JSON.stringify(formData.audience));
      
      // Enviar sizes activos
      const activeSizes = Object.entries(formData.sizes).filter(([_, s]) => s.active);
      data.append('sizes', JSON.stringify(activeSizes));
      
      // Adjuntar imagenes
      formData.images.forEach(img => {
        data.append('images', img);
      });
      
      // Aquí se enviaría a la API real
      if (editingId) {
        await api.put(`/products/${editingId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showNotification("Producto actualizado correctamente", "success");
      } else {
        await api.post('/products', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showNotification("Producto publicado correctamente", "success");
      }
      
      setIsAdding(false);
      setEditingId(null);
      
      // Limpiar form
      setFormData({
        name: '', description: '', category: 'Conquistadores', audience: ['Unisex'], price: '', saleMode: 'unidad',
        isPublished: true, productionType: 'stock', estimatedDays: '7', requiresPersonalization: false,
        images: [],
        sizes: { 
          XS: { active: false, qty: '' }, S: { active: false, qty: '' }, M: { active: false, qty: '' }, 
          L: { active: false, qty: '' }, XL: { active: false, qty: '' }, Única: { active: false, qty: '' } 
        }
      });
      loadProducts();
    } catch (err: any) {
      console.error(err);
      showNotification(err.response?.data?.error || "Error al procesar el producto", "error");
    }
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
              onCancel={() => {
                setIsAdding(false);
                setEditingId(null);
              }} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      <ProductTable 
        products={products} 
        onEdit={(product) => {
          setEditingId(product.id);
          setFormData({
            ...formData,
            name: product.name,
            description: product.description || '',
            category: product.category,
            audience: product.audience || ['Unisex'],
            price: product.price.toString(),
            isPublished: product.isPublished,
            requiresPersonalization: product.requiresPersonalization,
            productionType: product.stock > 0 ? 'stock' : 'encargo',
          });
          setIsAdding(true);
        }}
        onDelete={async (id) => {
          if (confirm("¿Estás seguro de eliminar este producto?")) {
            try {
              await api.delete(`/products/${id}`);
              showNotification("Producto eliminado", "success");
              loadProducts();
            } catch (err) {
              showNotification("Error al eliminar producto", "error");
            }
          }
        }}
      />
    </div>
  );
}
