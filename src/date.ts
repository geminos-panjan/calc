const paddingZero = (n: number, pad: number) => {
  return String(n).padStart(pad, "0");
};

export class MyDate extends Date {
  format(pattern: string) {
    const rule = [
      { pattern: "yyyy", replace: paddingZero(this.getFullYear(), 4) },
      { pattern: "MM", replace: paddingZero(this.getMonth() + 1, 2) },
      { pattern: "dd", replace: paddingZero(this.getDate(), 2) },
      { pattern: "HH", replace: paddingZero(this.getHours(), 2) },
      { pattern: "mm", replace: paddingZero(this.getMinutes(), 2) },
      { pattern: "ss", replace: paddingZero(this.getSeconds(), 2) },
      { pattern: "SSS", replace: paddingZero(this.getMilliseconds(), 3) },
    ];
    return rule.reduce((p, c) => p.replace(c.pattern, c.replace), pattern);
  }
}

// const d = new MyDate();
// console.log(d.format("yyyy-MM-dd HH:mm:ss.SSS"));
