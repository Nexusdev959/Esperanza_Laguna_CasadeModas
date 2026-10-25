import { redirect } from "next/navigation";

// Las colecciones viven en /catalogo, que filtra por categoría con los productos reales
export default function CollectionPage() {
  redirect("/catalogo");
}
