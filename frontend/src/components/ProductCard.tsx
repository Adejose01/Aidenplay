// ============================================================
// AIDEN PLAY — Tarjeta de Producto
// ============================================================

import type { Product } from "@/types";
import { getFileUrl, formatPrice, buildWhatsAppLink } from "@/lib/pocketbase";
import AddToCartButton from "./AddToCartButton";

/**
 * Mapeo de categorías a colores de badge.
 */
const CATEGORY_COLORS: Record<Product["category"], string> = {
  PS4: "bg-[#003791]",
  PS5: "bg-[#0072CE]",
  PS_PLUS: "bg-yellow-600",
  STREAMING: "bg-neon-pink",
};

/**
 * Mapeo de categorías a gradientes de fondo para la imagen.
 */
const CATEGORY_GRADIENTS: Record<Product["category"], string> = {
  PS4: "from-black to-blue-950",
  PS5: "from-black to-indigo-950",
  PS_PLUS: "from-black to-yellow-950",
  STREAMING: "from-black to-pink-950",
};

/**
 * Etiquetas legibles en español para el tipo de cuenta.
 */
const ACCOUNT_LABELS: Record<Product["account_type"], string> = {
  Primaria: "Cuenta Primaria",
  Secundaria: "Cuenta Secundaria",
  Suscripción: "Suscripción Mensual",
};

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageUrl = getFileUrl(product, "cover_image", { thumb: "400x300" });
  const whatsAppUrl = buildWhatsAppLink(
    product.title,
    product.price_ar,
    product.price_rd
  );

  return (
    <article className="bg-dark-card rounded-2xl overflow-hidden neon-border flex flex-col h-full shadow-lg group/card">
      {/* Badge de categoría */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5">
        <span
          className={`${CATEGORY_COLORS[product.category]} text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase`}
        >
          {product.category.replace("_", " ")}
        </span>
      </div>

      {/* Imagen de portada */}
      <div className="aspect-[4/3] bg-dark-lighter relative overflow-hidden">
        {/* Gradiente de fondo como fallback */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${CATEGORY_GRADIENTS[product.category]} z-0`}
        />

        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500 opacity-60 mix-blend-luminosity group-hover/card:mix-blend-normal relative z-10"
          />
        ) : (
          /* Placeholder cuando no hay imagen */
          <div className="w-full h-full flex items-center justify-center relative z-10">
            <span className="text-5xl opacity-30">🎮</span>
          </div>
        )}

        {/* Gradiente inferior */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-dark-card/40 to-transparent z-10" />

        {/* Badge de tipo de cuenta */}
        <div className="absolute bottom-3 left-3 z-20">
          <span className="bg-white text-black text-[10px] font-black uppercase px-2 py-1 rounded">
            {ACCOUNT_LABELS[product.account_type]}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Título */}
        <h3 className="font-display font-bold text-lg leading-tight mb-1 text-white">
          {product.title}
        </h3>

        {/* Descripción corta */}
        <p className="text-gray-400 text-xs mb-4 line-clamp-1">
          {product.description}
        </p>

        {/* Bloque de precios */}
        <div className="bg-dark-lighter rounded-lg p-3 mb-4 border border-white/5">
          {/* Precio Argentina */}
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-bold text-gray-500 uppercase">
              Argentina
            </span>
            <span className="font-black text-lg text-neon-blue">
              AR$ {formatPrice(product.price_ar)}
            </span>
          </div>

          {/* Precio R. Dominicana */}
          <div className="flex justify-between items-center pt-1.5 border-t border-white/5">
            <span className="text-xs font-bold text-gray-500 uppercase">
              R. Dominicana
            </span>
            <span className="font-black text-base text-neon-purple">
              RD$ {formatPrice(product.price_rd)}
            </span>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="mt-auto flex flex-col gap-2">
          <AddToCartButton product={product} />

          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full btn-whatsapp font-bold py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Comprar Rápido
          </a>
        </div>
      </div>
    </article>
  );
}
