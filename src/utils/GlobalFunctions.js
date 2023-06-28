export const get_date = () => {
   const date = new Date();
   const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
   };
   const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);
   return formattedDate.replace(",", " -");
};
