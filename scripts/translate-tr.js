require("dotenv").config();

const translate = require("../.github/actions/translate/src/index");

async function main() {
  // await translate();
}

main().catch((e) => {
  console.log("e", e);
});
