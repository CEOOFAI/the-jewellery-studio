import { motion } from "framer-motion";
import type { Product } from "../lib/supabase";
import { CATEGORY_LABELS, EUR_RATE, USD_RATE } from "../lib/constants";

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  index: number;
}

export default function ProductCard({ product, onClick, index }: ProductCardProps) {
  const formattedPrice = product.selling_price
    ? `\u00A3${product.selling_price.toLocaleString("en-GB")}`
    : null;
  const eurPrice = product.selling_price
    ? `\u20AC${Math.round(product.selling_price * EUR_RATE).toLocaleString("en-GB")}`
    : null;
  const usdPrice = product.selling_price
    ? `$${Math.round(product.selling_price * USD_RATE).toLocaleString("en-GB")}`
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="cursor-pointer group"
      onClick={onClick}
    >
      {/* Image container */}
      <div className="aspect-square overflow-hidden bg-cream relative">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9BA8B5"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
        )}

        {/* Gold overlay on hover */}
        <div className="absolute inset-x-0 bottom-0 h-0 group-hover:h-full bg-gold/80 transition-all duration-500 flex items-center justify-center overflow-hidden">
          <span className="font-body text-[11px] uppercase tracking-elegant text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
            View Details
          </span>
        </div>

        {/* Featured badge */}
        {product.featured && (
          <span className="absolute top-3 left-3 bg-gold text-white font-body text-[9px] uppercase tracking-elegant px-3 py-1 rounded-full">
            Featured
          </span>
        )}

        {/* New badge — added in last 14 days */}
        {!product.featured && product.created_at && (Date.now() - new Date(product.created_at).getTime()) < 14 * 24 * 60 * 60 * 1000 && (
          <span className="absolute top-3 left-3 bg-navy text-gold border border-gold/30 font-body text-[9px] uppercase tracking-elegant px-3 py-1 rounded-full">
            New
          </span>
        )}
      </div>

      {/* Text */}
      <div className="px-3 py-4">
        <p className="font-body text-[9px] tracking-luxe uppercase text-gold mb-1">
          {CATEGORY_LABELS[product.category] || product.category}
        </p>
        <h3 className="font-display text-lg text-navy font-light truncate">
          {product.name}
        </h3>
        {formattedPrice ? (
          <>
            <p className="font-body text-sm text-gold-muted mt-1">
              {formattedPrice}
            </p>
            <p className="font-body text-[9px] text-muted/60 mt-0.5">
              {eurPrice} &middot; {usdPrice}
            </p>
          </>
        ) : (
          <p className="font-body text-[10px] tracking-wide uppercase text-gold-muted mt-1">
            Price on request
          </p>
        )}
      </div>
    </motion.div>
  );
}
