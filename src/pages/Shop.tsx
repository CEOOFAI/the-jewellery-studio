import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import GoldDivider from "../components/GoldDivider";
import ProductCard from "../components/ProductCard";
import ProductLightbox from "../components/ProductLightbox";
import SectionReveal from "../components/SectionReveal";
import { supabase } from "../lib/supabase";
import type { Product } from "../lib/supabase";

const filterOptions = [
  { label: "ALL", value: "all" },
  { label: "WATCHES", value: "watches" },
  { label: "ENGAGEMENT", value: "engagement" },
  { label: "GOLD", value: "gold" },
  { label: "NECKLACES", value: "necklaces" },
  { label: "DIAMONDS", value: "diamonds" },
  { label: "PRE-OWNED", value: "preowned" },
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const activeFilter = searchParams.get("category") || "all";

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("active", true)
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });

      if (!error && data) {
        setProducts(data);
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  // Get categories that have products
  const categoriesWithProducts = new Set(products.map((p) => p.category));

  // Filter products by active category
  const filtered =
    activeFilter === "all"
      ? products
      : products.filter((p) => p.category === activeFilter);

  // Only show filter buttons for categories that have products (plus ALL)
  const visibleFilters = filterOptions.filter(
    (f) => f.value === "all" || categoriesWithProducts.has(f.value)
  );

  return (
    <div className="bg-cream min-h-screen pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <SectionReveal className="text-center">
          <h1 className="font-display text-4xl md:text-5xl text-navy">
            The Shop
          </h1>
          <GoldDivider className="mt-4 mb-12" />
        </SectionReveal>

        {/* Filter pills */}
        {!loading && (
          <div className="flex justify-center gap-2 md:gap-3 flex-wrap mb-12">
            {visibleFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => {
                  if (filter.value === "all") {
                    setSearchParams({});
                  } else {
                    setSearchParams({ category: filter.value });
                  }
                }}
                className={`font-body text-[10px] md:text-[11px] uppercase tracking-elegant px-5 py-2 rounded-full transition-all duration-300 ${
                  activeFilter === filter.value
                    ? "bg-gold text-white border border-gold"
                    : "bg-cream border border-cream-border text-navy/40 hover:text-navy/60"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        )}

        {/* Skeleton loading state */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-cream-border/50 rounded-sm" />
                <div className="px-3 py-4 space-y-2">
                  <div className="h-2 w-16 bg-cream-border/50 rounded" />
                  <div className="h-4 w-3/4 bg-cream-border/50 rounded" />
                  <div className="h-3 w-20 bg-cream-border/50 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Product grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
            {filtered.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => setSelectedProduct(product)}
                index={i}
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#C9A84C"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mx-auto mb-6"
            >
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
            </svg>
            <h3 className="font-display text-2xl text-navy/60 mb-2">
              No pieces in this category yet
            </h3>
            <p className="font-body text-sm text-muted mb-8">
              New items are added regularly. Get in touch to enquire about specific pieces.
            </p>
            <a
              href="https://wa.me/35054013690"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gold text-white px-6 py-3 font-body text-[11px] uppercase tracking-elegant rounded-sm hover:bg-gold-muted transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Enquire on WhatsApp
            </a>
          </div>
        )}

        {/* Lightbox */}
        <ProductLightbox
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />

        {/* Bottom Instagram CTA */}
        {!loading && filtered.length > 0 && (
          <div className="text-center mt-16">
            <a
              href="https://www.instagram.com/the_studio_gibraltar/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border border-gold text-gold px-7 py-2.5 font-body text-[11px] uppercase tracking-elegant hover:bg-gold hover:text-white transition-all"
            >
              VIEW MORE ON INSTAGRAM
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
