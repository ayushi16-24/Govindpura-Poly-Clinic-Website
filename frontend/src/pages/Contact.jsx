import { useState } from "react";
import { useSite } from "../context/SiteContext.jsx";
import { sendEnquiry, errMsg } from "../services/api";
import PageHeader from "../components/PageHeader.jsx";
import Alert from "../components/Alert.jsx";
import MapEmbed from "../components/MapEmbed.jsx";
import { ClockIcon, MailIcon, PhoneIcon, PinIcon } from "../components/Icons.jsx";

const empty = { name: "", phone: "", email: "", message: "" };

export default function Contact() {
  const { content } = useSite();
  const [form, setForm] = useState(empty);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState({ type: "", text: "" });
  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setResult({ type: "", text: "" });
    try {
      const res = await sendEnquiry(form);
      setResult({ type: "ok", text: res.message });
      setForm(empty);
    } catch (err) {
      setResult({ type: "err", text: errMsg(err) });
    } finally {
      setBusy(false);
    }
  };

  const whatsapp = content.whatsapp ? content.whatsapp.replace(/\D/g, "") : "";

  return (
    <>
      <PageHeader title="Contact us" subtitle="Questions about timings, services or treatment? Send us an enquiry." />
      <section className="section">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-6">
              <form className="form-panel" onSubmit={submit} noValidate>
                <h2 className="h4 mb-3">Patient enquiry</h2>
                <Alert type={result.type}>{result.text}</Alert>
                <div className="mb-3">
                  <label className="form-label" htmlFor="name">Your name *</label>
                  <input id="name" name="name" className="form-control" value={form.name} onChange={set} required autoComplete="name" />
                </div>
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="cphone">Mobile number *</label>
                    <input id="cphone" name="phone" type="tel" inputMode="tel" className="form-control" value={form.phone} onChange={set} required autoComplete="tel" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="cemail">Email (optional)</label>
                    <input id="cemail" name="email" type="email" className="form-control" value={form.email} onChange={set} autoComplete="email" />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="cmessage">Your question *</label>
                  <textarea id="cmessage" name="message" rows={5} maxLength={1000} className="form-control" value={form.message} onChange={set} required />
                </div>
                <button className="btn-gp" disabled={busy}>{busy ? "Sending..." : "Send enquiry"}</button>
              </form>
            </div>
            <div className="col-lg-6">
              <div className="hero-card mb-4">
                <h2>{content.clinicName}</h2>
                <div className="info-row"><PinIcon /><div><span className="label">Address</span><span className="value">{content.address}</span></div></div>
                {content.phone && <div className="info-row"><PhoneIcon /><div><span className="label">Phone</span><a className="value" href={`tel:${content.phone}`}>{content.phone}</a></div></div>}
                {whatsapp && <div className="info-row"><PhoneIcon /><div><span className="label">WhatsApp</span><a className="value" href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer">Chat on WhatsApp</a></div></div>}
                {content.email && <div className="info-row"><MailIcon /><div><span className="label">Email</span><a className="value" href={`mailto:${content.email}`}>{content.email}</a></div></div>}
                {content.timings && <div className="info-row"><ClockIcon /><div><span className="label">Timings</span><span className="value">{content.timings}</span></div></div>}
              </div>
              <MapEmbed />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
