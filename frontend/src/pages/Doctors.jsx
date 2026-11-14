import { Link } from "react-router-dom";
import useFetch from "../hooks/useFetch.js";
import { getDoctors } from "../services/api";
import PageHeader from "../components/PageHeader.jsx";
import DoctorCard from "../components/DoctorCard.jsx";
import EmptyState from "../components/EmptyState.jsx";

export default function Doctors() {
  const { data: doctors, loading, error } = useFetch(getDoctors);
  return (
    <>
      <PageHeader title="Our doctors" subtitle="Meet the team and choose your doctor when you book your visit." />
      <section className="section">
        <div className="container">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <EmptyState title="Doctor profiles could not be loaded">Please refresh the page or call the clinic.</EmptyState>
          ) : doctors.length === 0 ? (
            <EmptyState title="Doctor profiles coming soon">You can still book an appointment and the clinic will help you choose.</EmptyState>
          ) : (
            <div className="row g-4">
              {doctors.map((d) => (
                <div className="col-sm-6 col-lg-4 reveal" key={d._id}><DoctorCard doctor={d} /></div>
              ))}
            </div>
          )}
        </div>
      </section>
      <section className="section pt-0">
        <div className="container">
          <div className="cta-band reveal">
            <div>
              <h2>Ready to see a doctor?</h2>
              <p>Pick a doctor, choose a date and time, and send your request.</p>
            </div>
            <Link to="/appointment" className="btn-gp">Book an appointment</Link>
          </div>
        </div>
      </section>
    </>
  );
}
