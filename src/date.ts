export const formatDate = (d: Date, f: string) => {
  const rule: { [key: string]: string } = {
    yyyy: d.getFullYear().toString().padStart(4, "0"),
    MM: (d.getMonth() + 1).toString().padStart(2, "0"),
    dd: d.getDate().toString().padStart(2, "0"),
    HH: d.getHours().toString().padStart(2, "0"),
    mm: d.getMinutes().toString().padStart(2, "0"),
    ss: d.getSeconds().toString().padStart(2, "0"),
    SSS: d.getMilliseconds().toString().padStart(3, "0"),
  };

  for (const k in rule) {
    const v = rule[k];
    f = f.replace(k, v);
  }
  return f;
};
