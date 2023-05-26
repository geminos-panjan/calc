export const rgb2hsl = (r: number, g: number, b: number) => {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  let l = 0;
  if (max === min) {
    h = 0;
  } else if (max === r) {
    h = (60 * (g - b)) / (max - min);
  } else if (max === g) {
    h = (60 * (b - r)) / (max - min) + 120;
  } else {
    h = (60 * (r - g)) / (max - min) + 240;
  }
  if (h < 0) {
    h += 360;
  }
  const cnt = (max + min) / 2;
  if (max + min === 0 || max - min === 0) {
    s = 0;
  } else if (cnt < 128) {
    s = ((max - min) / (max + min)) * 100;
  } else {
    s = ((max - min) / (510 - max - min)) * 100;
  }
  l = (cnt / 255) * 100;
  return { h, s, l };
};

export const hsl2rgb = (h: number, s: number, l: number) => {
  let max = 0;
  let min = 0;
  if (l < 50) {
    max = 2.55 * (l + (l * s) / 100);
    min = 2.55 * (l - (l * s) / 100);
  } else {
    max = 2.55 * (l + ((100 - l) * s) / 100);
    min = 2.55 * (l - ((100 - l) * s) / 100);
  }
  let r = 0;
  let g = 0;
  let b = 0;
  if (h <= 60) {
    r = max;
    g = (h / 60) * (max - min) + min;
    b = min;
  } else if (h <= 120) {
    r = ((120 - h) / 60) * (max - min) + min;
    g = max;
    b = min;
  } else if (h <= 180) {
    r = min;
    g = max;
    b = ((h - 120) / 60) * (max - min) + min;
  } else if (h <= 240) {
    r = min;
    g = ((240 - h) / 60) * (max - min) + min;
    b = max;
  } else if (h <= 300) {
    r = ((h - 240) / 60) * (max - min) + min;
    g = min;
    b = max;
  } else {
    r = max;
    g = min;
    b = ((360 - h) / 60) * (max - min) + min;
  }
  return { r, g, b };
};
