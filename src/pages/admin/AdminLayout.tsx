import { useEffect, useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";

const navItems = [
  {
    to: "/admin",
    label: "Dashboard",
    end: true,
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="2" width="7" height="7" rx="1" />
        <rect x="11" y="2" width="7" height="7" rx="1" />
        <rect x="2" y="11" width="7" height="7" rx="1" />
        <rect x="11" y="11" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    to: "/admin/inventory",
    label: "Inventory",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="2" width="5" height="5" rx="0.5" />
        <rect x="7.5" y="2" width="5" height="5" rx="0.5" />
        <rect x="13" y="2" width="5" height="5" rx="0.5" />
        <rect x="2" y="7.5" width="5" height="5" rx="0.5" />
        <rect x="7.5" y="7.5" width="5" height="5" rx="0.5" />
        <rect x="13" y="7.5" width="5" height="5" rx="0.5" />
        <rect x="2" y="13" width="5" height="5" rx="0.5" />
        <rect x="7.5" y="13" width="5" height="5" rx="0.5" />
        <rect x="13" y="13" width="5" height="5" rx="0.5" />
      </svg>
    ),
  },
  {
    to: "/admin/enquiries",
    label: "Enquiries",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 4h14a1 1 0 011 1v8a1 1 0 01-1 1H6l-3 3V5a1 1 0 011-1z" />
      </svg>
    ),
  },
  {
    to: "/admin/repairs",
    label: "Repairs",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14.5 3.5l2 2M5 13l-2 4 4-2 9-9-2-2-9 9z" />
        <path d="M12 6l2 2" />
      </svg>
    ),
  },
  {
    to: "/admin/appointments",
    label: "Appointments",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="3" width="16" height="15" rx="1" />
        <path d="M2 7h16" />
        <path d="M6 1v4M14 1v4" />
      </svg>
    ),
  },
  {
    to: "/admin/vault",
    label: "Anniversary Vault",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M10 17s-7-4.5-7-9a4 4 0 018 0 4 4 0 018 0c0 4.5-7 9-7 9z" />
      </svg>
    ),
  },
  {
    to: "/admin/notifications",
    label: "Notifications",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M10 2a5 5 0 00-5 5v4l-2 2h14l-2-2V7a5 5 0 00-5-5z" />
        <path d="M8 15a2 2 0 004 0" />
      </svg>
    ),
  },
  {
    to: "/admin/cruise",
    label: "Cruise Schedule",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 13l1-7h12l1 7" />
        <path d="M1 13h18l-2 4H3l-2-4z" />
        <path d="M10 2v4M7 6h6" />
      </svg>
    ),
  },
  {
    to: "/admin/blog",
    label: "Blog",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14 2l4 4-10 10H4v-4L14 2z" />
        <path d="M12 4l4 4" />
      </svg>
    ),
  },
  {
    to: "/admin/vault-applications",
    label: "Vault Applications",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="4" y="8" width="12" height="10" rx="1" />
        <path d="M7 8V5a3 3 0 016 0v3" />
        <circle cx="10" cy="13" r="1.5" />
      </svg>
    ),
  },
  {
    to: "/admin/certificate",
    label: "Certificate",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="2" width="14" height="16" rx="1" />
        <path d="M7 6h6M7 9h6M7 12h4" />
      </svg>
    ),
  },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const auth = sessionStorage.getItem("tjs-admin-auth");
    if (auth !== "true") {
      navigate("/admin/login", { replace: true });
    }
  }, [navigate]);

  function handleLogout() {
    sessionStorage.removeItem("tjs-admin-auth");
    navigate("/admin/login");
  }

  // Don't render if not authenticated
  if (sessionStorage.getItem("tjs-admin-auth") !== "true") {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-navy font-body">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-60 bg-navy-deep border-r border-gold/10 flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:static lg:z-auto`}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gold/10">
          <h1 className="font-display text-xl text-gold tracking-elegant uppercase">
            TJS Admin
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-2.5 text-sm transition-colors ${
                  isActive
                    ? "bg-gold/10 text-gold border-l-2 border-gold"
                    : "text-muted hover:text-warm hover:bg-white/5 border-l-2 border-transparent"
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-4 py-4 border-t border-gold/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-2 py-2 text-sm text-muted hover:text-red-400 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M7 17H4a1 1 0 01-1-1V4a1 1 0 011-1h3" />
              <path d="M14 14l4-4-4-4" />
              <path d="M18 10H8" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-navy-deep border-b border-gold/10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-muted hover:text-warm p-1"
            aria-label="Open menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
          <span className="font-display text-gold text-lg tracking-elegant uppercase">
            TJS Admin
          </span>
          <div className="w-6" />
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
