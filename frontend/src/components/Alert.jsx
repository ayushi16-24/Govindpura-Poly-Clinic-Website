export default function Alert({ type, children }) {
  if (!children) return null;
  return (
    <div className={`alert-gp ${type === "ok" ? "ok" : "err"}`} role={type === "ok" ? "status" : "alert"}>
      {children}
    </div>
  );
}
