export const toKebabCase = (str: string) =>
  str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

export function max<T>(arr: Array<T>, f: (v: T) => number) {
  return Math.max(...arr.map(f));
}

export const sig = (num: number, digits: number = 2) => Number(num.toPrecision(digits));

export const ceil10 = (value: number, exp: number) => {
  if (exp === 0) {
    return Math.ceil(value);
  }

  if (!(typeof exp === 'number' && exp % 1 === 0)) {
    return NaN;
  }

  // Shift
  const v = value.toString().split('e');
  const i = Math.ceil(+(v[0] + 'e' + (v[1] ? +v[1] - exp : -exp)));
  // Shift back
  const v2 = i.toString().split('e');
  return +(v2[0] + 'e' + (v2[1] ? +v2[1] + exp : exp));
};

export const digits = (x: number) => {
  return Math.max(Math.floor(Math.log10(Math.abs(x))), 0) + 1;
};
