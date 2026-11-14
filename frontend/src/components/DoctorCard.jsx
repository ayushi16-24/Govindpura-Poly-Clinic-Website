import { Link } from "react-router-dom";

export default function DoctorCard({ doctor }) {
  const initials = doctor.name
    .replace(/^dr\.?\s*/i, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
  return (
    <article className="doc-card">
      <div className="doc-photo">
        {doctor.photo ? <img src={doctor.photo} alt={doctor.name} loading="lazy" /> : initials}
      </div>
      <div className="doc-body">
        <h3>{doctor.name}</h3>
        {doctor.specialization && <div className="doc-spec">{doctor.specialization}</div>}
        {doctor.qualification && <div className="doc-meta">{doctor.qualification}</div>}
        {doctor.experience > 0 && <div className="doc-meta">{doctor.experience} years experience</div>}
        {doctor.availability && <div className="doc-meta">Available: {doctor.availability}</div>}
        {doctor.bio && <p className="doc-meta">{doctor.bio}</p>}
        <Link to={`/appointment?doctor=${doctor._id}`} className="btn-gp-outline btn-sm-gp mt-3">Book with {doctor.name.replace(/^dr\.?\s*/i, "Dr. ")}</Link>
      </div>
    </article>
  );
}
