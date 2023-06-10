const offset = (n: number) => {
  if (n < 0) {
    return n + 360;
  }
  return n;
};

const hue = (r: number, g: number, b: number) => {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max === min) {
    return 0;
  }
  if (max === r) {
    return offset((60 * (g - b)) / (max - min));
  }
  if (max === g) {
    return offset((60 * (b - r)) / (max - min) + 120);
  }
  return offset((60 * (r - g)) / (max - min) + 240);
};

const saturation = (r: number, g: number, b: number) => {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const cnt = (max + min) / 2;
  if (max + min === 0 || max - min === 0) {
    return 0;
  }
  if (cnt < 128) {
    return ((max - min) / (max + min)) * 100;
  }
  return ((max - min) / (510 - max - min)) * 100;
};

const light = (r: number, g: number, b: number) => {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const cnt = (max + min) / 2;
  return (cnt / 255) * 100;
};

const hslMax = (s: number, l: number) => {
  if (l < 50) {
    return 2.55 * (l + (l * s) / 100);
  }
  return 2.55 * (l + ((100 - l) * s) / 100);
};

const hslMin = (s: number, l: number) => {
  if (l < 50) {
    return 2.55 * (l - (l * s) / 100);
  }
  return 2.55 * (l - ((100 - l) * s) / 100);
};

const red = (h: number, s: number, l: number) => {
  const max = hslMax(s, l);
  const min = hslMin(s, l);
  if (h <= 60) {
    return max;
  }
  if (h <= 120) {
    return ((120 - h) / 60) * (max - min) + min;
  }
  if (h <= 240) {
    return min;
  }
  if (h <= 300) {
    return ((h - 240) / 60) * (max - min) + min;
  }
  return max;
};

const green = (h: number, s: number, l: number) => {
  const max = hslMax(s, l);
  const min = hslMin(s, l);
  if (h <= 60) {
    return (h / 60) * (max - min) + min;
  }
  if (h <= 180) {
    return max;
  }
  if (h <= 240) {
    return ((240 - h) / 60) * (max - min) + min;
  }
  return min;
};

const blue = (h: number, s: number, l: number) => {
  const max = hslMax(s, l);
  const min = hslMin(s, l);
  if (h <= 60) {
    return min;
  }
  if (h <= 180) {
    return ((h - 120) / 60) * (max - min) + min;
  }
  if (h <= 300) {
    return max;
  }
  return ((360 - h) / 60) * (max - min) + min;
};

export const rgb2hsl = (r: number, g: number, b: number) => {
  const h = hue(r, g, b);
  const s = saturation(r, g, b);
  const l = light(r, g, b);
  return { h, s, l };
};

export const hsl2rgb = (h: number, s: number, l: number) => {
  const r = red(h, s, l);
  const g = green(h, s, l);
  const b = blue(h, s, l);
  return { r, g, b };
};

// const hsl = rgb2hsl(123, 64, 78);
// const rgb = hsl2rgb(hsl.h, hsl.s, hsl.l);
// console.log(hsl);
// console.log(rgb);
