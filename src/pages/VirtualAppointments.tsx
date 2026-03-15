import GoldDivider from "../components/GoldDivider";
import SectionReveal from "../components/SectionReveal";
import MagneticButton from "../components/MagneticButton";
import useSEO from "../hooks/useSEO";

const benefits = [
  {
    title: "See Pieces Up Close",
    description:
      "Michael shows you pieces via video call so you can see every detail before making a decision.",
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-gold"
      >
        <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14" />
        <rect x="3" y="6" width="12" height="12" rx="2" />
      </svg>
    ),
  },
  {
    title: "Expert Guidance",
    description:
      "Get professional advice from anywhere in the world. Whether you're local or overseas, Michael is happy to help.",
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-gold"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20" />
        <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
      </svg>
    ),
  },
  {
    title: "No Obligation",
    description:
      "Browse and ask questions with zero pressure. These calls are about helping you find what you love.",
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-gold"
      >
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
      </svg>
    ),
  },
];

export default function VirtualAppointments() {
  useSEO({
    title: "Book an Appointment | The Jewellery Studio",
    description: "Schedule a virtual or in-person consultation with Michael at The Jewellery Studio, Gibraltar.",
    url: "/appointments",
  });

  return (
    <div className="bg-navy min-h-screen pt-32 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        {/* Hero */}
        <SectionReveal className="text-center">
          <p className="font-body text-[11px] uppercase tracking-luxe text-gold mb-4">
            BOOK A VIDEO CALL
          </p>
          <h1 className="font-display text-4xl md:text-5xl text-warm">
            Virtual Appointments
          </h1>
          <GoldDivider className="mt-4 mb-8" />
          <p className="font-body text-[15px] text-warm/70 max-w-xl mx-auto leading-relaxed">
            Can't visit the showroom in person? Book a video call with Michael
            to view pieces up close, discuss bespoke commissions, or get expert
            advice from wherever you are.
          </p>
        </SectionReveal>

        {/* Benefit cards */}
        <SectionReveal delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="bg-navy-card border border-gold/20 rounded-sm p-6 text-center"
              >
                <div className="flex justify-center mb-4">{benefit.icon}</div>
                <h3 className="font-display text-lg text-warm mb-2">
                  {benefit.title}
                </h3>
                <p className="font-body text-sm text-warm/60 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </SectionReveal>

        {/* WhatsApp CTA */}
        <SectionReveal delay={0.2}>
          <div className="mt-16 text-center">
            <p className="font-body text-[11px] uppercase tracking-luxe text-gold mb-4">
              READY TO BOOK?
            </p>
            <h3 className="font-display text-2xl text-warm mb-3">
              Message Michael on WhatsApp
            </h3>
            <p className="font-body text-sm text-warm/60 max-w-md mx-auto mb-8 leading-relaxed">
              Send a quick message to arrange a video call at a time that works for you. No forms, no waiting.
            </p>
            <GoldDivider className="mb-8" />
            <MagneticButton
              href="https://wa.me/35054013690?text=Hi%20Michael%2C%20I%27d%20like%20to%20book%20a%20virtual%20appointment."
              className="bg-gold text-white inline-flex items-center justify-center gap-3 px-8 py-4 font-body text-xs uppercase tracking-elegant rounded-sm hover:bg-gold-muted transition-colors"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              MESSAGE MICHAEL ON WHATSAPP
            </MagneticButton>
          </div>
        </SectionReveal>
      </div>
    </div>
  );
}
