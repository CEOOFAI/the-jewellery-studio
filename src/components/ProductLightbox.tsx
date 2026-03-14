import { AnimatePresence, motion } from "framer-motion";
import type { Product } from "../lib/supabase";

const categoryLabels: Record<string, string> = {
  watches: "Watches",
  engagement: "Engagement",
  gold: "Gold",
  necklaces: "Necklaces",
  diamonds: "Diamonds",
  preowned: "Pre-Owned",
};

interface ProductLightboxProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductLightbox({ product, onClose }: ProductLightboxProps) {
  const formattedPrice = product?.selling_price
    ? `\u00A3${product.selling_price.toLocaleString("en-GB")}`
    : null;

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative bg-navy rounded-sm max-w-2xl w-full max-h-[90vh] overflow-y-auto z-10 border border-[rgba(201,168,76,0.15)] shadow-[0_0_60px_rgba(0,0,0,0.5)]"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {/* Close button */}
            <button
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-navy-deep/80 border border-[rgba(201,168,76,0.2)] flex items-center justify-center hover:border-gold transition-colors"
              onClick={onClose}
              aria-label="Close"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#F5F0E8"
                strokeWidth="2"
              >
                <line x1="4" y1="4" x2="20" y2="20" />
                <line x1="20" y1="4" x2="4" y2="20" />
              </svg>
            </button>

            {/* Image */}
            <div className="aspect-square bg-navy-deep overflow-hidden">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#4A5A6A"
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
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="font-body text-[9px] tracking-luxe uppercase text-gold mb-2">
                {categoryLabels[product.category] || product.category}
              </p>

              <h2 className="font-display text-2xl md:text-3xl text-warm mb-2">
                {product.name}
              </h2>

              {formattedPrice ? (
                <p className="font-body text-lg text-gold mb-4">
                  {formattedPrice}
                </p>
              ) : (
                <p className="font-body text-[10px] tracking-wide uppercase text-gold-muted mb-4">
                  Price on request
                </p>
              )}

              {/* Gold divider */}
              <div className="w-12 h-px bg-gold/30 mb-4" />

              {/* Description */}
              {product.description && (
                <p className="font-body text-sm text-warm/60 leading-relaxed mb-6">
                  {product.description}
                </p>
              )}

              {/* WhatsApp CTA */}
              <a
                href={`https://wa.me/35054013690?text=${encodeURIComponent(`Hi, I'm interested in ${product.name}${formattedPrice ? ` (${formattedPrice})` : ''} from your website.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-gold hover:bg-gold-muted text-navy-darkest font-body text-sm uppercase tracking-elegant py-3.5 rounded-sm transition-colors duration-300"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Enquire via WhatsApp
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
