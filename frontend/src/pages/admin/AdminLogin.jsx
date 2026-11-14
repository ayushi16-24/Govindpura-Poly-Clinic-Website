import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { errMsg } from "../../services/api";
import Alert from "../../components/Alert.jsx";
import { CrossIcon } from "../../components/Icons.jsx";

export default function AdminLogin() {
  const { admin, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (admin) return <Navigate to="/admin" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await login(email, password);
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-login">
      <form className="form-panel" onSubmit={submit}>
        <div className="brand mb-3">
          <span className="brand-mark" style={{ color: "#fff" }}><CrossIcon width={22} height={22} /></span>
          <span>Staff login<small>Govindpura Poly Clinic</small></span>
        </div>
        <Alert type="err">{error}</Alert>
        <div className="mb-3">
          <label className="form-label" htmlFor="aemail">Email</label>
          <input id="aemail" type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="username" />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="apass">Password</label>
          <input id="apass" type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
        </div>
        <button className="btn-gp w-100" disabled={busy}>{busy ? "Signing in..." : "Sign in"}</button>
        <p className="mt-3 mb-0 text-center"><Link to="/">Back to website</Link></p>
      </form>
    </div>
  );
}
