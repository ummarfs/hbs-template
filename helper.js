function registerBlogDateHelper(Handlebars) {
  Handlebars.registerHelper("blogDate", function (dateString, part) {
    if (!dateString) return "";

    const date = new Date(dateString);

    if (part === "day") {
      return ("0" + date.getDate()).slice(-2); // e.g. 01, 15, 20
    }
    if (part === "month") {
      return date.toLocaleString("en-US", { month: "short" }); // e.g. Jan, Feb, Jun
    }

    return "";
  });
}

module.exports = { registerBlogDateHelper };
