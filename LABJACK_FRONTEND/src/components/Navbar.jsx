import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

function Navbar() {
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `block px-3 py-2 rounded-md transition ${
      isActive ? "text-blue-400 font-semibold" : "text-gray-200 hover:text-blue-400"
    }`;

  return (
    <header className="bg-gray-900 text-white shadow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo / Title */}
          <Link
            to="/"
            className="text-lg sm:text-xl font-bold truncate hover:text-blue-400 transition"
            onClick={() => setOpen(false)}
          >
            LabJack Dashboard
          </Link>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-2">
            <NavLink to="/" className={linkClass}>
              Home
            </NavLink>
            <NavLink to="/about" className={linkClass}>
              About
            </NavLink>
            <NavLink to="/terms" className={linkClass}>
              Terms
            </NavLink>
            <NavLink to="/privacy" className={linkClass}>
              Privacy
            </NavLink>
          </nav>

          {/* Hamburger */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {/* icon */}
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <nav className="md:hidden pb-4 pt-2 space-y-1">
            <NavLink to="/" className={linkClass} onClick={() => setOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/about" className={linkClass} onClick={() => setOpen(false)}>
              About
            </NavLink>
            <NavLink to="/terms" className={linkClass} onClick={() => setOpen(false)}>
              Terms
            </NavLink>
            <NavLink to="/privacy" className={linkClass} onClick={() => setOpen(false)}>
              Privacy
            </NavLink>
          </nav>
        )}
      </div>
    </header>
  );
}

export default Navbar;
