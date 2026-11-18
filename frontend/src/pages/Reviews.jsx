
import { useState } from "react";
import useFetch from "../hooks/useFetch.js";
import { getReviews, submitReview, errMsg } from "../services/api";
import PageHeader from "../components/PageHeader.jsx";
import Stars from "../components/Stars.jsx";
import EmptyState from "../components/EmptyState.jsx";
import Alert from "../components/Alert.jsx";

const clinicHighlights = [
  {
    title: "Patient Rating",
    icon: "⭐",
    description:
      "A reported rating of approximately 4.7–4.8 stars, subject to verification from patient feedback."
  },
  {
    title: "Patient Feedback",
    icon: "💬",
    points: [
      "Cooperative and polite support staff.",
      "Attentive doctors who listen carefully to patient concerns.",
      "Affordable and budget-friendly local healthcare."
    ]
  },
  {
    title: "Accessibility & Facilities",
    icon: "♿",
    points: [
      "Wheelchair-accessible entrance.",
      "Parking options for visitors.",
      "Gender-neutral restrooms.",
      "Family-friendly amenities."
    ]
  }
];

export default function Reviews() {
  const { data: reviews, loading, error } = useFetch(getReviews);
  const [form, setForm] = useState({
    patientName: "",
    rating: 0,
    comment: ""
  });
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState({
    type: "",
    text: ""
  });

  const submit = async (e) => {
    e.preventDefault();

    if (!form.rating) {
      return setResult({
        type: "err",
        text: "Rating chunein (1 se 5 stars)"
      });
    }

    setBusy(true);
    setResult({ type: "", text: "" });

    try {
      const res = await submitReview(form);
      setResult({ type: "ok", text: res.message });
      setForm({ patientName: "", rating: 0, comment: "" });
    } catch (err) {
      setResult({ type: "err", text: errMsg(err) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Patient Reviews"
        subtitle="Discover patient experiences and learn more about our clinic."
      />

      {/* Clinic Highlights */}
      <section className="section">
        <div className="container">
          <div className="section-heading text-center mb-5">
            <h2>Clinic Experience & Highlights</h2>
            <p>
              Learn about our patient experience, healthcare approach
              and accessibility facilities.
            </p>
          </div>

          <div className="row g-4">
            {clinicHighlights.map((item, index) => (
              <div className="col-md-6 col-lg-4" key={index}>
                <div className="review-card h-100 p-4">
                  <div className="mb-3" style={{ fontSize: "32px" }}>
                    {item.icon}
                  </div>

                  <h3 className="h5 mb-3">{item.title}</h3>

                  {item.description && (
                    <p>{item.description}</p>
                  )}

                  {item.points && (
                    <ul className="ps-3">
                      {item.points.map((point, i) => (
                        <li className="mb-2" key={i}>
                          {point}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Patient Reviews and Review Form */}
      <section className="section pt-0">
        <div className="container">
          <div className="row g-4">

            <div className="col-lg-7">
              <h2 className="h3 mb-4">Patient Testimonials</h2>

              {loading ? (
                <p>Loading...</p>
              ) : error ? (
                <EmptyState title="Reviews load nahi ho paaye">
                  Please refresh the page or call the clinic.
                </EmptyState>
              ) : reviews.length === 0 ? (
                <EmptyState title="Abhi tak koi review nahi">
                  Pehla review aap likhein.
                </EmptyState>
              ) : (
                <div className="row g-3">
                  {reviews.map((r) => (
                    <div className="col-md-6" key={r._id}>
                      <div className="review-card">
                        <Stars value={r.rating} />
                        <p>{r.comment}</p>
                        <div className="who">{r.patientName}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="col-lg-5">
              <form
                className="form-panel"
                onSubmit={submit}
                noValidate
              >
                <h2 className="h4 mb-3">Write a Review</h2>

                <Alert type={result.type}>
                  {result.text}
                </Alert>

                <div className="mb-3">
                  <label className="form-label" htmlFor="rname">
                    Your name *
                  </label>
                  <input
                    id="rname"
                    className="form-control"
                    value={form.patientName}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        patientName: e.target.value
                      })
                    }
                    required
                  />
                </div>

                <div className="mb-3">
                  <span className="form-label d-block">
                    Rating *
                  </span>

                  <div
                    className="star-input"
                    role="radiogroup"
                    aria-label="Rating"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        type="button"
                        key={n}
                        className={n <= form.rating ? "on" : ""}
                        onClick={() =>
                          setForm({ ...form, rating: n })
                        }
                        aria-label={`${n} star`}
                        aria-pressed={n === form.rating}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="rcomment">
                    Your experience *
                  </label>
                  <textarea
                    id="rcomment"
                    rows={4}
                    maxLength={600}
                    className="form-control"
                    value={form.comment}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        comment: e.target.value
                      })
                    }
                    required
                  />
                </div>

                <button className="btn-teal" disabled={busy}>
                  {busy ? "Sending..." : "Submit review"}
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
