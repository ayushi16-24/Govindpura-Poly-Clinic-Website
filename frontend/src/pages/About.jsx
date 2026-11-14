import { Link } from "react-router-dom";
import { useSite } from "../context/SiteContext.jsx";
import PageHeader from "../components/PageHeader.jsx";
import Glyph, { PinIcon, PhoneIcon, ClockIcon } from "../components/Icons.jsx";
import { approachPoints, commitments, mission, vision, facilities, patientCare } from "../config/clinicInfo.js";

export default function About() {
  const { content } = useSite();
  return (
    <>
      <PageHeader title={`About ${content.clinicName}`} subtitle={content.tagline || content.address} />

      {/* Introduction */}
      <section className="section">
        <div className="container">
          <div className="row g-5 align-items-start">
            <div className="col-lg-7 reveal">
              <span className="eyebrow">Hospital introduction</span>
              <h2 className="section-title">Who we are</h2>
              <p className="prose">
                {content.aboutText ||
                  `${content.clinicName} is located in ${content.address}. We provide everyday healthcare, planned visits and follow-up care for patients of all ages, with a focus on clear communication and respectful service.`}
              </p>
            </div>
            <div className="col-lg-5 reveal">
              <div className="feature-panel">
                <div className="mini-point"><span className="glyph-box"><PinIcon /></span><div><strong>Address</strong><span>{content.address}</span></div></div>
                {content.timings && <div className="mini-point"><span className="glyph-box"><ClockIcon /></span><div><strong>Timings</strong><span className="pre-line">{content.timings}</span></div></div>}
                {content.phone && <div className="mini-point"><span className="glyph-box"><PhoneIcon /></span><div><strong>Phone</strong><span><a href={`tel:${content.phone}`}>{content.phone}</a></span></div></div>}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section section-alt">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-6 reveal">
              <div className="mv-card">
                <span className="glyph-box"><Glyph name="target" /></span>
                <h3>Our mission</h3>
                <p>{mission}</p>
              </div>
            </div>
            <div className="col-md-6 reveal">
              <div className="mv-card">
                <span className="glyph-box"><Glyph name="star" /></span>
                <h3>Our vision</h3>
                <p>{vision}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Healthcare approach */}
      <section className="section">
        <div className="container">
          <div className="section-head center reveal">
            <span className="eyebrow">Our healthcare approach</span>
            <h2>How we look after you</h2>
            <p>Our approach is built around listening, clear explanations and continuity of care.</p>
          </div>
          <div className="row g-4">
            {approachPoints.map((p) => (
              <div className="col-md-6 col-lg-4 reveal" key={p.title}>
                <div className="approach-card">
                  <span className="glyph-box"><Glyph name={p.icon} /></span>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commitment */}
      <section className="section section-alt">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-5 reveal">
              <span className="eyebrow">Our commitment to patients</span>
              <h2 className="section-title">What you can always count on</h2>
            </div>
            <div className="col-lg-7 reveal">
              <ul className="care-list">
                {commitments.map((c) => (
                  <li key={c}><Glyph name="check" /><div><span>{c}</span></div></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities & patient care */}
      <section className="section">
        <div className="container">
          <div className="section-head center reveal">
            <span className="eyebrow">Facilities and patient care</span>
            <h2>Built for comfort and convenience</h2>
          </div>
          <div className="row g-4 mb-5">
            {facilities.map((f) => (
              <div className="col-md-6 col-lg-4 reveal" key={f.title}>
                <div className="facility-card">
                  <span className="glyph-box"><Glyph name={f.icon} /></span>
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="row g-4">
            {patientCare.map((c) => (
              <div className="col-md-6 reveal" key={c.title}>
                <div className="care-item">
                  <Glyph name="check" />
                  <div><strong>{c.title}</strong><span>{c.text}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container">
          <div className="cta-band reveal">
            <div>
              <h2>Ready to visit?</h2>
              <p>Send an appointment request and our team will confirm your time.</p>
            </div>
            <div className="d-flex flex-wrap gap-2">
              <Link to="/appointment" className="btn-gp">Book an appointment</Link>
              <Link to="/doctors" className="btn-ghost-light">Meet our doctors</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
