import { Link, useLocation } from "react-router-dom";

const pageNames: Record<string, string> = {
  shop: "Shop",
  showroom: "Showroom",
  services: "Services",
  about: "About",
  contact: "Contact",
  privacy: "Privacy Policy",
};

export default function Breadcrumbs() {
  const { pathname } = useLocation();
  const segment = pathname.replace("/", "");

  // Don't show on home page
  if (!segment || !pageNames[segment]) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="absolute top-20 left-6 z-30"
    >
      <ol className="flex items-center gap-2 font-body text-[10px] uppercase tracking-elegant">
        <li>
          <Link to="/" className="text-warm/40 hover:text-gold transition-colors">
            Home
          </Link>
        </li>
        <li className="text-warm/20">/</li>
        <li className="text-gold">{pageNames[segment]}</li>
      </ol>
    </nav>
  );
}
