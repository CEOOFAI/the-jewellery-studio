import GoldDivider from "../components/GoldDivider";
import SectionReveal from "../components/SectionReveal";
import MagneticButton from "../components/MagneticButton";
import useSEO from "../hooks/useSEO";

const services = [
  {
    name: "Pawnbroking",
    image: "/images/luxury-watches.jpg",
    description:
      "Need immediate funds? Our confidential pawnbroking service offers fair, professional valuations against your gold, jewellery, watches, and other valuables. Michael's 38 years of experience means you'll always receive an honest assessment. Every transaction is handled with complete discretion.",
  },
  {
    name: "Bespoke Jewellery",
    image: "/images/diamond-rings.jpg",
    description:
      "From a sketch on a napkin to a finished masterpiece, we bring your vision to life. Whether it's an engagement ring, a milestone gift, or a piece that exists only in your imagination, Michael works directly with you through every stage of the design and creation process.",
  },
  {
    name: "Valuations",
    image: "/images/gemstone-rings.jpg",
    description:
      "Whether for insurance, probate, estate division, or personal knowledge, our valuations are thorough, transparent, and professionally documented. Michael is a fully qualified jewellery valuer and appraiser with decades of hands-on experience.",
  },
  {
    name: "Pre-owned & Antique",
    image: "/images/cartier-collection.jpg",
    description:
      "Our curated collection features pre-owned and antique pieces from the world's most prestigious houses. Cartier, Tiffany, Omega, and beyond. Each piece is authenticated, inspected, and presented with its own story.",
  },
  {
    name: "Repairs & Restoration",
    image: "/images/repairs.png",
    description:
      "From a simple resize to a full restoration, your cherished pieces are in expert hands. Ring sizing, stone replacement, chain repair, replating, and complete jewellery restoration. Michael treats every piece as if it were his own.",
  },
];

export default function Services() {
  useSEO({
    title: "Services | The Jewellery Studio",
    description: "Pawnbroking, valuations, repairs, bespoke design, and pre-owned luxury jewellery. Professional service with 38 years of expertise.",
    url: "/services",
  });
  return (
    <div className="bg-navy min-h-screen pt-32">
      {/* Header */}
      <div className="text-center px-4 mb-16">
        <SectionReveal>
          <p className="font-body text-[11px] uppercase tracking-luxe text-gold mb-4">
            WHAT WE DO
          </p>
          <h1 className="font-display text-4xl md:text-5xl text-warm">
            Our Services
          </h1>
          <GoldDivider className="mt-4" />
        </SectionReveal>
      </div>

      {/* Service sections */}
      {services.map((service, i) => (
        <div key={i}>
          <div
            className={`flex flex-col ${
              i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            }`}
          >
            {/* Image side */}
            <div className="md:w-3/5">
              <SectionReveal variant={i % 2 === 0 ? "fade-left" : "fade-right"}>
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.name}
                    loading="lazy"
                    className="object-cover w-full h-full hover:scale-[1.04] transition-transform duration-700"
                  />
                </div>
              </SectionReveal>
            </div>

            {/* Text side */}
            <div className="md:w-2/5 flex items-center p-8 md:p-12">
              <SectionReveal delay={0.15}>
                <div className="border-l-2 border-gold pl-6">
                  <h2 className="font-display text-3xl md:text-[38px] text-warm mb-4">
                    {service.name}
                  </h2>
                  <p className="font-body text-sm md:text-[14px] text-warm/60 leading-[1.8] mb-4">
                    {service.description}
                  </p>
                  <a
                    href={`https://wa.me/35054013690?text=${encodeURIComponent(`Hi, I'd like to enquire about ${service.name.toLowerCase()}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-gold text-[11px] uppercase tracking-elegant font-body hover:text-gold-muted transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    ENQUIRE ABOUT THIS &rarr;
                  </a>
                </div>
              </SectionReveal>
            </div>
          </div>

          {/* Divider between sections */}
          {i < services.length - 1 && (
            <div className="max-w-xs mx-auto py-2">
              <GoldDivider width={30} />
            </div>
          )}
        </div>
      ))}

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto px-6 py-20">
        <SectionReveal className="text-center mb-12">
          <p className="font-body text-[11px] uppercase tracking-luxe text-gold mb-4">
            COMMON QUESTIONS
          </p>
          <h2 className="font-display text-3xl md:text-[42px] text-warm">
            Frequently Asked
          </h2>
          <GoldDivider className="mt-4" />
        </SectionReveal>

        <div className="space-y-6">
          {[
            {
              q: "Do you buy gold and jewellery?",
              a: "Yes. We buy gold, silver, platinum, diamonds, and designer jewellery. Michael will give you an honest valuation on the spot, with no obligation to sell.",
            },
            {
              q: "How long does a repair take?",
              a: "Most simple repairs like ring resizing, chain soldering, and clasp replacements are done within 1-2 working days. More complex restorations may take up to a week depending on the work involved.",
            },
            {
              q: "Do you offer payment plans?",
              a: "For bespoke commissions and higher-value pieces, we can discuss flexible payment options. Get in touch via WhatsApp and we'll work something out.",
            },
            {
              q: "How does pawnbroking work?",
              a: "You bring in your valuables, Michael appraises them, and we offer you a loan based on their value. You get your items back when the loan is repaid. Everything is confidential and handled with care.",
            },
            {
              q: "Can I commission a custom engagement ring?",
              a: "Absolutely. Michael specialises in bespoke engagement rings. You'll work together to choose the stone, design the setting, and create something completely unique. Most bespoke rings take 2-4 weeks.",
            },
            {
              q: "Are your pre-owned items authenticated?",
              a: "Every pre-owned and antique piece is thoroughly inspected and authenticated before it goes on display. We stand behind everything we sell.",
            },
          ].map((faq, i) => (
            <SectionReveal key={i} delay={i * 0.06}>
              <div className="border-l-2 border-gold/30 pl-6 py-2">
                <h3 className="font-display text-xl text-warm mb-2">
                  {faq.q}
                </h3>
                <p className="font-body text-sm text-warm/60 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>

      {/* CTA */}
      <SectionReveal>
        <div className="text-center py-20">
          <p className="font-body text-[11px] uppercase tracking-luxe text-gold mb-4">
            READY TO GET STARTED?
          </p>
          <h3 className="font-display text-3xl text-warm mb-6">
            Let&apos;s Talk
          </h3>
          <GoldDivider className="mb-8" />
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <MagneticButton
              href="https://wa.me/35054013690"
              className="bg-gold text-white px-8 py-3.5 hover:bg-gold-muted font-body text-[11px] uppercase tracking-elegant inline-flex items-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              MESSAGE ON WHATSAPP
            </MagneticButton>
            <MagneticButton
              href="/contact"
              className="border border-gold text-gold px-8 py-3.5 hover:bg-gold hover:text-white font-body text-[11px] uppercase tracking-elegant"
            >
              CONTACT US
            </MagneticButton>
          </div>
        </div>
      </SectionReveal>
    </div>
  );
}
