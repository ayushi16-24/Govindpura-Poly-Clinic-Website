import { Link } from "react-router-dom";
import Glyph, { serviceGlyph } from "./Icons.jsx";

export default function ServiceCard({ service, showBook = false }) {
  // Admin ne short icon (1-2 characters) diya ho to wahi, warna service ke naam se icon
  const custom = service.icon && service.icon.length <= 2 ? service.icon : null;
  return (
    <article className="svc-card">
      <div className="svc-icon">
        {service.image ? <img src={service.image} alt="" loading="lazy" /> : custom || <Glyph name={serviceGlyph(service.title)} />}
      </div>
      <h3>{service.title}</h3>
      <p>{service.description}</p>
      {showBook && (
        <Link to={`/appointment?service=${service._id}`} className="link-arrow d-inline-block mt-3">Book for this service →</Link>
      )}
    </article>
  );
}
