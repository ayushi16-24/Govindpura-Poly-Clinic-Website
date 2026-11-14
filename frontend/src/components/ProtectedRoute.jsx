import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// Bina login ke /admin kholne par login page par bhej deta hai
export default function ProtectedRoute({ children }) {
  const { admin, loading } = useAuth();
  if (loading) return <div className="container py-5">Loading...</div>;
  if (!admin) return <Navigate to="/admin/login" replace />;
  return children;
}
