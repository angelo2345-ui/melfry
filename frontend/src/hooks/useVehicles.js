import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

// Carga la flota desde Supabase. Si onlyAvailable es true, solo trae vehículos disponibles.
export const useVehicles = ({ onlyAvailable = false } = {}) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const load = async () => {
      if (!isSupabaseConfigured) {
        if (active) {
          setError("La base de datos aún no está configurada.");
          setLoading(false);
        }
        return;
      }

      let query = supabase
        .from("vehicles")
        .select("*")
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });

      if (onlyAvailable) {
        query = query.eq("status", "disponible");
      }

      const { data, error: queryError } = await query;
      if (!active) return;

      if (queryError) setError(queryError.message);
      else setVehicles(data || []);
      setLoading(false);
    };

    load();
    return () => {
      active = false;
    };
  }, [onlyAvailable]);

  return { vehicles, loading, error };
};
