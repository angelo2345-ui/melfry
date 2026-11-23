// Utilidades de formato para Melfry Rent Car

const DOP = new Intl.NumberFormat("es-DO", {
  style: "currency",
  currency: "DOP",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// Formatea un monto en pesos dominicanos (RD$)
export const formatCurrency = (value) => DOP.format(Number(value) || 0);

// Formatea una fecha ISO (YYYY-MM-DD) a formato local corto
export const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("es-DO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Devuelve la fecha de hoy en formato YYYY-MM-DD (para inputs date)
export const todayISO = () => new Date().toISOString().slice(0, 10);
