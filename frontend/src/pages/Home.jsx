
import { Link } from "react-router-dom";

import { useSite } from "../context/SiteContext.jsx";
import useFetch from "../hooks/useFetch.js";

import {
  getServices,
  getReviews
} from "../services/api";

import Stars from "../components/Stars.jsx";
import EmptyState from "../components/EmptyState.jsx";
import AppointmentForm from "../components/AppointmentForm.jsx";
import MapEmbed from "../components/MapEmbed.jsx";

import Glyph, {
  ClockIcon,
  PhoneIcon,
  PinIcon,
  MailIcon
} from "../components/Icons.jsx";

import {
  whyChooseUs,
  approachPoints,
  facilities,
  patientCare,
  faqs,
  mission,
  vision
} from "../config/clinicInfo.js";

const DEFAULT_ABOUT =
  "Welcome to our clinic in Jhotwara, Jaipur. Our team is here to help you and your family with everyday healthcare, planned visits and follow-up care, in a warm and respectful environment.";

export default function Home() {
  const { content } = useSite();

  const { data: services } = useFetch(getServices);
  const { data: reviews } = useFetch(getReviews);

  const aboutText = content.aboutText || DEFAULT_ABOUT;

  const aboutShort =
    aboutText.length > 360
      ? aboutText.slice(0, 360).trim() + "…"
      : aboutText;

  const heroTitle =
    content.heroTitle && !content.heroTitle.includes("Aapki sehat")
      ? content.heroTitle
      : content.clinicName || "Govindpura Poly Clinic";

  const heroSubtitle =
    content.heroSubtitle && !content.heroSubtitle.includes("Jhotwara, Jaipur mein")
      ? content.heroSubtitle
      : content.tagline || "Your Health, Our Priority";

  return (
    <>
      {/* 1. HERO SECTION */}

      <section className="hero-ref" id="top">
        {/* Medical Cross Decorative Watermarks */}
        <div className="hero-crosses-bg" aria-hidden="true">
          <span className="med-cross cross-1">+</span>
          <span className="med-cross cross-2">+</span>
          <span className="med-cross cross-3">+</span>
          <span className="med-cross cross-4">+</span>
          <span className="med-cross cross-5">+</span>
        </div>

        <div className="hero-ref-container">
          <div className="row g-0 align-items-center hero-ref-row">

            {/* LEFT HERO CONTENT */}
            <div className="col-lg-5 hero-ref-left">
              <div className="hero-ref-content">

                
                <h1 className="hero-heading">
                  {heroTitle}
                </h1>

                {heroSubtitle && (
                  <p className="hero-subheading">
                    {heroSubtitle}
                  </p>
                )}

                <div className="hero-btn-row">
                  <Link
                    to="/appointment"
                    className="btn-hero-solid"
                  >
                    Book an appointment &rarr;
                  </Link>

                  <Link
                    to="/contact"
                    className="btn-hero-outlined"
                  >
                    Contact the clinic
                  </Link>
                </div>

                {/* ECG / Heartbeat line */}
                <div className="hero-ecg-container" aria-hidden="true">
                  <svg
                    className="hero-ecg-svg"
                    viewBox="0 0 540 80"
                    preserveAspectRatio="xMinYMid meet"
                  >
                    <path
                      d="M0 40 L100 40 L115 40 L125 46 L135 12 L148 70 L160 28 L170 48 L180 40 L540 40"
                    />
                  </svg>
                </div>

              </div>
            </div>

            {/* RIGHT HERO IMAGE - CLINIC BUILDING */}
            <div className="col-lg-7 hero-ref-right">
              <div className="hero-clinic-photo-frame">
                <img
                  src="/images/clinic-hero.jpeg"
                  alt="Govindpura Poly Clinic Hospital Building"
                  className="hero-clinic-photo-img"
                />
                <div className="hero-photo-gradient-mask" aria-hidden="true" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. ABOUT */}

      <section className="section" id="about">
        <div className="container">

          <div className="row g-5 align-items-center mb-5">

            <div className="col-lg-7 reveal">

              <span className="eyebrow">About us</span>

              <h2 className="section-title">
                About {content.clinicName}
              </h2>

              <p className="prose">
                {aboutShort}
              </p>

              <Link to="/about" className="link-arrow">
                Read our full story →
              </Link>

            </div>

            <div className="col-lg-5 reveal">

              <div className="who-we-are-image-card">
                <img
                  src="/images/life-care-lab.jpg"
                  alt="Life Care Laboratory - Govindpura Poly Clinic"
                  className="who-we-are-image"
                />
              </div>

            </div>

          </div>

          {/* Mission & Vision cards right below on Home page */}
          <div className="row g-4 pt-2">

            <div className="col-md-6 reveal">
              <div className="mv-card">
                <div className="mv-card-img-wrap">
                  <img
                    src="/images/mission.jpg"
                    alt="Doctor preparing medicine at Govindpura Poly Clinic - Our Mission"
                    className="mv-card-img"
                  />
                </div>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="glyph-box">
                    <Glyph name="target" />
                  </span>
                  <h3 className="m-0">Our mission</h3>
                </div>
                <p>{mission}</p>
              </div>
            </div>

            <div className="col-md-6 reveal">
              <div className="mv-card">
                <div className="mv-card-img-wrap">
                  <img
                    src="/images/vision.jpg"
                    alt="Doctor consulting patient at Govindpura Poly Clinic - Our Vision"
                    className="mv-card-img vision-img"
                  />
                </div>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="glyph-box">
                    <Glyph name="star" />
                  </span>
                  <h3 className="m-0">Our vision</h3>
                </div>
                <p>{vision}</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. WHY CHOOSE US */}

      <section className="section" id="why">
        <div className="container">

          <div className="section-head center reveal">

            <span className="eyebrow">Why choose us</span>

            <h2>Care you can trust</h2>

            <p>
              What you can expect from us, every time you visit.
            </p>

          </div>

          <div className="row g-4">

            {whyChooseUs.map((w) => (

              <div
                className="col-md-6 col-lg-4 reveal"
                key={w.title}
              >

                <div className="why-card">

                  <span className="glyph-box">
                    <Glyph name={w.icon} />
                  </span>

                  <h3>{w.title}</h3>

                  <p>{w.text}</p>

                </div>

              </div>

            ))}

          </div>
        </div>
      </section>

      {/* 6. FACILITIES */}

      <section className="section" id="facilities">
        <div className="container">

          <div className="section-head center reveal">

            <span className="eyebrow">Our facilities</span>

            <h2>A comfortable place to be cared for</h2>

            <p>
              Clean, organised spaces designed with patients and families in mind.
            </p>

          </div>

          <div className="row g-4">

            {facilities.map((f) => (

              <div
                className="col-md-6 col-lg-4 reveal"
                key={f.title}
              >

                <div className="facility-card">

                  <span className="glyph-box">
                    <Glyph name={f.icon} />
                  </span>

                  <h3>{f.title}</h3>

                  <p>{f.text}</p>

                </div>

              </div>

            ))}

          </div>
        </div>
      </section>

      {/* 7. DEPARTMENTS */}

      {services.length > 0 && (

        <section className="section section-alt" id="departments">
          <div className="container">

            <div className="row g-4 align-items-center">

              <div className="col-lg-4 reveal">

                <span className="eyebrow">Departments</span>

                <h2 className="section-title">
                  Find your department
                </h2>

                <p className="prose">
                  Choose a department and we will pre-select it in your appointment form.
                </p>

              </div>

              <div className="col-lg-8 reveal">

                <div className="dept-pills">

                  {services.map((s) => (

                    <Link
                      key={s._id}
                      to={`/appointment?service=${s._id}`}
                      className="dept-pill"
                    >
                      {s.title}
                    </Link>

                  ))}

                </div>

              </div>

            </div>
          </div>
        </section>

      )}

      {/* 8. APPOINTMENT BOOKING */}

      <section className="section" id="appointment">
        <div className="container">

          <div className="appt-band reveal">

            <div className="row g-4 align-items-start">

              <div className="col-lg-5">

                <span className="eyebrow">
                  Appointment booking
                </span>

                <h2 className="section-title">
                  Book your visit
                </h2>

                <p>
                  Send your request in a minute. Our team calls you back to confirm the date and time.
                </p>

                <div className="appt-info mt-4">

                  <div className="info-row">

                    <ClockIcon />

                    <div>
                      <span className="label">Timings</span>

                      <span className="value">
                        {content.timings || "Please call the clinic for timings"}
                      </span>
                    </div>

                  </div>

                  {content.phone && (

                    <div className="info-row">

                      <PhoneIcon />

                      <div>
                        <span className="label">Phone</span>

                        <a
                          className="value"
                          href={`tel:${content.phone}`}
                        >
                          {content.phone}
                        </a>
                      </div>

                    </div>

                  )}

                </div>
              </div>

              <div className="col-lg-7">
                <AppointmentForm />
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 9. PATIENT CARE + APPROACH */}

      <section className="section section-alt" id="care">
        <div className="container">

          <div className="row g-5 align-items-center">

            <div className="col-lg-6 reveal">

              <span className="eyebrow">Patient care</span>

              <h2 className="section-title">
                Support at every step of your care
              </h2>

              <ul className="care-list mt-4">

                {patientCare.map((c) => (

                  <li key={c.title}>

                    <Glyph name="check" />

                    <div>
                      <strong>{c.title}</strong>
                      <span>{c.text}</span>
                    </div>

                  </li>

                ))}

              </ul>

            </div>

            <div className="col-lg-6 reveal">

              <div className="row g-3">

                {approachPoints.slice(3, 6).map((p) => (

                  <div className="col-12" key={p.title}>

                    <div className="approach-card d-flex gap-3 align-items-start">

                      <span className="glyph-box">
                        <Glyph name={p.icon} />
                      </span>

                      <div>
                        <h3>{p.title}</h3>
                        <p>{p.text}</p>
                      </div>

                    </div>

                  </div>

                ))}

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 10. REVIEWS */}

      {reviews.length > 0 && (

        <section className="section" id="reviews">
          <div className="container">

            <div className="section-head center reveal">

              <span className="eyebrow">Testimonials</span>

              <h2>What patients say</h2>

            </div>

            <div className="row g-4">

              {reviews.slice(0, 3).map((r) => (

                <div
                  className="col-md-4 reveal"
                  key={r._id}
                >

                  <div className="review-card">

                    <Stars value={r.rating} />

                    <p>{r.comment}</p>

                    <div className="who">
                      {r.patientName}
                    </div>

                  </div>

                </div>

              ))}

            </div>

            <p className="mt-4 text-center">

              <Link to="/reviews" className="link-arrow">
                Read all reviews →
              </Link>

            </p>

          </div>
        </section>

      )}

      {/* 11. FAQ */}

      <section className="section section-alt" id="faq">
        <div className="container">

          <div className="row g-5">

            <div className="col-lg-4 reveal">

              <span className="eyebrow">FAQ</span>

              <h2 className="section-title">
                Frequently asked questions
              </h2>

              <p className="prose">
                Can't find your answer? Send us an enquiry and our team will reply.
              </p>

              <Link
                to="/contact"
                className="btn-gp-outline mt-2"
              >
                Ask a question
              </Link>

            </div>

            <div className="col-lg-8">

              {faqs.map((f) => (

                <details
                  className="faq-item reveal"
                  key={f.q}
                >

                  <summary>{f.q}</summary>

                  <p>{f.a}</p>

                </details>

              ))}

            </div>

          </div>
        </div>
      </section>

      {/* 12. CONTACT + MAP */}

      <section className="section" id="contact">
        <div className="container">

          <div className="section-head center reveal">

            <span className="eyebrow">Contact us</span>

            <h2>Visit or get in touch</h2>

            <p>
              Find us on the map, call us, or send an enquiry.
            </p>

          </div>

          <div className="row g-4">

            <div className="col-lg-5 reveal">

              <div className="contact-info-card h-100">

                <h3 className="contact-card-title">
                  {content.clinicName}
                </h3>

                <div className="contact-info-list">

                  <div className="contact-info-item">
                    <span className="contact-icon-badge">
                      <PinIcon />
                    </span>
                    <div>
                      <span className="contact-info-label">Address</span>
                      <span className="contact-info-val">{content.address}</span>
                    </div>
                  </div>

                  {content.phone && (
                    <div className="contact-info-item">
                      <span className="contact-icon-badge">
                        <PhoneIcon />
                      </span>
                      <div>
                        <span className="contact-info-label">Phone</span>
                        <a className="contact-info-val" href={`tel:${content.phone}`}>
                          {content.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {content.email && (
                    <div className="contact-info-item">
                      <span className="contact-icon-badge">
                        <MailIcon />
                      </span>
                      <div>
                        <span className="contact-info-label">Email</span>
                        <a className="contact-info-val" href={`mailto:${content.email}`}>
                          {content.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {content.timings && (
                    <div className="contact-info-item">
                      <span className="contact-icon-badge">
                        <ClockIcon />
                      </span>
                      <div>
                        <span className="contact-info-label">Timings</span>
                        <span className="contact-info-val">{content.timings}</span>
                      </div>
                    </div>
                  )}

                </div>

                <div className="mt-4 pt-1">
                  <Link
                    to="/contact"
                    className="btn-contact-action"
                  >
                    Send an enquiry &rarr;
                  </Link>
                </div>

              </div>
            </div>

            <div className="col-lg-7 reveal">
              <div className="contact-map-card h-100">
                <MapEmbed />
              </div>
            </div>

          </div>
        </div>
      </section>

    </>
  );
}
