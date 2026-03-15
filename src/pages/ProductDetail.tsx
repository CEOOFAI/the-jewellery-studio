import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import useSEO from "../hooks/useSEO";
import GoldDivider from "../components/GoldDivider";
import SectionReveal from "../components/SectionReveal";
import { supabase } from "../lib/supabase";
import type { Product } from "../lib/supabase";
import { CATEGORY_LABELS, EUR_RATE, USD_RATE, isValidPhone } from "../lib/constants";

const mockProvenance = [
  {
    year: "c. 1960",
    location: "Geneva, Switzerland",
    description: "Originally crafted by a Swiss master watchmaker",
  },
  {
    year: "c. 1985",
    location: "London, UK",
    description: "Acquired by a private collector",
  },
  {
    year: "2024",
    location: "Gibraltar",
    description:
      "Authenticated and restored by Michael at The Jewellery Studio",
  },
];

function formatCurrency(
  value: number,
  currency: string,
  locale = "en-GB"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/* ------------------------------------------------------------------ */
/*  Wishlist Modal                                                     */
/* ------------------------------------------------------------------ */

interface WishlistModalProps {
  product: Product;
  onClose: () => void;
}

function WishlistModal({ product, onClose }: WishlistModalProps) {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Enter your name.");
      return;
    }

    if (!whatsapp.trim() || !isValidPhone(whatsapp)) {
      setError("Enter a valid WhatsApp number.");
      return;
    }

    setSubmitting(true);

    const { error: dbError } = await supabase.from("v2_wishlists").insert({
      name: name.trim(),
      whatsapp: whatsapp.trim(),
      product_ids: [product.id],
    });

    setSubmitting(false);

    if (dbError) {
      setError("Something went wrong. Please try again.");
      return;
    }

    setSuccess(true);
  }

  return (
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
        role="dialog"
        aria-modal="true"
        aria-label="Save to Wishlist"
        className="relative bg-navy-deep rounded-sm w-full max-w-md z-10 border border-[rgba(201,168,76,0.15)] shadow-[0_0_60px_rgba(0,0,0,0.5)] p-8"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        {/* Close button */}
        <button
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-navy/80 border border-[rgba(201,168,76,0.2)] flex items-center justify-center hover:border-gold transition-colors"
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

        {success ? (
          <div className="text-center py-6">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#C9A84C"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mx-auto mb-4"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <h3 className="font-display text-2xl text-warm mb-2">Saved</h3>
            <p className="font-body text-sm text-muted">
              {product.name} has been added to your wishlist. We'll be in touch.
            </p>
          </div>
        ) : (
          <>
            <h3 className="font-display text-2xl text-warm mb-1">
              Save to Wishlist
            </h3>
            <p className="font-body text-sm text-muted mb-6">
              We'll notify you if this piece becomes available or its price
              changes.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-body text-[10px] uppercase tracking-elegant text-muted block mb-1.5">
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-navy border border-[rgba(201,168,76,0.15)] rounded-sm px-4 py-3 font-body text-sm text-warm placeholder:text-dim focus:outline-none focus:border-gold/40 transition-colors"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="font-body text-[10px] uppercase tracking-elegant text-muted block mb-1.5">
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  required
                  className="w-full bg-navy border border-[rgba(201,168,76,0.15)] rounded-sm px-4 py-3 font-body text-sm text-warm placeholder:text-dim focus:outline-none focus:border-gold/40 transition-colors"
                  placeholder="+350 xxxx xxxx"
                />
              </div>

              {error && (
                <p className="font-body text-sm text-red-400">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gold hover:bg-gold-muted disabled:opacity-50 text-navy-darkest font-body text-[11px] uppercase tracking-elegant py-3.5 rounded-sm transition-colors duration-300"
              >
                {submitting ? "Saving..." : "Save to Wishlist"}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Loading Skeleton                                                   */
/* ------------------------------------------------------------------ */

function ProductSkeleton() {
  return (
    <div className="bg-navy min-h-screen pt-32 pb-20">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Back link skeleton */}
        <div className="mb-8">
          <div className="h-4 w-32 bg-navy-card rounded animate-pulse" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image skeleton */}
          <div className="aspect-square bg-navy-card rounded-sm animate-pulse" />

          {/* Details skeleton */}
          <div className="space-y-6 py-2">
            <div className="h-3 w-20 bg-navy-card rounded animate-pulse" />
            <div className="h-10 w-3/4 bg-navy-card rounded animate-pulse" />
            <div className="h-px w-16 bg-navy-card animate-pulse" />
            <div className="h-8 w-28 bg-navy-card rounded animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-navy-card rounded animate-pulse" />
              <div className="h-4 w-5/6 bg-navy-card rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-navy-card rounded animate-pulse" />
            </div>
            <div className="space-y-3 pt-4">
              <div className="h-14 w-full bg-navy-card rounded-sm animate-pulse" />
              <div className="h-14 w-full bg-navy-card rounded-sm animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Not Found State                                                    */
/* ------------------------------------------------------------------ */

function ProductNotFound() {
  return (
    <div className="bg-navy min-h-screen pt-32 pb-20 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#4A5A6A"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mx-auto mb-6"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
        <h2 className="font-display text-3xl text-warm mb-3">
          Piece Not Found
        </h2>
        <p className="font-body text-sm text-muted mb-8">
          This item may have been sold or removed from the collection.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 bg-gold hover:bg-gold-muted text-navy-darkest font-body text-[11px] uppercase tracking-elegant px-8 py-3.5 rounded-sm transition-colors duration-300"
        >
          Browse the Collection
        </Link>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Provenance Timeline                                                */
/* ------------------------------------------------------------------ */

function ProvenanceTimeline() {
  return (
    <SectionReveal className="mt-20 max-w-2xl mx-auto">
      <h3 className="font-display text-2xl md:text-3xl text-warm text-center mb-2">
        Provenance
      </h3>
      <p className="font-body text-sm text-muted text-center mb-10">
        The authenticated journey of this piece
      </p>

      <div className="relative pl-8">
        {/* Vertical gold line */}
        <motion.div
          className="absolute left-3 top-0 w-px bg-gold/30"
          initial={{ height: 0 }}
          whileInView={{ height: "100%" }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />

        {mockProvenance.map((entry, i) => (
          <motion.div
            key={i}
            className="relative pb-10 last:pb-0"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1],
              delay: i * 0.2,
            }}
          >
            {/* Gold dot */}
            <div className="absolute left-[-21px] top-1.5 w-3 h-3 rounded-full border-2 border-gold bg-navy-deep" />

            <p className="font-body text-[10px] uppercase tracking-elegant text-gold mb-1">
              {entry.year}
            </p>
            <p className="font-display text-lg text-warm mb-1">
              {entry.location}
            </p>
            <p className="font-body text-sm text-muted leading-relaxed">
              {entry.description}
            </p>
          </motion.div>
        ))}
      </div>
    </SectionReveal>
  );
}

/* ------------------------------------------------------------------ */
/*  WhatsApp SVG Icon                                                  */
/* ------------------------------------------------------------------ */

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Heart / Wishlist SVG Icon                                          */
/* ------------------------------------------------------------------ */

function HeartIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page Component                                                */
/* ------------------------------------------------------------------ */

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);

  useSEO({
    title: product ? `${product.name} | The Jewellery Studio` : "Shop | The Jewellery Studio",
    description: product?.description || "Browse fine jewellery at The Jewellery Studio, Gibraltar.",
    url: `/shop/${id}`,
    image: product?.image_url || undefined,
  });

  useEffect(() => {
    if (!id) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    async function fetchProduct() {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .eq("active", true)
        .single();

      if (error || !data) {
        setNotFound(true);
      } else {
        setProduct(data);
      }
      setLoading(false);
    }

    fetchProduct();
  }, [id]);

  // Loading state
  if (loading) return <ProductSkeleton />;

  // Not found state
  if (notFound || !product) return <ProductNotFound />;

  const gbpPrice = product.selling_price;
  const hasPrice = gbpPrice !== null && gbpPrice !== undefined;

  const encodedProductName = encodeURIComponent(product.name);
  const whatsappUrl = `https://wa.me/35054013690?text=Hi%2C%20I%27m%20interested%20in%20${encodedProductName}%20(Ref%3A%20${product.id.slice(0, 8)})`;

  return (
    <div className="bg-navy min-h-screen pt-32 pb-20">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Back navigation */}
        <SectionReveal>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 font-body text-[11px] uppercase tracking-elegant text-muted hover:text-gold transition-colors mb-8 group"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform group-hover:-translate-x-1"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Shop
          </Link>
        </SectionReveal>

        {/* Product layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image */}
          <SectionReveal variant="fade-left">
            <div className="aspect-square bg-navy-deep rounded-sm overflow-hidden border border-[rgba(201,168,76,0.08)]">
              {product.image_url ? (
                <motion.img
                  src={product.image_url}
                  alt={product.name}
                  className="object-cover w-full h-full"
                  initial={{ scale: 1.05 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg
                    width="80"
                    height="80"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#4A5A6A"
                    strokeWidth="0.5"
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
          </SectionReveal>

          {/* Details */}
          <SectionReveal variant="fade-right" delay={0.1}>
            <div className="py-2 lg:py-4">
              {/* Category */}
              <p className="font-body text-[10px] tracking-luxe uppercase text-gold mb-3">
                {CATEGORY_LABELS[product.category] || product.category}
              </p>

              {/* Name */}
              <h1 className="font-display text-3xl md:text-4xl lg:text-[2.75rem] text-warm leading-tight mb-4">
                {product.name}
              </h1>

              {/* Divider */}
              <GoldDivider width={48} className="!mx-0 mb-6" />

              {/* Price */}
              {hasPrice ? (
                <div className="mb-6">
                  <p className="font-display text-2xl md:text-3xl text-gold">
                    {formatCurrency(gbpPrice, "GBP")}
                  </p>
                  <div className="flex gap-4 mt-1.5">
                    <span className="font-body text-xs text-muted">
                      {formatCurrency(
                        Math.round(gbpPrice * EUR_RATE),
                        "EUR"
                      )}
                    </span>
                    <span className="font-body text-xs text-muted">
                      {formatCurrency(
                        Math.round(gbpPrice * USD_RATE),
                        "USD"
                      )}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="font-body text-[11px] tracking-elegant uppercase text-gold-muted mb-6">
                  Price on request
                </p>
              )}

              {/* Description */}
              {product.description && (
                <p className="font-body text-sm text-muted leading-relaxed mb-8">
                  {product.description}
                </p>
              )}

              {/* Reference */}
              <p className="font-body text-[10px] text-dim uppercase tracking-elegant mb-8">
                Ref: {product.id.slice(0, 8).toUpperCase()}
              </p>

              {/* Action buttons */}
              <div className="space-y-3">
                {/* WhatsApp CTA */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 w-full bg-gold hover:bg-gold-muted text-navy-darkest font-body text-[11px] uppercase tracking-elegant py-4 rounded-sm transition-colors duration-300"
                >
                  <WhatsAppIcon />
                  Enquire on WhatsApp
                </a>

                {/* Wishlist button */}
                <button
                  onClick={() => setShowWishlist(true)}
                  className="flex items-center justify-center gap-2.5 w-full bg-transparent border border-gold text-gold hover:bg-gold/10 font-body text-[11px] uppercase tracking-elegant py-4 rounded-sm transition-colors duration-300"
                >
                  <HeartIcon />
                  Save to Wishlist
                </button>
              </div>

              {/* Trust signals */}
              <div className="grid grid-cols-3 gap-4 mt-10 pt-8 border-t border-[rgba(201,168,76,0.1)]">
                <div className="text-center">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#C9A84C"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mx-auto mb-2"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <p className="font-body text-[9px] uppercase tracking-elegant text-muted">
                    Authenticated
                  </p>
                </div>
                <div className="text-center">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#C9A84C"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mx-auto mb-2"
                  >
                    <rect x="1" y="3" width="15" height="13" rx="2" />
                    <path d="M16 8h4l3 3v5a2 2 0 0 1-2 2h-1" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                  <p className="font-body text-[9px] uppercase tracking-elegant text-muted">
                    Insured Delivery
                  </p>
                </div>
                <div className="text-center">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#C9A84C"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mx-auto mb-2"
                  >
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                  </svg>
                  <p className="font-body text-[9px] uppercase tracking-elegant text-muted">
                    Expert Valuation
                  </p>
                </div>
              </div>
            </div>
          </SectionReveal>
        </div>

        {/* Provenance timeline for pre-owned pieces */}
        {product.category === "preowned" && <ProvenanceTimeline />}
      </div>

      {/* Wishlist modal */}
      <AnimatePresence>
        {showWishlist && (
          <WishlistModal
            product={product}
            onClose={() => setShowWishlist(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
