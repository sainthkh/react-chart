export const toKebabCase = (str: string) =>
  str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

export { max, min, sig, ceil10, digits, rangeMax, rangeMin } from './math';
