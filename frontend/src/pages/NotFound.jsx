import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container text-center">
        <h1>Page nahi mila</h1>
        <p className="mx-auto">Jo page aap dhoondh rahe hain wo exist nahi karta.</p>
        <Link to="/" className="btn-gp">Home par jayein</Link>
      </div>
    </section>
  );
}
