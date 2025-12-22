export const convertToEcuadorTime = (date: any) => {
  return new Date(date).toLocaleString("es-EC", {
    timeZone: "America/Guayaquil",
    hour12: false,
  });
};

export const formatDateToISO = (date: Date | null) => {
  if (!date) return null;
  return date.toISOString().substring(0, 10);
};
