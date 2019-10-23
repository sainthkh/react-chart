import { kebabToCamel, camelToKebab } from './string';

it('kebabToCamel', () => {
  expect(kebabToCamel('ease-linear')).toBe('easeLinear');
});

it('camelToKebab', () => {
  expect(camelToKebab('textAnchor')).toBe('text-anchor');
});
