import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import ErrorBoundary from "./components/ErrorBoundary";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import GoldCursor from "./components/GoldCursor";
import BackToTop from "./components/BackToTop";
import WhatsAppFloat from "./components/WhatsAppFloat";
import AmbientSound from "./components/AmbientSound";
import Breadcrumbs from "./components/Breadcrumbs";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Bespoke from "./pages/Bespoke";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import GoldAndSilver from "./pages/GoldAndSilver";
import ProductDetail from "./pages/ProductDetail";
import RepairTracker from "./pages/RepairTracker";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import VirtualAppointments from "./pages/VirtualAppointments";
import Vault from "./pages/Vault";
import HallmarkIdentifier from "./pages/HallmarkIdentifier";
import CruiseLanding from "./pages/CruiseLanding";
import NotFound from "./pages/NotFound";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminInventory from "./pages/admin/AdminInventory";
import AdminEnquiries from "./pages/admin/AdminEnquiries";
import AdminRepairs from "./pages/admin/AdminRepairs";
import AdminAppointments from "./pages/admin/AdminAppointments";
import AdminAnniversary from "./pages/admin/AdminAnniversary";
import AdminNotifications from "./pages/admin/AdminNotifications";
import AdminCruise from "./pages/admin/AdminCruise";
import AdminBlog from "./pages/admin/AdminBlog";
import AdminVaultApps from "./pages/admin/AdminVaultApps";
import AdminCertificate from "./pages/admin/AdminCertificate";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4, ease: "easeOut" as const } },
  exit: { opacity: 0, transition: { duration: 0.3, ease: "easeIn" as const } },
};

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
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
  { path: "/shop/:id", element: <ProductDetail /> },
  { path: "/bespoke", element: <Bespoke /> },
  { path: "/repair-tracker", element: <RepairTracker /> },
  { path: "/gold-and-silver", element: <GoldAndSilver /> },
  { path: "/services", element: <Services /> },
  { path: "/about", element: <About /> },
  { path: "/contact", element: <Contact /> },
  { path: "/blog", element: <Blog /> },
  { path: "/blog/:slug", element: <BlogPost /> },
  { path: "/appointments", element: <VirtualAppointments /> },
  { path: "/vault", element: <Vault /> },
  { path: "/hallmarks", element: <HallmarkIdentifier /> },
  { path: "/cruise", element: <CruiseLanding /> },
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

function MainSite() {
  return (
    <>
      <GoldCursor />
      <Navbar />
      <Breadcrumbs />
      <main>
        <AnimatedRoutes />
      </main>
      <Footer />
      <BackToTop />
      <WhatsAppFloat />
      <AmbientSound />
    </>
  );
}

export default function App() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      <ScrollToTop />
      <ErrorBoundary>
        {isAdmin ? (
          <Routes>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="inventory" element={<AdminInventory />} />
              <Route path="enquiries" element={<AdminEnquiries />} />
              <Route path="repairs" element={<AdminRepairs />} />
              <Route path="appointments" element={<AdminAppointments />} />
              <Route path="vault" element={<AdminAnniversary />} />
              <Route path="notifications" element={<AdminNotifications />} />
              <Route path="cruise" element={<AdminCruise />} />
              <Route path="blog" element={<AdminBlog />} />
              <Route path="vault-applications" element={<AdminVaultApps />} />
              <Route path="certificate" element={<AdminCertificate />} />
            </Route>
          </Routes>
        ) : (
          <MainSite />
        )}
      </ErrorBoundary>
    </>
  );
}
