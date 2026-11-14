import { useSite } from "../context/SiteContext.jsx";

// Admin ne map URL diya hai to wahi, warna clinic ke naam + address se Google Maps search dikhata hai
export default function MapEmbed() {
  const { content } = useSite();
  const src =
    content.mapEmbedUrl ||
    `https://www.google.com/maps?q=${encodeURIComponent(`${content.clinicName} ${content.address}`)}&output=embed`;
  return (
    <>
      <iframe className="map-frame" title="Clinic location on Google Maps" src={src} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
      {content.mapLink && (
        <p className="mt-2 mb-0">
          <a href={content.mapLink} target="_blank" rel="noreferrer">Open in Google Maps</a>
        </p>
      )}
    </>
  );
}
