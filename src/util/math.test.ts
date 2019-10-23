import { rangeMax, rangeMin } from './math';

describe('rangeMax', () => {
  it('max > 1', () => {
    const data = [
      { Country: 'United States', Value: 12394 },
      { Country: 'Russia', Value: 6148 },
      { Country: 'Germany (FRG)', Value: 1653 },
    ];

    expect(rangeMax(data, (entry) => entry.Value)).toBe(13000);
  });

  it('0 < max < 1', () => {
    const data = [
      { Country: 'United States', Value: 0.35 },
      { Country: 'Russia', Value: 0.43 },
      { Country: 'Germany (FRG)', Value: 0.15 },
    ];

    expect(rangeMax(data, (entry) => entry.Value)).toBe(0.5);
  });
});

describe('rangeMin', () => {
  it('min > 0', () => {
    const data = [
      { Country: 'United States', Value: 12394 },
      { Country: 'Russia', Value: 6148 },
      { Country: 'Germany (FRG)', Value: 1653 },
    ];

    expect(rangeMin(data, (entry) => entry.Value)).toBe(1600);
  });

  it('min < 0', () => {
    const data = [
      { Country: 'United States', Value: -13242 },
      { Country: 'Russia', Value: -31411 },
      { Country: 'Germany (FRG)', Value: -2232 },
    ];

    expect(rangeMin(data, (entry) => entry.Value)).toBe(-32000);
  });
});
