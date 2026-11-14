import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import useFetch from "../hooks/useFetch.js";
import { getDoctors, getServices, bookAppointment, errMsg } from "../services/api";
import Alert from "./Alert.jsx";

const todayStr = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};

// Ye form backend ke POST /api/appointments se judta hai (koi backend change nahi chahiye)
// URL se ?doctor= ya ?service= aaye to woh pehle se chun liya jaata hai
export default function AppointmentForm() {
  const [params] = useSearchParams();
  const { data: doctors } = useFetch(getDoctors);
  const { data: services } = useFetch(getServices);

  const blank = {
    patientName: "",
    phone: "",
    email: "",
    doctor: params.get("doctor") || "",
    service: params.get("service") || "",
    date: "",
    timeSlot: "",
    message: "",
  };
  const [form, setForm] = useState(blank);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState({ type: "", text: "" });

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setResult({ type: "", text: "" });
    try {
      const payload = { ...form };
      if (!payload.doctor) delete payload.doctor;
      if (!payload.service) delete payload.service;
      const res = await bookAppointment(payload);
      setResult({ type: "ok", text: res.message });
      setForm(blank);
    } catch (err) {
      setResult({ type: "err", text: errMsg(err) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="form-panel" onSubmit={submit} noValidate>
      <h3 className="h4 mb-1">Request an appointment</h3>
      <p className="text-muted small mb-3">Fields marked * are required.</p>
      <Alert type={result.type}>{result.text}</Alert>
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label" htmlFor="patientName">Patient name *</label>
          <input id="patientName" name="patientName" className="form-control" value={form.patientName} onChange={set} required autoComplete="name" />
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="phone">Mobile number *</label>
          <input id="phone" name="phone" type="tel" inputMode="tel" className="form-control" value={form.phone} onChange={set} placeholder="10-digit number" required autoComplete="tel" />
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="email">Email (optional)</label>
          <input id="email" name="email" type="email" className="form-control" value={form.email} onChange={set} autoComplete="email" />
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="service">Department / service</label>
          <select id="service" name="service" className="form-select" value={form.service} onChange={set}>
            <option value="">Not sure / any</option>
            {services.map((s) => <option key={s._id} value={s._id}>{s.title}</option>)}
          </select>
        </div>
        <div className="col-12">
          <label className="form-label" htmlFor="doctor">Select doctor (optional)</label>
          <select id="doctor" name="doctor" className="form-select" value={form.doctor} onChange={set}>
            <option value="">No preference</option>
            {doctors.map((d) => <option key={d._id} value={d._id}>{d.name}{d.specialization ? ` (${d.specialization})` : ""}</option>)}
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="date">Appointment date *</label>
          <input id="date" name="date" type="date" min={todayStr()} className="form-control" value={form.date} onChange={set} required />
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="timeSlot">Preferred time *</label>
          <input id="timeSlot" name="timeSlot" type="time" className="form-control" value={form.timeSlot} onChange={set} required />
        </div>
        <div className="col-12">
          <label className="form-label" htmlFor="message">Message (reason for visit, optional)</label>
          <textarea id="message" name="message" rows={3} maxLength={500} className="form-control" value={form.message} onChange={set} />
        </div>
        <div className="col-12">
          <button className="btn-gp" disabled={busy}>{busy ? "Sending..." : "Request appointment"}</button>
        </div>
      </div>
    </form>
  );
}
