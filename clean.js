const path = require("path");
const fs = require("fs");

// Delete the dist folder
fs.rmdirSync("dist", { recursive: true });
console.log("Deleted the dist folder");