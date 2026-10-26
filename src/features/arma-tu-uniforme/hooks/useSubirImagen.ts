import { useState } from "react";
import { useNotification } from "@/components/ui/notification-provider";
import { mensajeError, subirImagen } from "../lib/contenido";

/** Sube una foto y devuelve su URL (o null si falló, con aviso). */
export function useSubirImagen() {
  const [subiendo, setSubiendo] = useState(false);
  const { showNotification } = useNotification();

  const subir = async (archivo: File) => {
    if (!archivo.type.startsWith("image/")) {
      showNotification("Elige una imagen (JPG, PNG o WebP)", "error");
      return null;
    }
    setSubiendo(true);
    try {
      return await subirImagen(archivo);
    } catch (e) {
      showNotification(mensajeError(e), "error");
      return null;
    } finally {
      setSubiendo(false);
    }
  };

  return { subir, subiendo };
}
