import { createInterface } from "readline";
import { stdin as input, stdout as output } from "process";
import { calculate } from "../src/syntax_tree.js";

const interaction = () => {
  console.log("calc - JavaScript Calculator");
  console.log("Input Formula...");
  console.log();
  const rl = createInterface({ input, output });
  const question = (answer: string) => {
    if (answer === "quit" || answer === "exit") {
      rl.close();
      return;
    }
    try {
      const result = calculate(answer);
      console.log(result);
    } catch (ex) {
      if (ex instanceof Error) {
        console.error(ex.stack);
      }
    }
    console.log();
    rl.question("> ", question);
  };
  rl.question("> ", question);
};

interaction();
