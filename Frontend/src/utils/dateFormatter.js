export const formattedDate = (date) => {
  if (date) {
    // Split the input date into day, month, and year

    const [day, month, year] = date.split(".");

    // Create a new Date object using the parsed values
    const formattedDate = new Date(`${year}-${month}-${day}`);

    // Format the date to the desired output
    return formattedDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

};
