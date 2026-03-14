import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import GoldCursor from "./components/GoldCursor";
import BackToTop from "./components/BackToTop";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Showroom from "./pages/Showroom";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

const pageVariants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const } },
  exit: { opacity: 0, x: -40, transition: { duration: 0.25, ease: [0.7, 0, 0.84, 0] as const } },
};

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Gold flash overlay */}
      <motion.div
        className="fixed inset-0 z-40 pointer-events-none bg-gold"
        initial={{ opacity: 0.08 }}
        animate={{ opacity: 0, transition: { duration: 0.4, delay: 0.05 } }}
      />
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {children}
      </motion.div>
    </>
  );
}

const pages = [
  { path: "/", element: <Home /> },
  { path: "/shop", element: <Shop /> },
  { path: "/showroom", element: <Showroom /> },
  { path: "/services", element: <Services /> },
  { path: "/about", element: <About /> },
  { path: "/contact", element: <Contact /> },
  { path: "/privacy", element: <Privacy /> },
  { path: "*", element: <NotFound /> },
];

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {pages.map(({ path, element }) => (
          <Route key={path} path={path} element={<PageWrapper>{element}</PageWrapper>} />
        ))}
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <>
      <GoldCursor />
      <ScrollToTop />
      <Navbar />
      <main>
        <AnimatedRoutes />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
