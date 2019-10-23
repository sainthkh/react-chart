export function max<T>(arr: Array<T>, f: (v: T) => number) {
  return Math.max(...arr.map(f));
}

export function min<T>(arr: Array<T>, f: (v: T) => number) {
  return Math.min(...arr.map(f));
}

export const sig = (num: number, digits: number = 2) => Number(num.toPrecision(digits));

function decimalAdjust(type: string, value: number, exp: number) {
  // If the exp is undefined or zero...
  if (typeof exp === 'undefined' || +exp === 0) {
    return (Math as Record<string, any>)[type](value);
  }
  // If the value is not a number or the exp is not an integer...
  if (!(typeof exp === 'number' && exp % 1 === 0)) {
    return NaN;
  }
  // Shift
  const v = value.toString().split('e');
  const i = (Math as Record<string, any>)[type](+(v[0] + 'e' + (v[1] ? +v[1] - exp : -exp)));
  // Shift back
  const v2 = i.toString().split('e');
  return +(v2[0] + 'e' + (v2[1] ? +v2[1] + exp : exp));
}

export const round10 = (value: number, exp: number) => decimalAdjust('round', value, exp);
export const floor10 = (value: number, exp: number) => decimalAdjust('floor', value, exp);
export const ceil10 = (value: number, exp: number) => decimalAdjust('ceil', value, exp);

export const digits = (x: number) => {
  return Math.max(Math.floor(Math.log10(Math.abs(x))), 0) + 1;
};

export function rangeMax<T>(data: Array<T>, accRange: (entry: T) => number) {
  const maximum = max(data, accRange);

  return sig(ceil10(maximum, digits(maximum) - 2));
}

export function rangeMin<T>(data: Array<T>, accRange: (entry: T) => number) {
  const minimum = min(data, accRange);

  return sig(floor10(minimum, digits(minimum) - 2));
}
