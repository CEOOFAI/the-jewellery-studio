import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import GoldTicker from "./GoldTicker";

const navLinks = [
  { label: "HOME", to: "/" },
  { label: "SHOP", to: "/shop" },
  { label: "GOLD & SILVER", to: "/gold-and-silver" },
  {
    label: "SERVICES",
    to: "/services",
    children: [
      { label: "Repair Tracker", to: "/repair-tracker" },
      { label: "Hallmarks", to: "/hallmarks" },
      { label: "Appointments", to: "/appointments" },
    ],
  },
  { label: "BESPOKE", to: "/bespoke" },
  { label: "VAULT", to: "/vault" },
  { label: "BLOG", to: "/blog" },
  { label: "ABOUT", to: "/about" },
  { label: "CONTACT", to: "/contact" },
];

const menuLinkVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const dropdownVariants = {
  hidden: { opacity: 0, y: -4 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" as const } },
  exit: { opacity: 0, y: -4, transition: { duration: 0.15, ease: "easeIn" as const } },
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const location = useLocation();
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleDropdownEnter = () => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setServicesOpen(true);
  };

  const handleDropdownLeave = () => {
    dropdownTimeout.current = setTimeout(() => setServicesOpen(false), 150);
  };

  // Build flat list for mobile menu indexing
  let mobileIndex = 0;

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-6 md:px-10 transition-all duration-[400ms] ease-out"
        style={{
          height: scrolled ? 64 : 80,
          backgroundColor: scrolled ? "#142234" : "#1B2A3F",
          borderBottom: "1px solid rgba(201,168,76,0.2)",
          boxShadow: scrolled ? "0 2px 30px rgba(0,0,0,0.4)" : "none",
        }}
      >
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <div className="border-2 border-[rgba(201,168,76,0.3)] rounded-sm p-0.5 transition-all duration-[400ms] ease-out">
            <img
              src="/images/tjs-logo.jpg"
              alt="The Jewellery Studio"
              className={`block transition-all duration-[400ms] ease-out ${
                scrolled ? "h-[44px] md:h-[52px]" : "h-[52px] md:h-[64px]"
              }`}
            />
          </div>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = link.to === "/" ? location.pathname === "/" : location.pathname.startsWith(link.to);
            const hasChildren = !!link.children;

            if (hasChildren) {
              return (
                <div
                  key={link.to}
                  className="relative"
                  onMouseEnter={handleDropdownEnter}
                  onMouseLeave={handleDropdownLeave}
                >
                  <Link
                    to={link.to}
                    className={`font-body text-[11px] uppercase tracking-elegant transition-colors duration-300 inline-flex items-center gap-1 ${
                      isActive ? "text-gold" : "text-warm hover:text-gold"
                    }`}
                  >
                    {link.label}
                    {/* Chevron */}
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`}
                    >
                      <path d="M2.5 3.5L5 6.5L7.5 3.5" />
                    </svg>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-px bg-gold mt-0.5" />
                    )}
                  </Link>

                  {/* Desktop dropdown */}
                  <AnimatePresence>
                    {servicesOpen && (
                      <motion.div
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 min-w-[180px] rounded-sm overflow-hidden"
                        style={{
                          backgroundColor: "#142234",
                          border: "1px solid rgba(201,168,76,0.2)",
                          boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
                        }}
                      >
                        {link.children!.map((child) => {
                          const childActive = location.pathname === child.to;
                          return (
                            <Link
                              key={child.to}
                              to={child.to}
                              className={`block px-5 py-3 font-body text-[11px] uppercase tracking-elegant transition-colors duration-300 ${
                                childActive
                                  ? "text-gold bg-[rgba(201,168,76,0.08)]"
                                  : "text-warm hover:text-gold hover:bg-[rgba(201,168,76,0.05)]"
                              }`}
                            >
                              {child.label}
                            </Link>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            return (
              <Link
                key={link.to}
                to={link.to}
                className={`font-body text-[11px] uppercase tracking-elegant transition-colors duration-300 ${
                  isActive ? "text-gold" : "text-warm hover:text-gold"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="block w-full h-px bg-gold mt-0.5" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          <span className="block w-5 h-px bg-gold" />
          <span className="block w-5 h-px bg-gold" />
          <span className="block w-5 h-px bg-gold" />
        </button>

        {/* Gold bottom line on scroll */}
        <div
          className="absolute bottom-0 left-0 h-px bg-gold transition-all duration-[400ms] ease-out"
          style={{ width: scrolled ? "100%" : "0%" }}
        />
      </nav>

      {/* Gold/Silver price ticker */}
      <div
        className="fixed left-0 right-0 z-30 transition-all duration-[400ms] ease-out"
        style={{ top: scrolled ? 64 : 80 }}
      >
        <GoldTicker />
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-navy-deep flex flex-col items-center justify-center"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {/* Close button */}
            <button
              className="absolute top-6 right-6 text-gold p-2"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <line x1="4" y1="4" x2="20" y2="20" />
                <line x1="20" y1="4" x2="4" y2="20" />
              </svg>
            </button>

            {/* Menu links */}
            <div className="flex flex-col items-center gap-2">
              {navLinks.map((link) => {
                const isActive = link.to === "/" ? location.pathname === "/" : location.pathname.startsWith(link.to);
                const i = mobileIndex++;
                const hasChildren = !!link.children;

                return (
                  <div key={link.to} className="flex flex-col items-center">
                    <motion.div
                      custom={i}
                      variants={menuLinkVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <div className="flex items-center gap-2">
                        <Link
                          to={link.to}
                          className={`font-display text-4xl py-4 relative group block ${
                            isActive ? "text-gold" : "text-warm"
                          }`}
                          onClick={() => setMenuOpen(false)}
                        >
                          {link.label}
                          <span className={`absolute bottom-2 left-0 h-px bg-gold transition-all duration-300 ${
                            isActive ? "w-full" : "w-0 group-hover:w-full"
                          }`} />
                        </Link>
                        {hasChildren && (
                          <button
                            onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                            className="text-gold p-2"
                            aria-label="Toggle services submenu"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 10 10"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className={`transition-transform duration-200 ${mobileServicesOpen ? "rotate-180" : ""}`}
                            >
                              <path d="M2.5 3.5L5 6.5L7.5 3.5" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </motion.div>

                    {/* Mobile sub-items */}
                    {hasChildren && (
                      <AnimatePresence>
                        {mobileServicesOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className="overflow-hidden flex flex-col items-center"
                          >
                            {link.children!.map((child) => {
                              const childActive = location.pathname === child.to;
                              const childIndex = mobileIndex++;
                              return (
                                <motion.div
                                  key={child.to}
                                  custom={childIndex}
                                  variants={menuLinkVariants}
                                  initial="hidden"
                                  animate="visible"
                                >
                                  <Link
                                    to={child.to}
                                    className={`font-body text-lg uppercase tracking-elegant py-2 block ${
                                      childActive ? "text-gold" : "text-warm/70 hover:text-gold"
                                    }`}
                                    onClick={() => setMenuOpen(false)}
                                  >
                                    {child.label}
                                  </Link>
                                </motion.div>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
