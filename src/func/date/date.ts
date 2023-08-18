const DATE_DEFAULT = "yyyy-MM-dd HH:mm:ss";

const paddingZero = (n: number, pad: number) => {
  return String(n).padStart(pad, "0");
};

export const parseTime = (str: string): number => {
  const regex =
    /(\d{4})[^\d]*(\d{2})?[^\d]*(\d{2})?[^\d]*(\d{2})?[^\d]*(\d{2})?[^\d]*(\d{2})?[^\d]*(\d{3})?/;
  const m = regex.exec(str);
  if (m == undefined) {
    return NaN;
  }
  const yyyy = Number(m[1] ?? 0);
  const MM = Number(m[2] ?? 1) - 1;
  const dd = Number(m[3] ?? 1);
  const HH = Number(m[4] ?? 0);
  const mm = Number(m[5] ?? 0);
  const ss = Number(m[6] ?? 0);
  const SSS = Number(m[7] ?? 0);
  const d = new Date(yyyy, MM, dd, HH, mm, ss, SSS);
  return d.getTime();
};

export class MyDate extends Date {
  format(pattern?: string) {
    const rule = [
      { pattern: "yyyy", replace: paddingZero(this.getFullYear(), 4) },
      { pattern: "MM", replace: paddingZero(this.getMonth() + 1, 2) },
      { pattern: "dd", replace: paddingZero(this.getDate(), 2) },
      { pattern: "HH", replace: paddingZero(this.getHours(), 2) },
      { pattern: "mm", replace: paddingZero(this.getMinutes(), 2) },
      { pattern: "ss", replace: paddingZero(this.getSeconds(), 2) },
      { pattern: "SSS", replace: paddingZero(this.getMilliseconds(), 3) },
    ];
    return rule.reduce(
      (p, c) => p.replace(c.pattern, c.replace),
      pattern ?? DATE_DEFAULT
    );
  }
}

// const d = new MyDate();
// console.log(d.format("yyyy-MM-dd HH:mm:ss.SSS"));
