import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import useAuthStore from "../zustand/authStore";

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = useAuthStore((state) => state.user);

  const navLinkClass = ({ isActive }) =>
    `font-coptic text-sm uppercase tracking-[0.18em] transition-all px-4 py-2 border-b-2 flex items-center h-full ${
      isActive
        ? "text-amber-700 border-amber-500 bg-ivory/50"
        : "text-strong border-transparent hover:text-black hover:bg-ivory/30"
    }`;

  const staticLinkClass =
    "font-coptic text-sm uppercase tracking-[0.18em] transition-all px-4 py-2 border-b-2 border-transparent text-strong hover:text-black hover:bg-ivory/30 flex items-center h-full cursor-pointer";

  return (
    <header className="fixed w-full top-0 z-50">
      <nav
        className={`w-full ${!user ? "flex" : "hidden"} items-center justify-between bg-porcelain/95 backdrop-blur-md border-b border-divider px-6 sm:px-10 h-20`}
        aria-label="Primary"
      >
        {/* Left Side: Logo + Main Nav */}
        <div className="flex items-center h-full gap-8">
          <NavLink
            to="/"
            className="font-cormorant text-2xl font-semibold tracking-[0.15em] text-strong hover:text-amber-700 transition-colors mr-4"
            aria-label="Open Church Management — home"
          >
            O<span className="text-amber-600">C</span>M
          </NavLink>

          <ul className="hidden lg:flex items-center h-full gap-1" role="list">
            <li className="h-full flex items-center">
              <NavLink to={user ? "/feed" : "/"} className={navLinkClass}>
                Home
              </NavLink>
            </li>
            <li className="h-full flex items-center">
              <NavLink to="/bible" className={navLinkClass}>
                Bible
              </NavLink>
            </li>
            <li className="h-full flex items-center">
              <NavLink to="/plans/reading" className={navLinkClass}>
                Reading Plans
              </NavLink>
            </li>
            <li className="h-full flex items-center">
              <NavLink to="/fellowships" className={navLinkClass}>
                Fellowships
              </NavLink>
            </li>
            <li className="h-full flex items-center">
              <a
                href="https://mavunochurch.org/give"
                target="_blank"
                rel="noopener noreferrer"
                className={staticLinkClass}
              >
                Give
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Right side: Auth + CTA */}
        <div className="hidden sm:flex items-center gap-6 h-full">
          {!user ? (
            <>
              <NavLink
                to="/auth/login"
                className="font-coptic text-sm uppercase tracking-[0.18em] text-strong hover:text-black transition-colors"
              >
                Sign In
              </NavLink>
              <NavLink
                to="/auth/login"
                className="bg-amber-500 hover:bg-amber-600 text-black font-coptic text-sm uppercase tracking-[0.18em] px-6 py-3 transition-all shadow-sm active:scale-95"
              >
                Get Started
              </NavLink>
            </>
          ) : (
            <NavLink
              to="/feed"
              className="bg-amber-500 hover:bg-amber-600 text-black font-coptic text-sm uppercase tracking-[0.18em] px-6 py-3 transition-all shadow-sm active:scale-95"
            >
              Go to Feed
            </NavLink>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="lg:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="primary-mobile-menu"
        >
          <span
            aria-hidden="true"
            className={`block w-6 h-0.5 bg-stone-800 transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-[8px]" : ""}`}
          />
          <span
            aria-hidden="true"
            className={`block w-6 h-0.5 bg-stone-800 transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`}
          />
          <span
            aria-hidden="true"
            className={`block w-6 h-0.5 bg-stone-800 transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-[8px]" : ""}`}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        id="primary-mobile-menu"
        className={`lg:hidden bg-porcelain border-b border-divider flex flex-col transition-all duration-300 ease-in-out overflow-hidden shadow-xl ${
          mobileOpen
            ? "max-h-[32rem] opacity-100"
            : "max-h-0 opacity-0 pointer-events-none"
        }`}
        aria-hidden={!mobileOpen}
      >
        <nav className="flex flex-col px-6 py-6 gap-2" aria-label="Mobile">
          <NavLink
            to={user ? "/feed" : "/"}
            onClick={() => setMobileOpen(false)}
            className="font-coptic text-base uppercase tracking-[0.18em] text-strong hover:text-black py-4 border-b border-divider"
          >
            Home
          </NavLink>
          <NavLink
            to="/bible"
            onClick={() => setMobileOpen(false)}
            className="font-coptic text-base uppercase tracking-[0.18em] text-strong hover:text-black py-4 border-b border-divider"
          >
            Bible
          </NavLink>
          <NavLink
            to="/reading-plans"
            onClick={() => setMobileOpen(false)}
            className="font-coptic text-base uppercase tracking-[0.18em] text-strong hover:text-black py-4 border-b border-divider"
          >
            Reading Plans
          </NavLink>
          <NavLink
            to="/fellowships"
            onClick={() => setMobileOpen(false)}
            className="font-coptic text-base uppercase tracking-[0.18em] text-strong hover:text-black py-4 border-b border-divider"
          >
            Fellowships
          </NavLink>
          <a
            href="https://mavunochurch.org/give"
            target="_blank"
            rel="noopener noreferrer"
            className="font-coptic text-base uppercase tracking-[0.18em] text-strong hover:text-black py-4 border-b border-divider"
          >
            Give
            <span className="sr-only"> (opens in a new tab)</span>
          </a>

          <div className="flex flex-col gap-3 pt-6">
            {!user && (
              <NavLink
                to="/auth/login"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center font-coptic text-sm uppercase tracking-[0.18em] text-strong border border-divider py-3.5 transition-colors"
              >
                Sign In
              </NavLink>
            )}
            <NavLink
              to={user ? "/feed" : "/auth/login"}
              onClick={() => setMobileOpen(false)}
              className="w-full text-center bg-amber-500 hover:bg-amber-600 text-black font-coptic text-sm uppercase tracking-[0.18em] py-3.5 transition-colors shadow-md"
            >
              {user ? "Go to Feed" : "Get Started"}
            </NavLink>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
