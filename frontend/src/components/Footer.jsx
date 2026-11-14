import { Link } from "react-router-dom";
import { useSite } from "../context/SiteContext.jsx";

export default function Footer() {
  const { content } = useSite();
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4 col-md-6">
            <h4>{content.clinicName}</h4>
            {content.tagline && <p>{content.tagline}</p>}
            <p className="pre-line mb-0">{content.address}</p>
          </div>
          <div className="col-6 col-lg-2 col-md-3">
            <h4>Explore</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About us</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/doctors">Doctors</Link></li>
              <li><Link to="/gallery">Gallery</Link></li>
              <li><Link to="/reviews">Reviews</Link></li>
            </ul>
          </div>
          <div className="col-6 col-lg-3 col-md-3">
            <h4>Patients</h4>
            <ul>
              <li><Link to="/appointment">Book appointment</Link></li>
              <li><Link to="/contact">Send an enquiry</Link></li>
              <li><Link to="/#faq">FAQ</Link></li>
              <li><Link to="/#care">Patient care</Link></li>
            </ul>
          </div>
          <div className="col-lg-3 col-md-6">
            <h4>Contact</h4>
            <ul>
              {content.phone && <li><a href={`tel:${content.phone}`}>{content.phone}</a></li>}
              {content.email && <li><a href={`mailto:${content.email}`}>{content.email}</a></li>}
              {content.timings && <li className="pre-line">{content.timings}</li>}
              <li><Link to="/contact">Directions</Link></li>
            </ul>
          </div>
        </div>
        <div className="copy">
          <span>© {new Date().getFullYear()} {content.clinicName}. All rights reserved.</span>
          <Link to="/admin/login">Staff login</Link>
        </div>
      </div>
    </footer>
  );
}
