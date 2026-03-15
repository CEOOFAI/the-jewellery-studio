import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

const ADMIN_PASSWORD = "tjs2026admin";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Small delay to feel intentional
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem("tjs-admin-auth", "true");
        navigate("/admin");
      } else {
        setError("Incorrect password");
        setLoading(false);
      }
    }, 400);
  }

  return (
    <div className="min-h-screen bg-navy-deep flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Branding */}
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-gold tracking-luxe uppercase">
            The Jewellery Studio
          </h1>
          <p className="text-muted text-sm mt-2 font-body tracking-wide">
            Admin Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-navy-card border border-gold/10 rounded-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="password"
                className="block text-muted text-sm font-body mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                autoFocus
                className="w-full bg-navy-deep border border-gold/20 rounded-sm px-4 py-3 text-warm font-body placeholder:text-dim focus:outline-none focus:border-gold/50 transition-colors"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm font-body">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-gold/10 border border-gold/30 text-gold font-body tracking-wide py-3 rounded-sm hover:bg-gold/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? "Checking..." : "Enter"}
            </button>
          </form>
        </div>

        <p className="text-center text-dim text-xs mt-6 font-body">
          Access restricted to authorised personnel
        </p>
      </div>
    </div>
  );
}
