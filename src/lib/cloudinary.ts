// El original subido pesa ~3 MB (2400 px): Cloudinary lo entrega al ancho pedido y en AVIF/WebP (~50 KB)
export const cldImage = (url: string | undefined, width: number) =>
  url?.includes("res.cloudinary.com/") && !url.includes("/upload/f_auto")
    ? url.replace("/upload/", `/upload/f_auto,q_auto,c_limit,w_${width}/`)
    : url;
