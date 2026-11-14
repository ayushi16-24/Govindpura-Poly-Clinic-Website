import { useSite } from "../context/SiteContext.jsx";
import PageHeader from "../components/PageHeader.jsx";
import AppointmentForm from "../components/AppointmentForm.jsx";
import Glyph, { ClockIcon, PhoneIcon } from "../components/Icons.jsx";

const steps = [
  { icon: "calendar", title: "Send your request", text: "Fill in your details, preferred date and time, and choose a doctor or department." },
  { icon: "phone", title: "We call to confirm", text: "The clinic contacts you on your mobile number to confirm the appointment." },
  { icon: "users", title: "Visit the clinic", text: "Arrive at your confirmed time and our team will guide you from there." },
];

export default function Appointment() {
  const { content } = useSite();
  return (
    <>
      <PageHeader title="Book an appointment" subtitle="Send your request. The clinic will call you to confirm the time." />
      <section className="section">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-8 reveal">
              <AppointmentForm />
            </div>
            <div className="col-lg-4">
              <div className="feature-panel mb-4 reveal">
                <h3 className="h5 mb-2">How it works</h3>
                {steps.map((s, i) => (
                  <div className="mini-point" key={s.title}>
                    <span className="step-num">{i + 1}</span>
                    <div><strong>{s.title}</strong><span>{s.text}</span></div>
                  </div>
                ))}
              </div>
              <div className="hero-card reveal">
                <h3 className="h5 mb-2">Good to know</h3>
                <p className="mb-3">This is a request, not a confirmed booking. The clinic will contact you to confirm.</p>
                {content.timings && <div className="info-row"><ClockIcon /><div><span className="label">Timings</span><span className="value pre-line">{content.timings}</span></div></div>}
                {content.phone && <div className="info-row"><PhoneIcon /><div><span className="label">For urgent needs call</span><a className="value" href={`tel:${content.phone}`}>{content.phone}</a></div></div>}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
