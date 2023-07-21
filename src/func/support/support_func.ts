import { ConstantKey, constants } from "../../constant.js";
import { InvalidArgsError } from "../../error.js";
import {
  CalcFunction,
  CalcFunctionKey,
  funcs,
  parseString,
} from "../calc_func.js";

export type SupportFunctionKey = "help" | "search";

export const supportFuncs: { [key in SupportFunctionKey]: CalcFunction } = {
  help: {
    funcs: {
      1: (s) => {
        const str = parseString(s);
        if (str in constants) {
          return constants[str as ConstantKey].description.join(" ");
        }
        if (str in funcs) {
          return funcs[str as CalcFunctionKey].description.join(" ");
        }
        throw new InvalidArgsError(str);
      },
    },
    description: ['help("s") 定数または関数sの説明を返す'],
  },
  search: {
    funcs: {
      1: (s) => {
        const str = parseString(s);
        if (str === "") {
          throw new InvalidArgsError('""');
        }
        const ids = Object.keys(Object.assign({}, constants, funcs));
        return ids
          .filter((v) =>
            v.toLocaleLowerCase().startsWith(str.toLocaleLowerCase())
          )
          .sort((a, b) => a.localeCompare(b))
          .join(" ");
      },
    },
    description: ['search("s") sから始まる定数または関数名を返す'],
  },
};
