import { useState, useEffect, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import useSEO from "../hooks/useSEO";
import GoldDivider from "../components/GoldDivider";
import SectionReveal from "../components/SectionReveal";
import ProductCard from "../components/ProductCard";
import ProductLightbox from "../components/ProductLightbox";
import { supabase } from "../lib/supabase";
import type { Product } from "../lib/supabase";
import { isValidPhone } from "../lib/constants";

const exclusivityPoints = [
  "First access to newly acquired pieces",
  "Private viewings arranged at your convenience",
  "Direct communication with Michael",
];

export default function Vault() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  useSEO({
    title: "The Vault | The Jewellery Studio",
    description: "Access our exclusive private collection of rare and exceptional pieces.",
    url: "/vault",
  });

  if (token) {
    return <PrivateVault />;
  }

  return <PublicVault />;
}

/* ─── Private View ─── */

function PrivateVault() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function fetchVaultProducts() {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("vault", true);

      if (!error && data && data.length > 0) {
        setProducts(data);
      }
      setLoading(false);
    }
    fetchVaultProducts();
  }, []);

  return (
    <div className="bg-navy-deep min-h-screen pt-32 pb-20">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <SectionReveal className="text-center">
          <p className="font-body text-[11px] uppercase tracking-luxe text-gold mb-4">
            EXCLUSIVE COLLECTION
          </p>
          <h1 className="font-display text-4xl md:text-5xl text-warm">
            Welcome to The Vault
          </h1>
          <GoldDivider className="mt-4 mb-12" />
        </SectionReveal>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-navy-card rounded-sm" />
                <div className="px-3 py-4 space-y-2">
                  <div className="h-2 w-16 bg-navy-card rounded" />
                  <div className="h-4 w-3/4 bg-navy-card rounded" />
                  <div className="h-3 w-20 bg-navy-card rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Products grid */}
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
            {products.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => setSelectedProduct(product)}
                index={i}
              />
            ))}
          </div>
        )}

        {/* Empty / error state */}
        {!loading && products.length === 0 && (
          <SectionReveal className="text-center py-20">
            <div className="mx-auto mb-6 select-none">
              <span className="font-display text-5xl text-warm/10 tracking-wide">
                TJS
              </span>
            </div>
            <h3 className="font-display text-2xl text-warm/60 mb-2">
              The Vault is being curated
            </h3>
            <p className="font-body text-sm text-warm/40">
              Check back soon.
            </p>
          </SectionReveal>
        )}

        {/* Lightbox */}
        <ProductLightbox
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      </div>
    </div>
  );
}

/* ─── Public View ─── */

function PublicVault() {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!isValidPhone(whatsapp)) {
      setError("Please enter a valid WhatsApp number.");
      return;
    }

    setSubmitting(true);

    const { error: dbError } = await supabase
      .from("v2_vault_applications")
      .insert({ name: name.trim(), whatsapp: whatsapp.trim(), reason: reason.trim() });

    setSubmitting(false);

    if (dbError) {
      setError("Something went wrong. Please try again.");
      return;
    }

    setSubmitted(true);
  }

  return (
    <div className="bg-navy-deep min-h-screen pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        {/* Hero */}
        <SectionReveal className="text-center">
          <h1 className="font-display text-5xl md:text-6xl text-warm">
            The Vault
          </h1>
          <p className="font-body text-[11px] uppercase tracking-luxe text-gold mt-4 mb-2">
            BY INVITATION ONLY
          </p>
          <GoldDivider className="mt-4 mb-12" />
        </SectionReveal>

        {/* Description */}
        <SectionReveal delay={0.1} className="text-center max-w-xl mx-auto mb-14">
          <p className="font-body text-sm text-warm/70 leading-relaxed">
            The Vault is our private collection of extraordinary pieces. Rare
            finds, museum-quality antiques, and one-of-a-kind commissions
            reserved for our most discerning clients.
          </p>
        </SectionReveal>

        {/* Exclusivity points */}
        <SectionReveal delay={0.2} className="mb-16">
          <ul className="flex flex-col items-center gap-4">
            {exclusivityPoints.map((point) => (
              <li key={point} className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-gold shrink-0" />
                <span className="font-body text-sm text-warm/80">{point}</span>
              </li>
            ))}
          </ul>
        </SectionReveal>

        {/* Application form */}
        <SectionReveal delay={0.3} className="max-w-md mx-auto">
          {submitted ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 rounded-full border-2 border-gold flex items-center justify-center mx-auto mb-6">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#C9A84C"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p className="font-display text-xl text-warm mb-2">
                Application Received
              </p>
              <p className="font-body text-sm text-warm/60">
                Your application has been received. Michael will be in touch.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-navy-card border border-gold/30 text-warm px-4 py-3 rounded-sm font-body text-sm placeholder:text-warm/30 focus:border-gold focus:outline-none transition-colors"
                />
              </div>

              <div>
                <input
                  type="tel"
                  placeholder="WhatsApp number"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full bg-navy-card border border-gold/30 text-warm px-4 py-3 rounded-sm font-body text-sm placeholder:text-warm/30 focus:border-gold focus:outline-none transition-colors"
                />
              </div>

              <div>
                <textarea
                  placeholder="What are you looking for?"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                  className="w-full bg-navy-card border border-gold/30 text-warm px-4 py-3 rounded-sm font-body text-sm placeholder:text-warm/30 focus:border-gold focus:outline-none transition-colors resize-none"
                />
              </div>

              {error && (
                <p className="font-body text-xs text-red-400 text-center">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gold text-white py-3 font-body text-[11px] uppercase tracking-elegant rounded-sm hover:bg-gold-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "SUBMITTING..." : "REQUEST ACCESS"}
              </button>
            </form>
          )}
        </SectionReveal>
      </div>
    </div>
  );
}
