import GoldDivider from "../components/GoldDivider";
import SectionReveal from "../components/SectionReveal";
import MagneticButton from "../components/MagneticButton";

export default function Contact() {
  return (
    <div className="bg-navy min-h-screen pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <SectionReveal className="text-center">
          <p className="font-body text-[11px] uppercase tracking-luxe text-gold mb-4">
            GET IN TOUCH
          </p>
          <h1 className="font-display text-4xl md:text-5xl text-warm">
            Contact Us
          </h1>
          <GoldDivider className="mt-4 mb-12" />
        </SectionReveal>

        {/* WhatsApp CTA */}
        <SectionReveal delay={0.1}>
          <div className="max-w-lg mx-auto">
            <MagneticButton
              href="https://wa.me/35054013690"
              className="bg-gold text-white w-full flex items-center justify-center gap-3 py-4 font-body text-xs uppercase tracking-elegant rounded-sm hover:bg-gold-muted transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              MESSAGE US ON WHATSAPP
            </MagneticButton>
          </div>
        </SectionReveal>

        {/* Info blocks */}
        <SectionReveal delay={0.2}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mt-14 max-w-2xl mx-auto text-center">
            <div>
              <p className="font-body text-[10px] uppercase tracking-luxe text-gold mb-3">
                ADDRESS
              </p>
              <p className="font-display text-[15px] text-warm leading-relaxed">
                152 Main Street
                <br />
                Gibraltar
              </p>
            </div>

            <div>
              <p className="font-body text-[10px] uppercase tracking-luxe text-gold mb-3">
                PHONE
              </p>
              <a
                href="tel:+35054013690"
                className="font-display text-[15px] text-warm hover:text-gold transition-colors"
              >
                +350 5401 3690
              </a>
            </div>

            <div>
              <p className="font-body text-[10px] uppercase tracking-luxe text-gold mb-3">
                INSTAGRAM
              </p>
              <a
                href="https://www.instagram.com/the_studio_gibraltar/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-display text-[15px] text-warm hover:text-gold transition-colors"
              >
                @the_studio_gibraltar
              </a>
            </div>

            <div>
              <p className="font-body text-[10px] uppercase tracking-luxe text-gold mb-3">
                OPENING HOURS
              </p>
              <p className="font-display text-[15px] text-warm leading-relaxed">
                Mon - Fri: 10am - 6pm
                <br />
                Sat: 10am - 2pm
              </p>
            </div>
          </div>
        </SectionReveal>

        {/* Google Maps */}
        <SectionReveal delay={0.3}>
          <div className="mt-14 rounded-sm overflow-hidden grayscale-[0.3]">
            <iframe
              src="https://www.google.com/maps?q=The+Jewellery+Studio,+5+Bell+Lane,+Gibraltar+GX11+1AA&ll=36.14174,-5.35293&z=19&output=embed"
              width="100%"
              height="300"
              style={{ border: 0 }}
              loading="lazy"
              title="The Jewellery Studio location"
              allowFullScreen
            />
          </div>
        </SectionReveal>
      </div>
    </div>
  );
}
