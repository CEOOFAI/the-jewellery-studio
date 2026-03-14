import GoldDivider from "../components/GoldDivider";
import SectionReveal from "../components/SectionReveal";
import AnimatedCounter from "../components/AnimatedCounter";
import MagneticButton from "../components/MagneticButton";
import usePageTitle from "../hooks/usePageTitle";

export default function About() {
  usePageTitle("About Michael & Stephanie Scott");
  return (
    <div className="bg-navy min-h-screen pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <SectionReveal>
          <p className="font-body text-[11px] uppercase tracking-luxe text-gold mb-4">
            OUR STORY
          </p>
          <h1 className="font-display text-4xl md:text-5xl text-warm">
            Michael &amp; Stephanie
          </h1>
          <GoldDivider className="mt-4 mb-12" />
        </SectionReveal>

        {/* Photos */}
        <div className="grid grid-cols-2 gap-4 md:gap-8 mb-14 md:mb-20">
          <SectionReveal delay={0.1}>
            <div className="aspect-[3/4] overflow-hidden rounded-sm">
              <img
                src="/images/michael.png"
                alt="Michael Scott, master jeweller and owner of The Jewellery Studio Gibraltar"
                className="object-cover w-full h-full"
                style={{ objectPosition: "center 55%" }}
              />
            </div>
          </SectionReveal>
          <SectionReveal delay={0.2}>
            <div className="aspect-[3/4] overflow-hidden rounded-sm">
              <img
                src="/images/stephanie.png"
                alt="Stephanie Scott, co-owner of The Jewellery Studio Gibraltar"
                className="object-cover w-full h-full"
              />
            </div>
          </SectionReveal>
        </div>

        {/* Stats bar */}
        <SectionReveal>
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12 mb-14">
            <div className="text-center">
              <AnimatedCounter
                target={38}
                suffix=" Years"
                className="font-display text-2xl md:text-3xl text-gold"
              />
              <p className="font-body text-[10px] uppercase tracking-elegant text-muted mt-1">
                Experience
              </p>
            </div>

            <div className="w-8 h-px md:w-1.5 md:h-1.5 md:rounded-full bg-gold/30 md:bg-gold flex-shrink-0" />

            <div className="text-center">
              <p className="font-display text-2xl md:text-3xl text-gold">
                Master Jeweller
              </p>
              <p className="font-body text-[10px] uppercase tracking-elegant text-muted mt-1">
                Qualification
              </p>
            </div>

            <div className="w-8 h-px md:w-1.5 md:h-1.5 md:rounded-full bg-gold/30 md:bg-gold flex-shrink-0" />

            <div className="text-center">
              <p className="font-display text-2xl md:text-3xl text-gold">
                Main Street
              </p>
              <p className="font-body text-[10px] uppercase tracking-elegant text-muted mt-1">
                Location
              </p>
            </div>
          </div>
        </SectionReveal>

        {/* Body text */}
        <SectionReveal>
          <div className="max-w-2xl mx-auto text-left">
            <p className="font-body text-[15px] text-warm/60 leading-[1.9] mb-6">
              Michael left school at 16 and jumped straight into the world of jewellery, investing all of his time and energy into learning everything he could about the craft. 38 years later, he is a qualified jeweller, stone setter, diamond grader and gemologist, as well as a fully qualified jewellery valuer and appraiser.
            </p>
            <p className="font-body text-[15px] text-warm/60 leading-[1.9] mb-6">
              Together with Stephanie, the pair have built The Jewellery Studio into a trusted cornerstone of Main Street. Whether you are looking to commission a bespoke engagement ring, find the perfect pre-owned piece, or need a confidential pawnbroking service, they bring decades of expertise and genuine care to every interaction.
            </p>
            <p className="font-body text-[15px] text-warm/60 leading-[1.9] mb-6">
              Michael never stops learning about the ever-changing jewellery industry, and that dedication shows in every piece that passes through the studio.
            </p>
          </div>
        </SectionReveal>

        {/* Pull quote */}
        <SectionReveal delay={0.1}>
          <div className="border-l-2 border-gold pl-6 max-w-xl mx-auto mt-10">
            <p className="font-display text-xl md:text-[22px] italic text-gold/80 leading-relaxed">
              "Every piece of jewellery tells a story. We are here to help you write yours."
            </p>
          </div>
        </SectionReveal>

        {/* CTA */}
        <SectionReveal delay={0.2}>
          <div className="text-center mt-16">
            <p className="font-body text-sm text-warm/50 mb-6">
              Ready to start your story?
            </p>
            <MagneticButton
              href="/contact"
              className="border border-gold text-gold px-8 py-3.5 hover:bg-gold hover:text-white font-body text-[11px] uppercase tracking-elegant"
            >
              GET IN TOUCH
            </MagneticButton>
          </div>
        </SectionReveal>
      </div>
    </div>
  );
}
