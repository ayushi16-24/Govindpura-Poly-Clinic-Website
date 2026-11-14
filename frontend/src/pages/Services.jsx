
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";

const clinicServices = [
  {
    title: "Primary Care",
    points: [
      "General check-ups",
      "Routine health evaluations",
      "Treatment for minor or common illnesses."
    ]
  },
  {
    title: "Specialized Treatments",
    points: [
      "Management for joint pain",
      "General medical consultations",
      "Family health services."
    ]
  },
  {
    title: "Preventative Care",
    points: [
      "Health screenings",
      "Patient counseling",
      "Advisory care."
    ]
  }
];

export default function Services() {
  return (
    <>
      <PageHeader
        title="Medical Services"
        subtitle="Comprehensive healthcare services for you and your family."
      />

      <section className="section">
        <div className="container">
          <div className="row g-4">
            {clinicServices.map((service, index) => (
              <div
                className="col-md-6 col-lg-4 reveal"
                key={index}
              >
                <div className="service-card h-100 p-4">
                  <h3>{service.title}</h3>

                  <ul className="mt-3">
                    {service.points.map((point, i) => (
                      <li key={i} className="mb-2">
                        {point}
                      </li>
                    ))}
                  </ul>
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
              <h2>Not sure which service you need?</h2>
              <p>
                Send us a message through the enquiry form,
                or book an appointment and mention your concern.
              </p>
            </div>

            <div className="d-flex flex-wrap gap-2">
              <Link to="/appointment" className="btn-gp">
                Book an appointment
              </Link>

              <Link to="/contact" className="btn-ghost-light">
                Send an enquiry
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
