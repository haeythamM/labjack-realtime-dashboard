import { Link, NavLink } from "react-router-dom";
import { useState } from "react";

const linkClass = ({ isActive }) =>
  [
    "block px-3 py-2 rounded-md text-sm",
    "transition-colors duration-200",
    "hover:text-blue-400 hover:bg-white/5",
    isActive ? "text-blue-400 font-semibold bg-white/5" : "text-white/90",
  ].join(" ");

function Header() {
  const [open, setOpen] = useState(false);
  const closeMenu = () => setOpen(false);

  return (
    <header className="bg-gray-900 text-white shadow sticky top-0 z-50">
      <div className="relative mx-auto w-full max-w-7xl px-4 py-5">
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/"
            onClick={closeMenu}
            className="text-lg sm:text-xl font-bold truncate hover:text-blue-400 transition"
          >
            LabJack Dashboard
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="sm:hidden inline-flex items-center justify-center rounded-md px-3 py-2
                       text-white/90 hover:bg-white/10 hover:text-blue-400 transition"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <span className="text-2xl leading-none">{open ? "✕" : "☰"}</span>
          </button>

          <nav className="hidden sm:flex items-center gap-2">
            <NavLink to="/" className={linkClass}>Home</NavLink>
            <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
            <NavLink to="/Documentation" className={linkClass}>Documentation</NavLink>
            <NavLink to="/terms" className={linkClass}>Terms</NavLink>
            <NavLink to="/privacy" className={linkClass}>Privacy</NavLink>
          </nav>
        </div>

        {/* Mobile menu overlay (doesn't push content) */}
        <div
          className={[
            "sm:hidden absolute left-4 right-4 top-full",
            "transition-all duration-200 origin-top",
            open ? "opacity-100 scale-100 translate-y-2 pointer-events-auto" : "opacity-0 scale-95 -translate-y-1 pointer-events-none",
          ].join(" ")}
        >
          <nav className="rounded-lg border border-white/10 bg-gray-900/95 backdrop-blur p-2 shadow-lg">
            <NavLink to="/" className={linkClass} onClick={closeMenu}>Home</NavLink>
            <NavLink to="/dashboard" className={linkClass} onClick={closeMenu}>Dashboard</NavLink>
            <NavLink to="/Documentation" className={linkClass} onClick={closeMenu}>Documentation</NavLink>
            <NavLink to="/terms" className={linkClass} onClick={closeMenu}>Terms</NavLink>
            <NavLink to="/privacy" className={linkClass} onClick={closeMenu}>Privacy</NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
