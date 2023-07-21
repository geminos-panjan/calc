import { stdin, stdout } from "node:process";
import { createInterface } from "node:readline";
import { calculate } from "../dist/index.js";

const interaction = () => {
  const rl = createInterface({ input: stdin, output: stdout });
  console.log("calc - JavaScript Calculator");
  console.log("Input Expression...");
  rl.prompt();
  let ans = "";
  rl.on("line", (line) => {
    const text = line.trim();
    if (["exit", "quit"].includes(text)) rl.close();
    try {
      const result = calculate(text, undefined, ans);
      ans = String(result);
      console.log(result);
    } catch (ex) {
      if (ex instanceof Error) {
        console.error(ex.message);
        // console.error(ex.stack);
      }
    }
    rl.prompt();
  }).on("close", () => {
    process.exit();
  });
};

interaction();
