import { FormatType, calculate } from "../src/calculate.js";
import { ConstantKey, constants } from "../src/constant.js";
import { CalcFunctionKey, funcs } from "../src/func/calc_func.js";

const echoCalculation = (text: string, format: FormatType = "DECIMAL") => {
  return `${text} = ${calculate(text, format)}`;
};

const echoIdentifier = () => {
  return Object.keys(Object.assign({}, constants, funcs))
    .sort((a, b) => a.localeCompare(b))
    .join("\n");
};

const echoConstants = () => {
  return Object.keys(constants)
    .map((key) => {
      const c = constants[key as ConstantKey];
      return `${key},${c.value},${c.description.join(" ")}`;
    })
    .join("\n");
};

const echoFuncs = () => {
  return Object.keys(funcs)
    .map((key) => {
      const c = funcs[key as CalcFunctionKey];
      return `${key},${c.description.join(" ")}`;
    })
    .join("\n");
};

// console.log(echoIdentifier());
// console.log(echoConstants());
// console.log(echoFuncs());
// console.log(echoCalculation("1+2"));
// console.log(echoCalculation("2-1"));
// console.log(echoCalculation("2*3"));
// console.log(echoCalculation("2/3"));
// console.log(echoCalculation("2/(2^2-4)"));
// console.log(echoCalculation("2**3**2"));
// console.log(echoCalculation("2**(3**2)"));
// console.log(echoCalculation("(2**3)**2"));
// console.log(echoCalculation("2^5"));
// console.log(echoCalculation("1+2)*3"));
// console.log(echoCalculation("~0b0101"));
// console.log(echoCalculation("~0b0101~0b1010"));
// console.log(0b1101 | (0b1011 ^ (0b0011 & 0b1101)));
// console.log(echoCalculation("0b1101|0b1011^0b0011&0b1101"));
// console.log(echoCalculation('help("rgb2hsl")'));
// console.log(echoCalculation('search("a")'));
// console.log(echoCalculation('search("a'));
// console.log(echoCalculation("rgb2hsl(0xaabbcc)"));
// console.log(echoCalculation("rgb2hsl('hoge')"));
// console.log(echoCalculation("rgb2hsl(170, 187, 204)"));
// console.log(echoCalculation("rgb2hsl(1700, 1870, 2040)"));
// console.log(echoCalculation("rgb2hsl(-100, -100, -100)"));
// console.log(echoCalculation("rgb2hsl('hoge', 187, 204)"));
// console.log(echoCalculation("hsl2rgb(210, 25, 73.3)"));
// console.log(echoCalculation("hsl2rgb(60, 100, 50)"));
// console.log(echoCalculation("hsl2rgb(120, 100, 50)"));
// console.log(echoCalculation("hsl2rgb(180, 100, 50)"));
// console.log(echoCalculation("hsl2rgb(240, 100, 50)"));
// console.log(echoCalculation("hsl2rgb(300, 100, 50)"));
// console.log(echoCalculation("hsl2rgb(360, 100, 50)"));
// console.log(echoCalculation("hsl2rgb(-10, -100, -100)"));
// console.log(echoCalculation("hsl2rgb('hoge', 25, 73.3)"));
// console.log(echoCalculation("date()"));
// console.log(echoCalculation("date(time())"));
// console.log(echoCalculation("date('hoge')"));
// console.log(echoCalculation("time()"));
// console.log(echoCalculation('time("2023-06-25 13:36:00.000")'));
// console.log(echoCalculation("time(2023_06_25_13_36_00_000)"));
// console.log(echoCalculation('time("hoge")'));
// console.log(echoCalculation("log()"));
// console.log(echoCalculation('log("10")'));
// console.log(echoCalculation("log(10, 2)"));
// console.log(echoCalculation("log('hoge', 2)"));
// console.log(echoCalculation("rand()"));
// console.log(echoCalculation("rand('hoge')"));
// console.log(echoCalculation("rand(3, 5)"));
// console.log(echoCalculation("fact('hoge')"));
// console.log(echoCalculation("sin(30)"));
// console.log(echoCalculation('sin("5a")'));
// console.log(echoCalculation("cos(60)"));
// console.log(echoCalculation("tan(90)"));
// console.log(echoCalculation("asin(0.5)"));
// console.log(echoCalculation("acos(0.5)"));
// console.log(echoCalculation("atan(0)"));
// console.log(echoCalculation("gcd(12, 16)"));
// console.log(echoCalculation('gcd("hoge", "16")'));
// console.log(echoCalculation("lcm(12, 16)"));
// console.log(echoCalculation("sqrt(4)"));
// console.log(echoCalculation("sqrt('hoge')"));
// console.log(echoCalculation("sqrt(64, 3)"));
// console.log(echoCalculation("floor(0.1)"));
// console.log(echoCalculation("prime(123)"));
// console.log(echoCalculation("prime(15646464)"));
// console.log(echoCalculation('cvtbase("Bx", 64, 10)'));
// console.log(echoCalculation("cvtbase(123, 16, '10')"));
// console.log(echoCalculation("cvtbase(123, '16', 10)"));
// console.log(echoCalculation("reduct(12, 16)"));
// console.log(echoCalculation("reduct('hoge', 16)"));
// console.log(echoCalculation("reduct(0.1*100, 10)"));
// console.log(echoCalculation("permut(5, 2)"));
// console.log(echoCalculation("combin(5, 2)"));
// console.log(echoCalculation("sum(1, 2, 3)"));
// console.log(echoCalculation('sum("hoge", 2, 3)'));
// console.log(echoCalculation("ave(1, 2, 3)"));
// console.log(echoCalculation("max(1, 2, 3)"));
// console.log(echoCalculation("min(1, 2, 3)"));
// console.log(echoCalculation("char(0x68)"));
// console.log(echoCalculation('char("hoge")'));
// console.log(echoCalculation('unicode("h")'));
// console.log(echoCalculation('dash("ゆるさん！！")'));
// console.log(echoCalculation("dash(123)"));
// console.log(echoCalculation('full2half("スペチャンソンナニオコラナクテモー！")'));
// console.log(echoCalculation('space("ドンキーコング")'));
// console.log(echoCalculation('sudden("突然の死")'));
// console.log(echoCalculation('length("hoge")'));
// console.log(echoCalculation("1e-13", "SI"));
// console.log(echoCalculation("p", "SI"));
// console.log(echoCalculation("n", "SI"));
// console.log(echoCalculation("u", "SI"));
// console.log(echoCalculation("m", "SI"));
// console.log(echoCalculation("1", "SI"));
// console.log(echoCalculation("k", "SI"));
// console.log(echoCalculation("M", "SI"));
// console.log(echoCalculation("G", "SI"));
// console.log(echoCalculation("T", "SI"));
// console.log(echoCalculation("1e+13", "SI"));
// console.log(echoCalculation("-1000", "SI"));
// console.log(echoCalculation("-(1+2)"));
// console.log(echoCalculation("~(1+2)"));
// console.log(echoCalculation("2(1+2)"));
