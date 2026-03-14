import GoldDivider from "../components/GoldDivider";
import SectionReveal from "../components/SectionReveal";
import MagneticButton from "../components/MagneticButton";

export default function NotFound() {
  return (
    <div className="bg-navy min-h-screen flex items-center justify-center px-6">
      <SectionReveal className="text-center">
        <p className="font-body text-[11px] uppercase tracking-luxe text-gold mb-4">
          PAGE NOT FOUND
        </p>
        <h1 className="font-display text-6xl md:text-8xl text-warm mb-4">
          404
        </h1>
        <GoldDivider className="mb-6" />
        <p className="font-body text-sm text-warm/60 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <MagneticButton
            href="/"
            className="border border-gold text-gold px-8 py-3.5 hover:bg-gold hover:text-white font-body text-[11px] uppercase tracking-elegant"
          >
            BACK TO HOME
          </MagneticButton>
          <MagneticButton
            href="/shop"
            className="border border-warm/20 text-warm/60 px-8 py-3.5 hover:border-gold hover:text-gold font-body text-[11px] uppercase tracking-elegant"
          >
            BROWSE THE COLLECTION
          </MagneticButton>
        </div>
      </SectionReveal>
    </div>
  );
}
