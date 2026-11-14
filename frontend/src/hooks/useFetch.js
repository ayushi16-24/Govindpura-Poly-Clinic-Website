import { useEffect, useState } from "react";

// Ek API function chalata hai aur {data, loading, error} deta hai
export default function useFetch(fn, fallback = []) {
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    fn()
      .then((d) => alive && setData(d))
      .catch((e) => alive && setError(e?.response?.data?.message || "Data load nahi ho paya"))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, loading, error };
}
