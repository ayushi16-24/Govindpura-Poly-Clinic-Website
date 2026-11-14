import { useEffect, useState } from "react";
import useAdminList from "./useAdminList.js";
import { adminGet, adminPatch, adminDelete, adminPut, getContent, errMsg } from "../../services/api";
import { useSite } from "../../context/SiteContext.jsx";
import Alert from "../../components/Alert.jsx";
import Stars from "../../components/Stars.jsx";

const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
const fmtDateTime = (d) => new Date(d).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
const confirmDelete = (what) => window.confirm(`${what} ko permanently delete karein?`);

function Loading({ loading, error }) {
  if (loading) return <p>Loading...</p>;
  return <Alert type="err">{error}</Alert>;
}

/* ---------------- Overview ---------------- */
export function OverviewPanel({ onNavigate }) {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    adminGet("/stats").then(setStats).catch((e) => setError(errMsg(e)));
  }, []);
  if (!stats) return <Loading loading={!error} error={error} />;
  const cards = [
    { n: stats.pending, l: "Pending appointments", tab: "appointments" },
    { n: stats.appointments, l: "Total appointments", tab: "appointments" },
    { n: stats.unread, l: "Unread enquiries", tab: "enquiries" },
    { n: stats.pendingReviews, l: "Reviews awaiting approval", tab: "reviews" },
    { n: stats.doctors, l: "Doctors", tab: "doctors" },
    { n: stats.services, l: "Services", tab: "services" },
  ];
  return (
    <div className="row g-3">
      {cards.map((c) => (
        <div className="col-6 col-lg-4" key={c.l}>
          <button className="stat-card w-100 text-start" style={{ cursor: "pointer" }} onClick={() => onNavigate(c.tab)}>
            <div className="num">{c.n}</div>
            <div className="lbl">{c.l}</div>
          </button>
        </div>
      ))}
    </div>
  );
}

/* ---------------- Appointments ---------------- */
const STATUSES = ["Pending", "Confirmed", "Completed", "Cancelled"];

export function AppointmentsPanel() {
  const [filter, setFilter] = useState("");
  const { items, loading, error, reload } = useAdminList(`/appointments${filter ? `?status=${filter}` : ""}`);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const setStatus = async (id, status) => {
    try {
      await adminPatch(`/appointments/${id}/status`, { status });
      reload();
    } catch (e) {
      setMsg({ type: "err", text: errMsg(e) });
    }
  };
  const remove = async (a) => {
    if (!confirmDelete(`${a.patientName} ki appointment`)) return;
    try {
      await adminDelete(`/appointments/${a._id}`);
      reload();
    } catch (e) {
      setMsg({ type: "err", text: errMsg(e) });
    }
  };

  return (
    <>
      <div className="mb-3 d-flex gap-2 align-items-center">
        <label htmlFor="afilter" className="mb-0 fw-semibold">Status:</label>
        <select id="afilter" className="form-select w-auto" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All</option>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
      <Alert type={msg.type}>{msg.text}</Alert>
      <Loading loading={loading} error={error} />
      {!loading && !error && (items.length === 0 ? <p>Koi appointment nahi mili.</p> : (
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Patient</th><th>Phone</th><th>Visit</th><th>Doctor / Service</th><th>Message</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {items.map((a) => (
                <tr key={a._id}>
                  <td>{a.patientName}<br /><small className="text-muted">{fmtDateTime(a.createdAt)}</small></td>
                  <td><a href={`tel:${a.phone}`}>{a.phone}</a>{a.email && <><br /><small>{a.email}</small></>}</td>
                  <td>{fmtDate(a.date)}<br /><small>{a.timeSlot}</small></td>
                  <td>{a.doctor?.name || "-"}<br /><small>{a.service?.title || ""}</small></td>
                  <td className="msg-cell">{a.message || "-"}</td>
                  <td>
                    <select className={`form-select form-select-sm badge-${a.status}`} value={a.status} onChange={(e) => setStatus(a._id, e.target.value)} aria-label="Appointment status">
                      {STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td><button className="link-danger" onClick={() => remove(a)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </>
  );
}

/* ---------------- Enquiries ---------------- */
export function EnquiriesPanel() {
  const { items, loading, error, reload } = useAdminList("/enquiries");
  const [msg, setMsg] = useState({ type: "", text: "" });
  const toggle = async (e) => {
    try { await adminPatch(`/enquiries/${e._id}/read`, { isRead: !e.isRead }); reload(); }
    catch (err) { setMsg({ type: "err", text: errMsg(err) }); }
  };
  const remove = async (e) => {
    if (!confirmDelete(`${e.name} ki enquiry`)) return;
    try { await adminDelete(`/enquiries/${e._id}`); reload(); }
    catch (err) { setMsg({ type: "err", text: errMsg(err) }); }
  };
  return (
    <>
      <Alert type={msg.type}>{msg.text}</Alert>
      <Loading loading={loading} error={error} />
      {!loading && !error && (items.length === 0 ? <p>Koi enquiry nahi aayi.</p> : (
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Name</th><th>Contact</th><th>Message</th><th>Received</th><th></th></tr></thead>
            <tbody>
              {items.map((e) => (
                <tr key={e._id} className={e.isRead ? "" : "row-unread"}>
                  <td>{e.name}</td>
                  <td><a href={`tel:${e.phone}`}>{e.phone}</a>{e.email && <><br /><small>{e.email}</small></>}</td>
                  <td className="msg-cell">{e.message}</td>
                  <td>{fmtDateTime(e.createdAt)}</td>
                  <td className="text-nowrap">
                    <button className="link-btn me-3" onClick={() => toggle(e)}>{e.isRead ? "Mark unread" : "Mark read"}</button>
                    <button className="link-danger" onClick={() => remove(e)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </>
  );
}

/* ---------------- Reviews ---------------- */
export function ReviewsPanel() {
  const { items, loading, error, reload } = useAdminList("/reviews");
  const [msg, setMsg] = useState({ type: "", text: "" });
  const approve = async (r) => {
    try { await adminPatch(`/reviews/${r._id}/approval`, { isApproved: !r.isApproved }); reload(); }
    catch (err) { setMsg({ type: "err", text: errMsg(err) }); }
  };
  const remove = async (r) => {
    if (!confirmDelete("Is review")) return;
    try { await adminDelete(`/reviews/${r._id}`); reload(); }
    catch (err) { setMsg({ type: "err", text: errMsg(err) }); }
  };
  return (
    <>
      <p className="text-muted">Review website par tabhi dikhega jab aap use approve karein.</p>
      <Alert type={msg.type}>{msg.text}</Alert>
      <Loading loading={loading} error={error} />
      {!loading && !error && (items.length === 0 ? <p>Koi review nahi aaya.</p> : (
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Patient</th><th>Rating</th><th>Comment</th><th>Date</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {items.map((r) => (
                <tr key={r._id}>
                  <td>{r.patientName}</td>
                  <td><Stars value={r.rating} /></td>
                  <td className="msg-cell">{r.comment}</td>
                  <td>{fmtDate(r.createdAt)}</td>
                  <td><span className={`badge-s ${r.isApproved ? "badge-on" : "badge-Pending"}`}>{r.isApproved ? "Approved" : "Pending"}</span></td>
                  <td className="text-nowrap">
                    <button className="link-btn me-3" onClick={() => approve(r)}>{r.isApproved ? "Hide" : "Approve"}</button>
                    <button className="link-danger" onClick={() => remove(r)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </>
  );
}

/* ---------------- Website content ---------------- */
const CONTENT_FIELDS = [
  { name: "clinicName", label: "Clinic name" },
  { name: "tagline", label: "Tagline (optional)" },
  { name: "heroTitle", label: "Home page headline" },
  { name: "heroSubtitle", label: "Home page sub-text", textarea: true },
  { name: "aboutText", label: "About the clinic (apni real details likhein)", textarea: true, rows: 6 },
  { name: "address", label: "Full address", textarea: true },
  { name: "phone", label: "Phone number" },
  { name: "whatsapp", label: "WhatsApp number (country code ke saath, e.g. 91XXXXXXXXXX)" },
  { name: "email", label: "Email" },
  { name: "timings", label: "Clinic timings (har line mein ek)", textarea: true },
  { name: "mapEmbedUrl", label: "Google Maps embed URL (Share > Embed a map > iframe ka src)" },
  { name: "mapLink", label: "Google Maps share link" },
];

export function ContentPanel() {
  const { setContent } = useSite();
  const [form, setForm] = useState(null);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getContent().then(setForm).catch((e) => setMsg({ type: "err", text: errMsg(e) }));
  }, []);

  if (!form) return <Loading loading={!msg.text} error={msg.text} />;

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const saved = await adminPut("/content", form);
      setContent(saved);
      setMsg({ type: "ok", text: "Content save ho gaya." });
    } catch (err) {
      setMsg({ type: "err", text: errMsg(err) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="form-panel" onSubmit={save} style={{ maxWidth: 760 }}>
      <Alert type={msg.type}>{msg.text}</Alert>
      {CONTENT_FIELDS.map((f) => (
        <div className="mb-3" key={f.name}>
          <label className="form-label" htmlFor={`c-${f.name}`}>{f.label}</label>
          {f.textarea ? (
            <textarea id={`c-${f.name}`} rows={f.rows || 3} className="form-control" value={form[f.name] || ""} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} />
          ) : (
            <input id={`c-${f.name}`} className="form-control" value={form[f.name] || ""} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} />
          )}
        </div>
      ))}
      <button className="btn-gp" disabled={busy}>{busy ? "Saving..." : "Save changes"}</button>
    </form>
  );
}
