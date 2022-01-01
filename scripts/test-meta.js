const getMetadata = require("./src/get-metadata");
const url =
  "https://hn.algolia.com/?dateEnd=1609415804&dateRange=custom&dateStart=1577836800&page=0&prefix=false&query=&sort=byPopularity&type=story";

getMetadata(url)
  .then((data) => {
    console.log("data", data);
  })
  .catch((e) => {
    console.log("e", e);
  });
