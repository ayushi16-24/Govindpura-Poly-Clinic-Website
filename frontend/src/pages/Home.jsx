
import { Link } from "react-router-dom";

import { useSite } from "../context/SiteContext.jsx";
import useFetch from "../hooks/useFetch.js";

import {
  getServices,
  getDoctors,
  getReviews
} from "../services/api";

import ServiceCard from "../components/ServiceCard.jsx";
import DoctorCard from "../components/DoctorCard.jsx";
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
  faqs
} from "../config/clinicInfo.js";

const DEFAULT_ABOUT =
  "Welcome to our clinic in Jhotwara, Jaipur. Our team is here to help you and your family with everyday healthcare, planned visits and follow-up care, in a warm and respectful environment.";

export default function Home() {
  const { content } = useSite();

  const { data: services, loading: sLoading } = useFetch(getServices);
  const { data: doctors, loading: dLoading } = useFetch(getDoctors);
  const { data: reviews } = useFetch(getReviews);

  const aboutText = content.aboutText || DEFAULT_ABOUT;

  const aboutShort =
    aboutText.length > 360
      ? aboutText.slice(0, 360).trim() + "…"
      : aboutText;

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
                  Govindpura Poly Clinic
                </h1>

                <p className="hero-subheading">
                  Your Health, Our Priority
                </p>

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

          <div className="row g-5 align-items-center">

            <div className="col-lg-6 reveal">

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

            <div className="col-lg-6 reveal">

              <div className="feature-panel">

                {approachPoints.slice(0, 3).map((p) => (

                  <div className="mini-point" key={p.title}>

                    <span className="glyph-box">
                      <Glyph name={p.icon} />
                    </span>

                    <div>
                      <strong>{p.title}</strong>
                      <span>{p.text}</span>
                    </div>

                  </div>

                ))}

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 3. SERVICES */}

      <section className="section section-alt" id="services">
        <div className="container">

          <div className="section-head center reveal">

            <span className="eyebrow">
              Our medical services
            </span>

            <h2>Care for you and your family</h2>

            <p>
              Explore the services available at the clinic and book the one you need.
            </p>

          </div>

          {sLoading ? null : services.length === 0 ? (

            <EmptyState title="Our service list is being updated">
              Please call the clinic for details about available services.
            </EmptyState>

          ) : (

            <div className="row g-4">

              {services.slice(0, 6).map((s) => (

                <div
                  className="col-md-6 col-lg-4 reveal"
                  key={s._id}
                >
                  <ServiceCard service={s} showBook />
                </div>

              ))}

            </div>

          )}

          {services.length > 6 && (

            <p className="mt-4 text-center">
              <Link to="/services" className="link-arrow">
                See all services →
              </Link>
            </p>

          )}

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

      {/* 5. DOCTORS */}

      <section className="section section-alt" id="doctors">
        <div className="container">

          <div className="section-head center reveal">

            <span className="eyebrow">Our doctors</span>

            <h2>Meet our doctors</h2>

            <p>
              Choose the doctor you prefer when you book your visit.
            </p>

          </div>

          {dLoading ? null : doctors.length === 0 ? (

            <EmptyState title="Doctor profiles coming soon">
              You can still book an appointment and the clinic will help you choose the right doctor.
            </EmptyState>

          ) : (

            <div className="row g-4">

              {doctors.slice(0, 4).map((d) => (

                <div
                  className="col-sm-6 col-lg-3 reveal"
                  key={d._id}
                >
                  <DoctorCard doctor={d} />
                </div>

              ))}

            </div>

          )}

          {doctors.length > 4 && (

            <p className="mt-4 text-center">
              <Link to="/doctors" className="link-arrow">
                See all doctors →
              </Link>
            </p>

          )}

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

              <div className="hero-card h-100">

                <h3 className="h5 mb-2">
                  {content.clinicName}
                </h3>

                <div className="info-row">

                  <PinIcon />

                  <div>
                    <span className="label">Address</span>

                    <span className="value">
                      {content.address}
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

                {content.email && (

                  <div className="info-row">

                    <MailIcon />

                    <div>
                      <span className="label">Email</span>

                      <a
                        className="value"
                        href={`mailto:${content.email}`}
                      >
                        {content.email}
                      </a>
                    </div>

                  </div>

                )}

                {content.timings && (

                  <div className="info-row">

                    <ClockIcon />

                    <div>
                      <span className="label">Timings</span>

                      <span className="value">
                        {content.timings}
                      </span>
                    </div>

                  </div>

                )}

                <div className="mt-3">

                  <Link
                    to="/contact"
                    className="btn-gp btn-sm-gp"
                  >
                    Send an enquiry
                  </Link>

                </div>

              </div>
            </div>

            <div className="col-lg-7 reveal">
              <MapEmbed />
            </div>

          </div>
        </div>
      </section>

    </>
  );
}
