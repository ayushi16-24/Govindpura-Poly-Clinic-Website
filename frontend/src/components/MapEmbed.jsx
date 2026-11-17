import { useSite } from "../context/SiteContext.jsx";

// Admin ne map URL diya hai to wahi, warna clinic ke naam + address se Google Maps search dikhata hai
export default function MapEmbed() {
  const { content } = useSite();
  const address = content.address || "Jhotwara, Jaipur";
  const clinicName = content.clinicName || "Govindpura Poly Clinic";
  const query = encodeURIComponent(`${clinicName} ${address}`);

  const src =
    content.mapEmbedUrl ||
    `https://www.google.com/maps?q=${query}&output=embed`;

  const mapLink =
    content.mapLink ||
    `https://www.google.com/maps/search/?api=1&query=${query}`;

  return (
    <div className="map-embed-wrap">
      <iframe
        className="map-frame"
        title="Clinic location on Google Maps"
        src={src}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
      <div className="mt-3">
        <a
          href={mapLink}
          target="_blank"
          rel="noreferrer"
          className="btn-map-action"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          Open in Google Maps &rarr;
        </a>
      </div>
    </div>
  );
}
