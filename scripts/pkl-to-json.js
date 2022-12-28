const fs = require("fs-extra");
const pickle = require("pickle");
const stringify = require("fast-safe-stringify").default;

const [, , input, output] = process.argv;

console.log("Reading", input);
const data = fs.readFileSync(input);

console.log("Parsing", data);
pickle.loads(data, (parsed) => {
  console.log("Writing", parsed, output);
  fs.writeFileSync(output, stringify(parsed, undefined, 2));

  console.log("Done");
});
