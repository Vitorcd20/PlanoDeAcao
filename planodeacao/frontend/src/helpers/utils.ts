export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function safeDateFormat(dateString: string): string {
  if (!dateString) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;
  const cleanDate = dateString.includes("T") ? dateString.split("T")[0] : dateString;
  return /^\d{4}-\d{2}-\d{2}$/.test(cleanDate) ? cleanDate : dateString;
};

export function STATUS_LABELS(status: string): string {
  const labels: { [key: string]: string } = {
    "PENDENTE": "Pendente",
    "EM_ANDAMENTO": "Em Andamento",
    "CONCLUIDa": "Concluído"
  };
  return labels[status] || status;
}