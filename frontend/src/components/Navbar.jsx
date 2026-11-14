import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useSite } from "../context/SiteContext.jsx";
import { PinIcon, MenuIcon } from "./Icons.jsx";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/doctors", label: "Doctors" },
  { to: "/gallery", label: "Gallery" },
  { to: "/reviews", label: "Reviews" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { content } = useSite();
  const close = () => setOpen(false);

  return (
    <>
      {/* Top Location Bar */}
      <div className="top-location-bar">
        <div className="container">
          <div className="top-location-inner">
            <PinIcon width={14} height={14} />
            <span>{content.address || "Jhotwara, Jaipur"}</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="site-nav">
        <div className="container inner">
          <Link to="/" className="brand" onClick={close}>
            <span className="brand-logo-mark" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12h4l2.5-6 3.5 12 3-8 2 5 2-3h5" />
              </svg>
            </span>
            <span className="brand-text-wrap">
              <span className="brand-clinic-name">{content.clinicName || "Govindpura Poly Clinic"}</span>
              <small className="brand-clinic-tagline">Accurate. Caring.</small>
            </span>
          </Link>

          <button
            className="menu-btn"
            aria-label="Toggle navigation menu"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <MenuIcon />
          </button>

          <nav className={`nav-links-wrap ${open ? "open" : ""}`}>
            <ul className="nav-links-list">
              {links.map((l) => (
                <li key={l.to}>
                  <NavLink
                    to={l.to}
                    end={l.to === "/"}
                    className={({ isActive }) => `nav-link-item ${isActive ? "active" : ""}`}
                    onClick={close}
                  >
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>
            <div className="nav-cta-wrap">
              <Link to="/appointment" className="btn-nav-book" onClick={close}>
                Book appointment
              </Link>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
