export const convertToEcuadorTime = (date) => {
    return new Date(date).toLocaleString("es-EC", {
        timeZone: "America/Guayaquil",
        hour12: false,
    });
};
export const formatDateToISO = (date) => {
    if (!date)
        return null;
    return date.toISOString().substring(0, 10);
};
