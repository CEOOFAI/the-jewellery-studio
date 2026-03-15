import GoldDivider from "../components/GoldDivider";
import SectionReveal from "../components/SectionReveal";
import TaxFreeCalculator from "../components/TaxFreeCalculator";
import useSEO from "../hooks/useSEO";

const benefits = [
  {
    title: "Tax-Free Shopping",
    description:
      "Gibraltar has no VAT, no sales tax, and no import duty on jewellery. That means you save 20%+ compared to buying the same piece in the UK or EU.",
  },
  {
    title: "Expert Craftsmanship",
    description:
      "Michael Scott has 38 years of experience crafting fine jewellery. Every piece is certified and comes with a full guarantee.",
  },
  {
    title: "Steps from the Port",
    description:
      "We're at 5 Bell Lane, just a 3 minute walk from the cruise terminal. Pop in, browse, and take something special home with you.",
  },
];

const services = [
  "Engagement rings and wedding bands",
  "Gold and silver jewellery",
  "Loose diamonds and gemstones",
  "Watches and luxury timepieces",
  "Pre-owned designer pieces",
  "Repairs and resizing while you wait",
];

export default function CruiseLanding() {
  useSEO({
    title: "Welcome Cruise Passengers | The Jewellery Studio Gibraltar",
    description: "Tax-free jewellery shopping in Gibraltar. Exclusive offers for cruise ship visitors, just steps from the port.",
    url: "/cruise",
  });

  return (
    <div className="bg-navy min-h-screen pb-20">
      {/* Hero */}
      <section className="bg-gradient-to-b from-navy to-navy-deep pt-[120px] pb-20 md:pb-28">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <SectionReveal>
            <p className="font-body text-[11px] uppercase tracking-luxe text-gold mb-4">
              THE JEWELLERY STUDIO, GIBRALTAR
            </p>
            <h1 className="font-display text-4xl md:text-6xl text-warm mb-4">
              Welcome to Gibraltar
            </h1>
            <p className="font-body text-lg md:text-xl uppercase tracking-elegant text-gold/80">
              Tax-Free Jewellery for Cruise Passengers
            </p>
            <GoldDivider className="mt-8" width={80} />
          </SectionReveal>
        </div>
      </section>

      {/* Why Buy in Gibraltar */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <SectionReveal>
          <p className="font-body text-[11px] uppercase tracking-luxe text-gold mb-4 text-center">
            WHY GIBRALTAR
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-warm text-center mb-4">
            Why Buy Jewellery Here
          </h2>
          <GoldDivider className="mt-2 mb-12" />
        </SectionReveal>

        <div className="grid md:grid-cols-3 gap-6">
          {benefits.map((benefit, i) => (
            <SectionReveal key={benefit.title} delay={i * 0.1}>
              <div className="bg-navy-card border border-gold/20 rounded-sm p-6 h-full">
                <h3 className="font-display text-xl text-gold mb-3">
                  {benefit.title}
                </h3>
                <p className="font-body text-sm text-muted leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>

      {/* Tax-Free Calculator */}
      <section className="bg-navy-deep py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <SectionReveal>
            <p className="font-body text-[11px] uppercase tracking-luxe text-gold mb-4 text-center">
              SAVINGS CALCULATOR
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-warm text-center mb-4">
              See How Much You Save
            </h2>
            <GoldDivider className="mt-2 mb-12" />
          </SectionReveal>

          <SectionReveal delay={0.1}>
            <TaxFreeCalculator />
          </SectionReveal>
        </div>
      </section>

      {/* What We Offer */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <SectionReveal>
          <p className="font-body text-[11px] uppercase tracking-luxe text-gold mb-4 text-center">
            OUR COLLECTION
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-warm text-center mb-4">
            What We Offer
          </h2>
          <GoldDivider className="mt-2 mb-12" />
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <ul className="max-w-md mx-auto space-y-4">
            {services.map((service) => (
              <li key={service} className="flex items-start gap-3">
                <span className="text-gold mt-1 text-sm">&#9670;</span>
                <span className="font-body text-warm text-base">
                  {service}
                </span>
              </li>
            ))}
          </ul>
        </SectionReveal>
      </section>

      {/* Location & Hours */}
      <section className="bg-navy-deep py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <SectionReveal>
            <p className="font-body text-[11px] uppercase tracking-luxe text-gold mb-4 text-center">
              FIND US
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-warm text-center mb-4">
              Location &amp; Hours
            </h2>
            <GoldDivider className="mt-2 mb-12" />
          </SectionReveal>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <SectionReveal delay={0.1}>
              <div className="bg-navy-card border border-gold/20 rounded-sm p-6">
                <h3 className="font-display text-xl text-gold mb-4">
                  Address
                </h3>
                <p className="font-body text-warm text-sm leading-relaxed mb-2">
                  5 Bell Lane
                  <br />
                  Gibraltar GX11 1AA
                </p>
                <p className="font-body text-gold/70 text-sm mb-4">
                  3 minutes walk from the cruise terminal
                </p>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=The+Jewellery+Studio+5+Bell+Lane+Gibraltar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block font-body text-xs uppercase tracking-luxe text-gold border border-gold/40 rounded-sm px-4 py-2 hover:bg-gold/10 transition-colors"
                >
                  Open in Google Maps
                </a>
              </div>
            </SectionReveal>

            <SectionReveal delay={0.2}>
              <div className="bg-navy-card border border-gold/20 rounded-sm p-6">
                <h3 className="font-display text-xl text-gold mb-4">
                  Opening Hours
                </h3>
                <div className="space-y-2 font-body text-sm">
                  <div className="flex justify-between text-warm">
                    <span>Monday to Friday</span>
                    <span>10am &ndash; 6pm</span>
                  </div>
                  <div className="flex justify-between text-warm">
                    <span>Saturday</span>
                    <span>10am &ndash; 2pm</span>
                  </div>
                  <div className="flex justify-between text-muted">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24 text-center">
        <SectionReveal>
          <p className="font-body text-[11px] uppercase tracking-luxe text-gold mb-4">
            GET IN TOUCH
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-warm mb-4">
            Planning Your Visit?
          </h2>
          <p className="font-body text-muted text-base mb-8 max-w-lg mx-auto">
            Message Michael in advance to let him know what you're looking for.
            He'll have everything ready when you arrive.
          </p>
          <a
            href="https://wa.me/35054013690?text=Hi%20Michael%2C%20I%27m%20visiting%20Gibraltar%20on%20a%20cruise%20and%20would%20love%20to%20visit%20the%20studio."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-body text-sm uppercase tracking-luxe px-8 py-4 rounded-sm transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Message on WhatsApp
          </a>
        </SectionReveal>
      </section>
    </div>
  );
}
