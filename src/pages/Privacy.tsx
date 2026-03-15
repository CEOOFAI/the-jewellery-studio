import GoldDivider from "../components/GoldDivider";
import SectionReveal from "../components/SectionReveal";
import useSEO from "../hooks/useSEO";

export default function Privacy() {
  useSEO({
    title: "Privacy Policy | The Jewellery Studio",
    description: "Privacy policy for The Jewellery Studio, Gibraltar.",
    url: "/privacy",
  });
  return (
    <div className="bg-navy min-h-screen pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <SectionReveal className="text-center mb-12">
          <p className="font-body text-[11px] uppercase tracking-luxe text-gold mb-4">
            LEGAL
          </p>
          <h1 className="font-display text-4xl md:text-5xl text-warm">
            Privacy Policy
          </h1>
          <GoldDivider className="mt-4" />
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <div className="space-y-8 font-body text-sm text-warm/60 leading-relaxed">
            <div>
              <h2 className="font-display text-xl text-warm mb-3">Who We Are</h2>
              <p>
                The Jewellery Studio is a jewellery and pawnbroking business located at 5 Bell Lane, Main Street, Gibraltar GX11 1AA, operated by Michael &amp; Stephanie Scott.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl text-warm mb-3">What Data We Collect</h2>
              <p>
                When you use certain features on this website, we may collect the following information:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Your name and WhatsApp number when you submit an enquiry, book an appointment, save a wishlist item, sign up for stock notifications, or apply for Vault access</li>
                <li>Occasion details and budget preferences if you use our Anniversary Vault feature</li>
                <li>Category preferences if you sign up for notifications</li>
              </ul>
              <p className="mt-2">
                This information is stored securely and used solely to provide the services you have requested. We do not sell or share your data with third parties. We do not use cookies for tracking or advertising.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl text-warm mb-3">Third-Party Services</h2>
              <p>
                This website uses Google Maps to display our location. Google may collect data according to their own privacy policy. We also embed links to Instagram, WhatsApp, and Facebook, which are governed by their respective privacy policies.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl text-warm mb-3">Your Rights</h2>
              <p>
                Under GDPR, you have the right to access, correct, or delete any personal data we may hold about you. To make a request, contact us via WhatsApp at +350 5401 3690 or visit us in store.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl text-warm mb-3">Changes to This Policy</h2>
              <p>
                We may update this policy from time to time. Any changes will be reflected on this page.
              </p>
            </div>

            <p className="text-dim text-xs pt-4">
              Last updated: March 2026
            </p>
          </div>
        </SectionReveal>
      </div>
    </div>
  );
}
