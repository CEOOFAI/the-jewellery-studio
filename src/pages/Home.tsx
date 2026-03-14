import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import GoldDivider from "../components/GoldDivider";
import SectionReveal from "../components/SectionReveal";
import MagneticButton from "../components/MagneticButton";
import GoldParticles from "../components/GoldParticles";
import HeroRing from "../components/HeroRing";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

const wordVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

const headingContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const collectionImages = [
  { src: "/images/luxury-watches.jpg", alt: "Pre-owned luxury watches including Rolex and Omega at The Jewellery Studio Gibraltar" },
  { src: "/images/diamond-rings.jpg", alt: "Hand-crafted diamond engagement rings on display at The Jewellery Studio" },
  { src: "/images/gemstone-rings.jpg", alt: "Collection of coloured gemstone rings available in Gibraltar" },
];

const services = [
  {
    name: "Pawnbroking",
    description: "Confidential, fair valuations with immediate funds against your valuables.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L4 7v5c0 5.25 3.4 10.15 8 11.25C16.6 22.15 20 17.25 20 12V7l-8-5z" />
      </svg>
    ),
  },
  {
    name: "Bespoke Jewellery",
    description: "Commission a one-of-a-kind piece crafted to your exact vision.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12,2 15,9 22,9 16.5,14 18.5,21 12,17 5.5,21 7.5,14 2,9 9,9" />
      </svg>
    ),
  },
  {
    name: "Valuations",
    description: "Professional appraisals for insurance, probate, or personal knowledge.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    name: "Repairs & Restoration",
    description: "Expert restoration to bring your cherished pieces back to their original beauty.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    name: "Pre-owned & Antique",
    description: "Curated designer and antique pieces. Cartier, Tiffany, Omega, and beyond.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12,6 12,12 16,14" />
      </svg>
    ),
  },
];

const googleReviews = [
  {
    name: "Ivanka Pazio",
    rating: 5,
    text: "Beautiful new shop in the new location and helpful people working there. Good selection of unique pieces. Highly recommended!",
    date: "3 months ago",
  },
  {
    name: "Candace Watters",
    rating: 5,
    text: "THE ONLY PLACE TO SHOP! Lovely couple, great selection of loose stones and made up jewellery. This is the only shop to come to.",
    date: "7 months ago",
  },
  {
    name: "Darryl Leanour",
    rating: 5,
    text: "The best place in Gibraltar for repairs, custom work or gemstones. Run by an actual jeweller, unlike most of the shops in Gib. Friendly and experienced. We wouldn't go anywhere else.",
    date: "1 year ago",
  },
];

const categories = [
  { name: "Watches", image: "/images/luxury-watches.jpg", slug: "watches", alt: "Shop luxury watches in Gibraltar" },
  { name: "Engagement", image: "/images/diamond-rings.jpg", slug: "engagement", alt: "Shop engagement rings in Gibraltar" },
  { name: "Gold", image: "/images/gold-rings-closeup.jpg", slug: "gold", alt: "Shop gold jewellery in Gibraltar" },
  { name: "Necklaces", image: "/images/necklace-display.jpg", slug: "necklaces", alt: "Shop necklaces and pendants in Gibraltar" },
  { name: "Diamonds", image: "/images/gemstone-rings.jpg", slug: "diamonds", alt: "Shop diamond jewellery in Gibraltar" },
  { name: "Pre-Owned", image: "/images/cartier-collection.jpg", slug: "preowned", alt: "Shop pre-owned designer jewellery including Cartier and Tiffany" },
];

export default function Home() {
  const headingWords = ["The", "Jewellery", "Studio"];

  return (
    <>
      {/* Section 1: Hero */}
      <section className="min-h-screen relative overflow-hidden flex items-center justify-center">
        <img
          src="/images/shop-interior.jpg"
          alt="The Jewellery Studio interior"
          className="absolute inset-0 w-full h-full object-cover animate-[kenBurns_12s_ease-in-out_infinite_alternate]"
        />
        <GoldParticles className="absolute inset-0 z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(27,42,63,0.3)] to-[rgba(27,42,63,0.6)] z-10" />

        <div className="relative z-20 text-center flex flex-col items-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center"
          >
            <motion.p
              variants={childVariants}
              className="font-body text-[11px] uppercase tracking-luxe text-gold"
            >
              ESTABLISHED IN GIBRALTAR
            </motion.p>

            <motion.h1
              variants={headingContainerVariants}
              initial="hidden"
              animate="visible"
              className="font-display text-5xl md:text-7xl lg:text-[80px] text-white font-light tracking-wide mt-4"
            >
              {headingWords.map((word, i) => (
                <motion.span
                  key={i}
                  variants={wordVariants}
                  className="inline-block mr-4 last:mr-0"
                >
                  {word}
                </motion.span>
              ))}
            </motion.h1>

            <motion.div variants={childVariants}>
              <GoldDivider width={40} className="my-6" />
            </motion.div>

            <motion.p
              variants={childVariants}
              className="font-body text-sm md:text-base text-white/85 italic"
            >
              Every piece of jewellery tells a story.
            </motion.p>

            <motion.div variants={childVariants} className="mt-8">
              <MagneticButton
                href="/shop"
                className="border border-white text-white px-8 py-3.5 hover:bg-gold hover:border-gold hover:text-white font-body text-[11px] uppercase tracking-elegant"
              >
                EXPLORE THE COLLECTION
              </MagneticButton>
            </motion.div>
          </motion.div>

          <div className="hidden md:block w-[380px] h-[380px] relative z-20 mx-auto mt-8">
            <HeroRing />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-[gentleBounce_2.5s_ease-in-out_infinite]">
          <svg width="20" height="12" viewBox="0 0 20 12" fill="none" stroke="white" strokeWidth="1.5">
            <path d="M2 2l8 8 8-8" />
          </svg>
        </div>
      </section>

      {/* Section 2: From Our Collection */}
      <section className="bg-cream py-20 md:py-28">
        <SectionReveal className="text-center px-4">
          <p className="font-body text-[11px] uppercase tracking-luxe text-gold mb-4">
            FROM OUR COLLECTION
          </p>
          <h2 className="font-display text-3xl md:text-[42px] text-navy mb-4">
            Crafted to Perfection
          </h2>
          <GoldDivider className="mb-10" />
        </SectionReveal>

        {/* Desktop grid */}
        <div className="hidden md:grid grid-cols-3 gap-5 max-w-6xl mx-auto px-6">
          {collectionImages.map((img, i) => (
            <SectionReveal key={i} delay={i * 0.1}>
              <div className="w-full h-[280px] overflow-hidden">
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="object-cover w-full h-full hover:scale-[1.03] transition-transform duration-400"
                />
              </div>
            </SectionReveal>
          ))}
        </div>

        {/* Mobile horizontal scroll */}
        <div className="flex md:hidden overflow-x-auto snap-x gap-5 px-6 pb-4">
          {collectionImages.map((img, i) => (
            <div key={i} className="w-[380px] h-[280px] overflow-hidden flex-shrink-0 snap-center">
              <img
                src={img.src}
                alt={img.alt}
                className="object-cover w-full h-full hover:scale-[1.03] transition-transform duration-400"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Section 3: Our Services Preview */}
      <section id="services" className="bg-white py-20 md:py-28">
        <SectionReveal className="text-center px-4">
          <p className="font-body text-[11px] uppercase tracking-luxe text-gold mb-4">
            WHAT WE DO
          </p>
          <h2 className="font-display text-3xl md:text-[42px] text-navy mb-4">
            Our Services
          </h2>
          <GoldDivider className="mb-12" />
        </SectionReveal>

        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {services.map((service, i) => (
              <SectionReveal
                key={i}
                delay={i * 0.08}
                className={i === 4 ? "col-span-2 md:col-span-1 max-w-[280px] mx-auto md:max-w-none" : ""}
              >
                <div className="bg-cream border border-cream-border rounded-sm p-7 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full">
                  {service.icon}
                  <h3 className="font-display text-xl md:text-[22px] text-navy mt-4 mb-2">
                    {service.name}
                  </h3>
                  <p className="font-body text-[13px] text-muted leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </SectionReveal>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/services"
              className="text-gold uppercase text-[11px] tracking-elegant hover:text-gold-muted font-body transition-colors"
            >
              VIEW ALL SERVICES &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Section 4: Google Reviews */}
      <section className="bg-cream py-20 md:py-28">
        <SectionReveal className="text-center px-4">
          <p className="font-body text-[11px] uppercase tracking-luxe text-gold mb-4">
            WHAT OUR CLIENTS SAY
          </p>
          <h2 className="font-display text-3xl md:text-[42px] text-navy mb-2">
            5-Star Reviews
          </h2>
          <div className="flex items-center justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <svg key={i} width="20" height="20" viewBox="0 0 24 24" fill="#C9A84C" stroke="none">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
              </svg>
            ))}
          </div>
          <p className="font-body text-xs text-muted">
            4 reviews on Google
          </p>
          <GoldDivider className="mt-4 mb-12" />
        </SectionReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto px-6">
          {googleReviews.map((review, i) => (
            <SectionReveal key={i} delay={i * 0.08}>
              <div className="bg-white border border-cream-border rounded-sm p-6 h-full flex flex-col">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(review.rating)].map((_, j) => (
                    <svg key={j} width="14" height="14" viewBox="0 0 24 24" fill="#C9A84C" stroke="none">
                      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                    </svg>
                  ))}
                </div>
                <p className="font-body text-[13px] text-navy/80 leading-relaxed flex-1 mb-4">
                  &ldquo;{review.text}&rdquo;
                </p>
                <div className="flex items-center justify-between">
                  <p className="font-display text-sm text-navy font-medium">
                    {review.name}
                  </p>
                  <p className="font-body text-[10px] text-muted">
                    {review.date}
                  </p>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>

        <SectionReveal delay={0.4}>
          <div className="text-center mt-10">
            <a
              href="https://www.google.com/maps?q=The+Jewellery+Studio,+5+Bell+Lane,+Gibraltar+GX11+1AA"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-gold uppercase text-[11px] tracking-elegant hover:text-gold-muted font-body transition-colors"
            >
              {/* Google "G" icon */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 001 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              READ ALL REVIEWS ON GOOGLE &rarr;
            </a>
          </div>
        </SectionReveal>
      </section>

      {/* Section 5: Shop by Category */}
      <section className="bg-cream py-20 md:py-28">
        <SectionReveal className="text-center px-4">
          <p className="font-body text-[11px] uppercase tracking-luxe text-gold mb-4">
            EXPLORE
          </p>
          <h2 className="font-display text-3xl md:text-[42px] text-navy mb-4">
            Shop by Category
          </h2>
          <GoldDivider className="mb-12" />
        </SectionReveal>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-8 max-w-5xl mx-auto px-6">
          {categories.map((cat, i) => (
            <SectionReveal key={i} delay={i * 0.06}>
              <Link to={`/shop?category=${cat.slug}`} className="block text-center group">
                <div className="w-[100px] h-[100px] md:w-[200px] md:h-[200px] rounded-full overflow-hidden mx-auto relative">
                  <img
                    src={cat.image}
                    alt={cat.alt}
                    loading="lazy"
                    className="object-cover w-full h-full group-hover:scale-[1.04] transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-[rgba(27,42,63,0.65)] md:opacity-0 md:group-hover:opacity-100 opacity-100 transition-opacity flex items-center justify-center">
                    <span className="font-body text-[9px] md:text-xs uppercase tracking-elegant text-white">
                      {cat.name}
                    </span>
                  </div>
                </div>
              </Link>
            </SectionReveal>
          ))}
        </div>
      </section>

      {/* Section 5: Instagram Strip */}
      <section className="bg-white py-20">
        <div className="text-center px-4">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-12 h-px bg-gold/30" />
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="5" />
              <circle cx="17.5" cy="6.5" r="1" fill="#C9A84C" stroke="none" />
            </svg>
            <div className="w-12 h-px bg-gold/30" />
          </div>

          <a
            href="https://www.instagram.com/the_studio_gibraltar/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-display text-2xl md:text-3xl text-navy hover:text-gold transition-colors"
          >
            @the_studio_gibraltar
          </a>

          <p className="font-body text-[10px] uppercase tracking-elegant text-muted mt-3 mb-6">
            1,437 FOLLOWERS
          </p>

          <a
            href="https://www.instagram.com/the_studio_gibraltar/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border border-gold text-gold px-7 py-2.5 font-body text-[11px] uppercase tracking-elegant hover:bg-gold hover:text-white transition-all"
          >
            FOLLOW US
          </a>
        </div>
      </section>
    </>
  );
}
