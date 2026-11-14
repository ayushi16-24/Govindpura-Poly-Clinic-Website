export default function Stars({ value }) {
  return (
    <span className="stars" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= value ? "" : "off"}>★</span>
      ))}
    </span>
  );
}
