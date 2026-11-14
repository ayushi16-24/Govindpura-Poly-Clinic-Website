import { useState } from "react";
import useAdminList from "./useAdminList.js";
import { adminPost, adminPut, adminDelete, errMsg } from "../../services/api";
import Alert from "../../components/Alert.jsx";

const confirmDelete = (what) => window.confirm(`${what} ko permanently delete karein?`);

/**
 * Generic add / edit / delete manager. Doctors, Services aur Gallery teeno isi se bante hain.
 * props:
 *  path      -> admin API path (e.g. "/doctors")
 *  listFn    -> optional public list function (gallery ke liye)
 *  fields    -> form fields [{name,label,type,required,hint}]
 *  columns   -> table columns [{key,label,render?}]
 *  nameKey   -> delete confirm mein dikhane wala field
 *  editable  -> false ho to sirf add/delete
 */
export default function ResourcePanel({ path, listFn, fields, columns, nameKey, addLabel, editable = true, emptyText }) {
  const { items, loading, error, reload } = useAdminList(path, listFn);
  const [editing, setEditing] = useState(null); // null | {} (new) | item
  const [form, setForm] = useState({});
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [busy, setBusy] = useState(false);

  const openNew = () => {
    const defaults = {};
    fields.forEach((f) => { defaults[f.name] = f.type === "checkbox" ? true : ""; });
    setForm(defaults);
    setEditing({});
    setMsg({ type: "", text: "" });
  };
  const openEdit = (item) => {
    const values = {};
    fields.forEach((f) => { values[f.name] = item[f.name] ?? (f.type === "checkbox" ? true : ""); });
    setForm(values);
    setEditing(item);
    setMsg({ type: "", text: "" });
  };

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMsg({ type: "", text: "" });
    try {
      if (editing._id) await adminPut(`${path}/${editing._id}`, form);
      else await adminPost(path, form);
      setEditing(null);
      await reload();
    } catch (err) {
      setMsg({ type: "err", text: errMsg(err) });
    } finally {
      setBusy(false);
    }
  };

  const remove = async (item) => {
    if (!confirmDelete(item[nameKey] || "Is item")) return;
    try {
      await adminDelete(`${path}/${item._id}`);
      await reload();
    } catch (err) {
      setMsg({ type: "err", text: errMsg(err) });
    }
  };

  return (
    <>
      <div className="mb-3"><button className="btn-gp btn-sm-gp" onClick={openNew}>{addLabel}</button></div>
      {!editing && <Alert type={msg.type}>{msg.text}</Alert>}
      {loading && <p>Loading...</p>}
      <Alert type="err">{error}</Alert>
      {!loading && !error && (items.length === 0 ? <p>{emptyText}</p> : (
        <div className="table-wrap">
          <table className="table">
            <thead><tr>{columns.map((c) => <th key={c.key}>{c.label}</th>)}<th></th></tr></thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id}>
                  {columns.map((c) => <td key={c.key} className={c.wrap ? "msg-cell" : ""}>{c.render ? c.render(item) : item[c.key] || "-"}</td>)}
                  <td className="text-nowrap">
                    {editable && <button className="link-btn me-3" onClick={() => openEdit(item)}>Edit</button>}
                    <button className="link-danger" onClick={() => remove(item)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {editing && (
        <div className="modal-back" role="dialog" aria-modal="true" onMouseDown={(e) => e.target === e.currentTarget && setEditing(null)}>
          <form className="modal-box" onSubmit={save}>
            <h2 className="h4 mb-3">{editing._id ? "Edit" : addLabel}</h2>
            <Alert type={msg.type}>{msg.text}</Alert>
            {fields.map((f) => (
              <div className="mb-3" key={f.name}>
                {f.type === "checkbox" ? (
                  <div className="form-check">
                    <input id={`f-${f.name}`} type="checkbox" className="form-check-input" checked={!!form[f.name]} onChange={(e) => setForm({ ...form, [f.name]: e.target.checked })} />
                    <label className="form-check-label" htmlFor={`f-${f.name}`}>{f.label}</label>
                  </div>
                ) : (
                  <>
                    <label className="form-label" htmlFor={`f-${f.name}`}>{f.label}{f.required ? " *" : ""}</label>
                    {f.type === "textarea" ? (
                      <textarea id={`f-${f.name}`} rows={3} className="form-control" required={f.required} value={form[f.name] ?? ""} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} />
                    ) : (
                      <input id={`f-${f.name}`} type={f.type || "text"} min={f.type === "number" ? 0 : undefined} className="form-control" required={f.required} value={form[f.name] ?? ""} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} />
                    )}
                    {f.hint && <div className="form-text">{f.hint}</div>}
                  </>
                )}
              </div>
            ))}
            <div className="d-flex gap-2 justify-content-end">
              <button type="button" className="btn-gp-outline btn-sm-gp" onClick={() => setEditing(null)}>Cancel</button>
              <button className="btn-gp btn-sm-gp" disabled={busy}>{busy ? "Saving..." : "Save"}</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
