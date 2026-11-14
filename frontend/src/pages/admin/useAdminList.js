import { useCallback, useEffect, useState } from "react";
import { adminGet } from "../../services/api";

// Admin list load karta hai aur reload() deta hai (add/edit/delete ke baad)
export default function useAdminList(path, publicFn) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    try {
      setError("");
      setItems(await (publicFn ? publicFn() : adminGet(path)));
    } catch (e) {
      setError(e?.response?.data?.message || "Data load nahi ho paya");
    } finally {
      setLoading(false);
    }
  }, [path, publicFn]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { items, loading, error, reload };
}
