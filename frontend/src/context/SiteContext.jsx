import { createContext, useContext, useEffect, useState } from "react";
import { getContent } from "../services/api";

const SiteContext = createContext({ content: null, loaded: false });

// Website ka text (clinic name, phone, timings...) ek baar fetch karke sab pages ko deta hai
export function SiteProvider({ children }) {
  const [content, setContent] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getContent()
      .then(setContent)
      .catch(() => setContent(null))
      .finally(() => setLoaded(true));
  }, []);

  // API na chale tab bhi basic fallback dikhe
  const safe = content || { clinicName: "Govindpura Poly Clinic", address: "Jhotwara, Jaipur" };
  return <SiteContext.Provider value={{ content: safe, loaded, setContent }}>{children}</SiteContext.Provider>;
}

export const useSite = () => useContext(SiteContext);
