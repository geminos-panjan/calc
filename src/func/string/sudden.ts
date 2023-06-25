export const suddenDeath = (text: string) => {
  const texts = text.split("\n");
  const maxText = texts.reduce((a, b) => (a.length > b.length ? a : b));
  const re = /[\u0000-\u3000]/g;
  const matched = maxText.match(re);
  const maxAscii = matched ? matched.length : 0;
  const humanLen = maxText.length - maxAscii * 0.4 + 2;
  const humans = Array(Math.floor(humanLen)).fill("人").join("");
  const yLen = humanLen * 1.6;
  const ys = Array(Math.floor(yLen))
    .fill("")
    .map((_, i) => (i % 2 ? "^" : "Y"))
    .join("");
  const joinText = texts
    .map((t) => {
      if (t === maxText) {
        return t;
      }
      const re = /[\u0000-\u3000]/g;
      const matched = maxText.match(re);
      const ascii = matched ? matched.length : 0;
      const fullSpaceLen = maxText.length - maxAscii - t.length + ascii;
      const halfSpaceLen = maxAscii - ascii;
      const fullSpaces = Array(fullSpaceLen).fill("\u3000").join("");
      const halfSpaces = Array(halfSpaceLen).fill(" ").join("");
      return t + fullSpaces + halfSpaces;
    })
    .join("　＜\n＞　");
  return `＿${humans}＿\n＞　${joinText}　＜\n￣${ys}￣`;
};

// console.log(suddenDeath("突然の死"));
// console.log(suddenDeath("hoge"));
// console.log(suddenDeath("hoge\nfuga"));
// console.log(suddenDeath("突然の死\nあいう\n死にました"));
