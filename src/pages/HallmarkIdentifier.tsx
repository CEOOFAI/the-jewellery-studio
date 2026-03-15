import { useState, useEffect, useRef, useCallback } from "react";
import useSEO from "../hooks/useSEO";
import GoldDivider from "../components/GoldDivider";
import SectionReveal from "../components/SectionReveal";
import { supabase } from "../lib/supabase";

interface Hallmark {
  id: string;
  name: string;
  category: string;
  description: string | null;
  country: string | null;
  era: string | null;
  image_url: string | null;
  searchable_text: string | null;
}

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "Assay Office", label: "Assay Office" },
  { value: "Date Letter", label: "Date Letter" },
  { value: "Standard Mark", label: "Standard Mark" },
  { value: "Maker Mark", label: "Maker Mark" },
];

function SkeletonCard() {
  return (
    <div className="bg-navy-card border border-gold/20 rounded-sm overflow-hidden animate-pulse">
      <div className="aspect-square bg-navy-deep" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-navy-deep rounded w-3/4" />
        <div className="h-4 bg-navy-deep rounded w-1/3" />
        <div className="space-y-1.5">
          <div className="h-3 bg-navy-deep rounded w-full" />
          <div className="h-3 bg-navy-deep rounded w-5/6" />
          <div className="h-3 bg-navy-deep rounded w-2/3" />
        </div>
      </div>
    </div>
  );
}

function PlaceholderIcon() {
  return (
    <div className="aspect-square bg-navy-deep flex items-center justify-center">
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="24" cy="24" r="18" stroke="#C9A84C" strokeWidth="1" opacity="0.3" />
        <text
          x="24"
          y="28"
          textAnchor="middle"
          fill="#C9A84C"
          fontSize="16"
          fontFamily="Cormorant Garamond, serif"
          opacity="0.5"
        >
          ?
        </text>
      </svg>
    </div>
  );
}

export default function HallmarkIdentifier() {
  useSEO({
    title: "Hallmark Identifier | The Jewellery Studio",
    description: "Search and identify hallmarks on your jewellery. Find assay office marks, date letters, and maker's marks.",
    url: "/hallmarks",
  });

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [hallmarks, setHallmarks] = useState<Hallmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce search input
  const handleSearchChange = useCallback((value: string) => {
    setSearchInput(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(value);
    }, 300);
  }, []);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // Fetch hallmarks
  useEffect(() => {
    let cancelled = false;

    async function fetchHallmarks() {
      setLoading(true);
      setError(false);

      let query = supabase.from("v2_hallmarks").select("*").order("name");

      if (category !== "all") {
        query = query.eq("category", category);
      }

      if (debouncedSearch) {
        query = query.ilike("searchable_text", `%${debouncedSearch}%`);
      }

      const { data, error: fetchError } = await query;

      if (cancelled) return;

      if (fetchError) {
        setError(true);
        setLoading(false);
        return;
      }

      setHallmarks((data as Hallmark[]) || []);
      setLoading(false);
    }

    fetchHallmarks();

    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, category]);

  return (
    <div className="bg-navy min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-16 bg-navy-deep">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <SectionReveal>
            <p className="font-body text-[11px] uppercase tracking-luxe text-gold mb-4">
              Education
            </p>
            <h1 className="font-display text-5xl md:text-7xl text-warm mb-4">
              Hallmark Identifier
            </h1>
            <GoldDivider className="mb-8" />
            <p className="font-body text-muted leading-relaxed max-w-lg mx-auto">
              Look up any hallmark to learn what it means. Search by name,
              country, or category.
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* Search + Filter */}
      <section className="py-12 bg-navy">
        <div className="max-w-6xl mx-auto px-6">
          <SectionReveal>
            {/* Search input */}
            <div className="max-w-xl mx-auto mb-8">
              <div className="relative">
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/50"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search hallmarks..."
                  className="w-full bg-navy-card border border-gold/20 rounded-sm py-3 pl-12 pr-4 font-body text-warm placeholder:text-muted/50 focus:outline-none focus:border-gold/50 transition-colors"
                />
              </div>
            </div>

            {/* Category filters */}
            <div className="flex flex-wrap justify-center gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`font-body text-[11px] uppercase tracking-elegant px-5 py-2 rounded-full transition-colors duration-200 ${
                    category === cat.value
                      ? "bg-gold text-white"
                      : "bg-navy-card border border-gold/20 text-gold hover:border-gold/40"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Results */}
      <section className="pb-16 bg-navy">
        <div className="max-w-6xl mx-auto px-6">
          {/* Loading state */}
          {loading && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {/* Error state */}
          {!loading && error && (
            <SectionReveal>
              <div className="text-center py-20">
                <p className="font-body text-muted text-lg mb-2">
                  Something went wrong loading hallmarks.
                </p>
                <p className="font-body text-muted/60 text-sm">
                  Please try refreshing the page.
                </p>
              </div>
            </SectionReveal>
          )}

          {/* Empty state */}
          {!loading && !error && hallmarks.length === 0 && (
            <SectionReveal>
              <div className="text-center py-20">
                <p className="font-body text-muted text-lg mb-2">
                  No hallmarks found matching your search.
                </p>
                <p className="font-body text-muted/60 text-sm">
                  Try different terms or browse by category.
                </p>
              </div>
            </SectionReveal>
          )}

          {/* Results grid */}
          {!loading && !error && hallmarks.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {hallmarks.map((hallmark, i) => (
                <SectionReveal key={hallmark.id} delay={Math.min(i * 0.05, 0.3)}>
                  <div className="bg-navy-card border border-gold/20 rounded-sm overflow-hidden">
                    {hallmark.image_url ? (
                      <img
                        src={hallmark.image_url}
                        alt={hallmark.name}
                        className="aspect-square w-full object-cover"
                      />
                    ) : (
                      <PlaceholderIcon />
                    )}
                    <div className="p-4">
                      <h3 className="font-display text-lg text-warm mb-2">
                        {hallmark.name}
                      </h3>
                      <span className="inline-block font-body text-[10px] uppercase tracking-elegant bg-gold/10 text-gold border border-gold/20 rounded-full px-3 py-0.5 mb-3">
                        {hallmark.category}
                      </span>
                      {(hallmark.country || hallmark.era) && (
                        <p className="font-body text-muted/70 text-xs mb-2">
                          {[hallmark.country, hallmark.era]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      )}
                      {hallmark.description && (
                        <p className="font-body text-muted text-sm leading-relaxed line-clamp-3">
                          {hallmark.description}
                        </p>
                      )}
                    </div>
                  </div>
                </SectionReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="py-20 bg-navy-deep">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <SectionReveal>
            <h2 className="font-display text-4xl md:text-5xl text-warm mb-4">
              Can't Identify a Mark?
            </h2>
            <GoldDivider className="mb-8" />
            <p className="font-body text-muted leading-relaxed mb-10">
              Send Michael a photo and he'll help you identify it. With 38 years
              in the trade, there's not much he hasn't seen.
            </p>
            <a
              href="https://wa.me/35054013690?text=Hi%20Michael%2C%20I%20have%20a%20hallmark%20I%20can%27t%20identify."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gold text-white px-8 py-3.5 font-body text-[11px] uppercase tracking-elegant hover:bg-gold-muted transition-colors"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Send Michael a Photo
            </a>
          </SectionReveal>
        </div>
      </section>
    </div>
  );
}
