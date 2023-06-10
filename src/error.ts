export class InvalidTokenError extends Error {
  static {
    this.prototype.name = "InvalidTokenError";
  }
}

export class UnexpectedTokenError extends Error {
  static {
    this.prototype.name = "UnexpectedTokenError";
  }
}

export class UnexpectedEndError extends Error {
  static {
    this.prototype.name = "UnexpectedEndError";
  }
}

export class ZeroDivisionError extends Error {
  static {
    this.prototype.name = "ZeroDivisionError";
  }
}

export class InvalidArgsError extends Error {
  static {
    this.prototype.name = "InvalidArgsError";
  }
}
