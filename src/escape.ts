export const Color = {
  BLACK: 0,
  RED: 1,
  GREEN: 2,
  YELLOW: 3,
  BLUE: 4,
  MAGENTA: 5,
  CYAN: 6,
  WHITE: 7,
};

export const ResetEsc = () => {
  return `\x1b[0m`;
};

export const TextColorEsc = (color: number) => {
  return `\x1b[${30 + color}m`;
};
