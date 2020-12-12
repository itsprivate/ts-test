const path = require("path");
const fsPure = require("fs");
const fs = fsPure.promises;

async function main({ dest = "./data/reddit-top" } = {}) {
  const outputs = require(`${process.env.GITHUB_WORKSPACE}/${process.env.OUTPUTS_PATH}`);
  const items = outputs;
  console.log(`There are ${items.length} items.`);
  console.log("\n");
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    item.original_created_utc = item.created_utc;
    let link = item.permalink;
    if (link && link.endsWith("/")) {
      link = link.slice(0, -1);
    }
    const redditFilePath = path.join(dest, `${link}.json`);
    // is exist
    const isRedditFileExist = fsPure.existsSync(redditFilePath);
    let createdAt = new Date();
    if (isRedditFileExist) {
      const originalJson = await fs.readFile(redditFilePath, "utf8");
      const originalRedditItem = JSON.parse(originalJson);
      createdAt = new Date(originalRedditItem.created_utc * 1000);
    }
    item.created_utc = Math.floor(createdAt.getTime() / 1000);

    await fs
      .mkdir(path.dirname(redditFilePath), {
        recursive: true,
      })
      .then(() => {
        return fs.writeFile(redditFilePath, JSON.stringify(item, null, 2));
      });
    console.log(`Write reddit json ${redditFilePath} success.`);
    const utcYear = createdAt.getUTCFullYear();
    const title = item.title;
    const id = item.id;
    const excerpt = item.the_new_excerpt;
    const tags = [item.subreddit];
    const locale = "en";

    const filePath = `./i18n/i18next/${locale}/reddit-title-${utcYear}.json`;
    const nextYearFilePath = `./i18n/i18next/${locale}/reddit-title-${
      utcYear + 1
    }.json`;

    const excerptFilePath = `./i18n/i18next/${locale}/reddit-excerpt-${utcYear}.json`;
    const nextYearExcerptFilePath = `./i18n/i18next/${locale}/reddit-excerpt-${
      utcYear + 1
    }.json`;

    const tagFilePath = `./i18n/i18next/${locale}/translation-tag.json`;

    const isExist = fsPure.existsSync(filePath);
    if (!isExist) {
      await fs.writeFile(filePath, "{}");
    }
    const isNextYearExist = fsPure.existsSync(nextYearFilePath);
    if (!isNextYearExist) {
      await fs.writeFile(nextYearFilePath, "{}");
    }

    const isExcerptExist = fsPure.existsSync(excerptFilePath);
    if (!isExcerptExist) {
      await fs.writeFile(excerptFilePath, "{}");
    }
    const isExcerptNextYearExist = fsPure.existsSync(nextYearExcerptFilePath);
    if (!isExcerptNextYearExist) {
      await fs.writeFile(nextYearExcerptFilePath, "{}");
    }

    const isTagFileExist = fsPure.existsSync(tagFilePath);
    if (!isTagFileExist) {
      await fs.writeFile(tagFilePath, "{}");
    }

    const localeJson = await fs.readFile(filePath, "utf8");
    const localeObj = JSON.parse(localeJson);
    localeObj[title] = title;
    // write
    await fs.writeFile(filePath, JSON.stringify(localeObj, null, 2));
    console.log(`Write ${filePath} success`);

    const localeExcerptJson = await fs.readFile(excerptFilePath, "utf8");
    const localeExcerptObj = JSON.parse(localeExcerptJson);
    localeExcerptObj[id] = excerpt;
    // write excerpt
    await fs.writeFile(
      excerptFilePath,
      JSON.stringify(localeExcerptObj, null, 2)
    );
    console.log(`Write ${excerptFilePath} success`);

    const tagLocaleJson = await fs.readFile(tagFilePath, "utf8");
    const tagLocaleObj = JSON.parse(tagLocaleJson);
    let isChanged = false;
    tags.forEach((tag) => {
      if (!tagLocaleObj[tag]) {
        isChanged = true;
        tagLocaleObj[tag] = tag;
      }
    });
    if (isChanged) {
      // write
      await fs.writeFile(tagFilePath, JSON.stringify(tagLocaleObj, null, 2));
      console.log(`Write ${tagFilePath} success`);
    } else {
      console.log(`No changes for tags, skip write tag file`);
    }
    console.log("\n");
  }
  return true;
}
module.exports = main;
