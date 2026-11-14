import useFetch from "../hooks/useFetch.js";
import { getGallery } from "../services/api";
import PageHeader from "../components/PageHeader.jsx";
import EmptyState from "../components/EmptyState.jsx";

export default function Gallery() {
  const { data: images, loading, error } = useFetch(getGallery);
  return (
    <>
      <PageHeader title="Clinic gallery" subtitle="A look inside the clinic." />
      <section className="section">
        <div className="container">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <EmptyState title="Gallery load nahi ho paayi">{error}</EmptyState>
          ) : images.length === 0 ? (
            <EmptyState title="Photos jaldi aayengi">
              Abhi tak koi photo add nahi hui. Admin dashboard ke Gallery section se clinic ki asli photos add karein.
            </EmptyState>
          ) : (
            <div className="gallery-grid">
              {images.map((img) => (
                <figure key={img._id}>
                  <img src={img.imageUrl} alt={img.caption || "Clinic photo"} loading="lazy" />
                  {img.caption && <figcaption>{img.caption}</figcaption>}
                </figure>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
