import * as d3 from 'd3';
import { kebabToCamel } from './util';

export interface Margin {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

export type Easing =
  | 'elastic'
  | 'elastic-in'
  | 'elasitc-out'
  | 'elastic-in-out'
  | 'bounce'
  | 'bounce-in'
  | 'bounce-out'
  | 'bounce-in-out'
  | 'linear'
  | 'linear-in'
  | 'linear-out'
  | 'linear-in-out'
  | 'sin'
  | 'sin-in'
  | 'sin-out'
  | 'sin-in-out'
  | 'quad'
  | 'quad-in'
  | 'quad-out'
  | 'quad-in-out'
  | 'cubic'
  | 'cubic-in'
  | 'cubic-out'
  | 'cubic-in-out'
  | 'poly'
  | 'poly-in'
  | 'poly-out'
  | 'poly-in-out'
  | 'circle'
  | 'circle-in'
  | 'circle-out'
  | 'circle-in-out'
  | 'exp'
  | 'exp-in'
  | 'exp-out'
  | 'exp-in-out'
  | 'back'
  | 'back-in'
  | 'back-out'
  | 'back-in-out';

export function easing(easing: Easing) {
  return (d3 as Record<string, any>)[kebabToCamel(`ease-${easing ? easing : 'linear'}`)];
}
