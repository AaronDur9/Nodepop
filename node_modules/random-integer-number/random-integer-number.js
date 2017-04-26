function RandomIntegerNumber() {
  var hi, lo, sign;

  while (true) {
    hi = Math.random() * (1 << 26) | 0;
    lo = Math.random() * (1 << 26) | 0;
    sign = 1;

    if (hi >= (1 << 25)) {
      sign = -1;
      hi -= 1 << 25;
      if (hi === 0 && lo === 0) { // that's negative zero
        continue;
      }
    }

    return sign * (hi * (1 << 26)) + lo;
  }
}

module.exports = RandomIntegerNumber;
