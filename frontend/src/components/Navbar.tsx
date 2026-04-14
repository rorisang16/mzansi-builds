import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Rocket, Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLoggedIn = localStorage.getItem("mzansi_user");
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  if (isAuthPage) return null;

  const links = [
    { to: "/dashboard", label: "Feed" },
    { to: "/create", label: "New Project" },
    { to: "/celebration", label: "Celebration Wall" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("mzansi_user");
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-hero border-b border-border/20">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/dashboard" className="flex items-center gap-2">
          <Rocket className="h-6 w-6 text-hero-accent" />
          <span className="text-xl font-bold text-hero-foreground tracking-tight">
            Mzansi<span className="text-hero-accent">Builds</span>
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm font-medium uppercase tracking-wider transition-colors ${
                location.pathname === l.to
                  ? "text-hero-accent"
                  : "text-hero-foreground/70 hover:text-hero-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
          {isLoggedIn ? (
            <Button variant="heroOutline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Button variant="hero" size="sm" onClick={() => navigate("/login")}>
              Login
            </Button>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-hero-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-hero border-t border-border/20 px-4 pb-4 space-y-3">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMobileOpen(false)}
              className={`block text-sm font-medium uppercase tracking-wider py-2 ${
                location.pathname === l.to ? "text-hero-accent" : "text-hero-foreground/70"
              }`}
            >
              {l.label}
            </Link>
          ))}
          {isLoggedIn ? (
            <Button variant="heroOutline" size="sm" className="w-full" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Button variant="hero" size="sm" className="w-full" onClick={() => navigate("/login")}>
              Login
            </Button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
