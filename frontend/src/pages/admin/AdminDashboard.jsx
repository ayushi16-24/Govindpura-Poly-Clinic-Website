import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { adminGet, getGallery } from "../../services/api";
import { CrossIcon } from "../../components/Icons.jsx";
import ResourcePanel from "./ResourcePanel.jsx";
import {
  OverviewPanel, AppointmentsPanel, EnquiriesPanel, ReviewsPanel, ContentPanel,
} from "./panels.jsx";

const activeBadge = (item) => (
  <span className={`badge-s ${item.isActive ? "badge-on" : "badge-off"}`}>{item.isActive ? "Visible" : "Hidden"}</span>
);

const doctorFields = [
  { name: "name", label: "Doctor name", required: true },
  { name: "specialization", label: "Specialization", required: true },
  { name: "qualification", label: "Qualification (apni real details)" },
  { name: "experience", label: "Experience (years)", type: "number" },
  { name: "availability", label: "Availability / days & timing" },
  { name: "photo", label: "Photo URL", type: "url", hint: "Photo ko kisi image hosting par upload karke uska link yahan paste karein." },
  { name: "bio", label: "Short bio", type: "textarea" },
  { name: "isActive", label: "Website par dikhayein", type: "checkbox" },
];
const doctorColumns = [
  { key: "name", label: "Name" },
  { key: "specialization", label: "Specialization" },
  { key: "experience", label: "Exp (yrs)" },
  { key: "isActive", label: "Status", render: activeBadge },
];

const serviceFields = [
  { name: "title", label: "Service title", required: true },
  { name: "description", label: "Description", type: "textarea", required: true },
  { name: "icon", label: "Icon letter/emoji (optional)" },
  { name: "image", label: "Image URL (optional)", type: "url" },
  { name: "isActive", label: "Website par dikhayein", type: "checkbox" },
];
const serviceColumns = [
  { key: "title", label: "Title" },
  { key: "description", label: "Description", wrap: true },
  { key: "isActive", label: "Status", render: activeBadge },
];

const galleryFields = [
  { name: "imageUrl", label: "Image URL", type: "url", required: true, hint: "Clinic ki asli photo ka direct link." },
  { name: "caption", label: "Caption (optional)" },
];
const galleryColumns = [
  { key: "imageUrl", label: "Photo", render: (g) => <img src={g.imageUrl} alt="" style={{ width: 72, height: 54, objectFit: "cover", borderRadius: 8 }} /> },
  { key: "caption", label: "Caption" },
];

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "appointments", label: "Appointments", badge: "pending" },
  { id: "enquiries", label: "Enquiries", badge: "unread" },
  { id: "doctors", label: "Doctors" },
  { id: "services", label: "Services" },
  { id: "reviews", label: "Reviews", badge: "pendingReviews" },
  { id: "gallery", label: "Gallery" },
  { id: "content", label: "Website content" },
];

export default function AdminDashboard() {
  const { admin, logout } = useAuth();
  const [tab, setTab] = useState("overview");
  const [menu, setMenu] = useState(false);
  const [counts, setCounts] = useState({});

  // Sidebar ke badges (pending / unread) tab badalne par refresh
  useEffect(() => {
    adminGet("/stats").then(setCounts).catch(() => {});
  }, [tab]);

  const go = (id) => { setTab(id); setMenu(false); };
  const current = TABS.find((t) => t.id === tab);

  return (
    <div className="admin-shell">
      <div className="admin-topbar">
        <strong>Clinic admin</strong>
        <button onClick={() => setMenu(!menu)} aria-expanded={menu}>Menu</button>
      </div>

      <aside className={`admin-side ${menu ? "open" : ""}`}>
        <div className="brand">
          <span className="brand-mark" style={{ color: "#fff" }}><CrossIcon width={22} height={22} /></span>
          <span>Clinic admin<small>{admin?.name}</small></span>
        </div>
        <nav className="admin-tabs" aria-label="Admin sections">
          {TABS.map((t) => (
            <button key={t.id} className={tab === t.id ? "active" : ""} onClick={() => go(t.id)}>
              <span>{t.label}</span>
              {t.badge && counts[t.badge] > 0 && <span className="count">{counts[t.badge]}</span>}
            </button>
          ))}
        </nav>
        <div className="d-grid gap-2 pt-3">
          <Link to="/" className="btn-gp-outline btn-sm-gp" style={{ color: "#fff", borderColor: "rgba(255,255,255,.4)" }}>View website</Link>
          <button className="btn-gp btn-sm-gp" onClick={logout}>Log out</button>
        </div>
      </aside>

      <section className="admin-main">
        <h1>{current.label}</h1>
        {tab === "overview" && <OverviewPanel onNavigate={go} />}
        {tab === "appointments" && <AppointmentsPanel />}
        {tab === "enquiries" && <EnquiriesPanel />}
        {tab === "doctors" && (
          <ResourcePanel path="/doctors" fields={doctorFields} columns={doctorColumns} nameKey="name" addLabel="Add doctor" emptyText="Abhi koi doctor add nahi hua." />
        )}
        {tab === "services" && (
          <ResourcePanel path="/services" fields={serviceFields} columns={serviceColumns} nameKey="title" addLabel="Add service" emptyText="Abhi koi service add nahi hui." />
        )}
        {tab === "reviews" && <ReviewsPanel />}
        {tab === "gallery" && (
          <ResourcePanel path="/gallery" listFn={getGallery} fields={galleryFields} columns={galleryColumns} nameKey="caption" addLabel="Add photo" editable={false} emptyText="Abhi koi photo add nahi hui." />
        )}
        {tab === "content" && <ContentPanel />}
      </section>
    </div>
  );
}
