import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import GoldDivider from "../components/GoldDivider";
import SectionReveal from "../components/SectionReveal";
import MagneticButton from "../components/MagneticButton";

const brandLogos = [
  { src: "/images/brands/cartier.png", alt: "Cartier" },
  { src: "/images/brands/tiffany.png", alt: "Tiffany & Co" },
  { src: "/images/brands/omega.png", alt: "Omega" },
  { src: "/images/brands/rolex.png", alt: "Rolex" },
  { src: "/images/brands/tissot.png", alt: "Tissot" },
  { src: "/images/brands/pandora.png", alt: "Pandora" },
  { src: "/images/brands/david-yurman.png", alt: "David Yurman" },
  { src: "/images/brands/tag-heuer.png", alt: "TAG Heuer" },
];

const galleryImages = [
  { src: "/images/watch-cabinet.jpg", alt: "Luxury watch cabinet displaying Rolex, Omega and TAG Heuer timepieces", aspect: "aspect-[4/3]" },
  { src: "/images/fine-jewellery-display.jpg", alt: "Fine jewellery display case with diamond and gold pieces", aspect: "aspect-[3/4]" },
  { src: "/images/ring-tray.jpg", alt: "Tray of handcrafted gold and diamond rings at The Jewellery Studio", aspect: "aspect-[3/4]" },
  { src: "/images/tiffany-display.jpg", alt: "Tiffany & Co designer jewellery on display in Gibraltar", aspect: "aspect-[4/3]" },
  { src: "/images/fine-jewellery-closeup.jpg", alt: "Close-up of fine jewellery pieces including gemstone rings", aspect: "aspect-[4/3]" },
  { src: "/images/silver-jewellery.jpg", alt: "Silver jewellery collection including bracelets and pendants", aspect: "aspect-[3/4]" },
];

export default function Showroom() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);

  return (
    <>
      {/* Hero */}
      <section ref={heroRef} className="relative h-[60vh] overflow-hidden">
        <motion.img
          src="/images/shop-interior.jpg"
          alt="The Jewellery Studio showroom"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ y: heroY }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(27,42,63,0.8)] via-[rgba(27,42,63,0.3)] to-[rgba(27,42,63,0.2)]" />

        <div className="absolute bottom-12 left-0 right-0 z-10 text-center">
          <p className="font-body text-[11px] uppercase tracking-luxe text-gold mb-3">
            WELCOME TO
          </p>
          <h1 className="font-display text-4xl md:text-5xl text-white">
            The Showroom
          </h1>
          <GoldDivider width={40} className="mt-5" />
        </div>
      </section>

      {/* Brand strip */}
      <section className="bg-navy py-8 md:py-10 overflow-hidden relative">
        <p className="font-body text-[9px] tracking-luxe uppercase text-white/30 text-center mb-4">
          FEATURING PIECES FROM
        </p>
        <div className="relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-navy to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-navy to-transparent z-10" />

          <div className="flex animate-[marqueeScroll_25s_linear_infinite]">
            {[...brandLogos, ...brandLogos].map((logo, i) => (
              <img
                key={i}
                src={logo.src}
                alt={logo.alt}
                className="h-8 md:h-10 w-auto object-contain brightness-0 invert opacity-80 mx-8 md:mx-12 flex-shrink-0"
              />
            ))}
          </div>
        </div>
      </section>

      {/* About the showroom */}
      <section className="bg-navy-deep py-20">
        <SectionReveal className="text-center px-6">
          <p className="font-body text-[15px] text-warm/70 max-w-xl mx-auto leading-relaxed">
            Step inside and discover our carefully curated collection of fine jewellery, luxury watches, and antique pieces. Every item in our showroom has been selected for its craftsmanship, beauty, and story.
          </p>
        </SectionReveal>
      </section>

      {/* Photo grid */}
      <section className="bg-navy py-16 px-4 md:px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 gap-4 md:gap-6">
          {galleryImages.map((img, i) => (
            <SectionReveal
              key={i}
              variant={i % 2 === 0 ? "fade-left" : "fade-right"}
              delay={i * 0.08}
            >
              <div className={`${img.aspect} overflow-hidden rounded-sm`}>
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="object-cover w-full h-full hover:scale-[1.04] transition-transform duration-700"
                />
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy-deep py-20">
        <SectionReveal className="text-center px-6">
          <p className="font-body text-[11px] uppercase tracking-luxe text-gold mb-4">
            152 MAIN STREET, GIBRALTAR
          </p>
          <h3 className="font-display text-3xl text-warm mb-6">
            Visit Us In Person
          </h3>
          <GoldDivider className="mb-8" />
          <MagneticButton
            href="/contact"
            className="border border-gold text-gold px-8 py-3.5 hover:bg-gold hover:text-white font-body text-[11px] uppercase tracking-elegant"
          >
            GET DIRECTIONS
          </MagneticButton>
        </SectionReveal>
      </section>
    </>
  );
}
