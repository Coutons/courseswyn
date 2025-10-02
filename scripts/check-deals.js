#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const MIN_SIZE_BYTES = 50; // roughly enough for an empty array with metadata
const DEALS_PATH = path.join(__dirname, "..", "data", "deals.json");

async function main() {
  try {
    const stats = await fs.promises.stat(DEALS_PATH);
    if (!stats.isFile()) {
      console.error(`✖ ${DEALS_PATH} is not a regular file.`);
      process.exit(2);
    }
    if (stats.size < MIN_SIZE_BYTES) {
      console.error(`✖ WARNING: deals.json is only ${stats.size} bytes (< ${MIN_SIZE_BYTES}).`);
      process.exit(1);
    }

    const content = await fs.promises.readFile(DEALS_PATH, "utf8");
    JSON.parse(content);
    console.log(`✔ deals.json looks healthy (${stats.size} bytes).`);
  } catch (error) {
    console.error(`✖ Failed to validate deals.json: ${error.message}`);
    process.exit(1);
  }
}

main();
