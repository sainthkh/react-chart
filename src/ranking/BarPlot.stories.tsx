import React from 'react';
import { BarPlot } from './BarPlot';

export default {
  component: BarPlot,
  title: 'BarPlot',
};

interface Country {
  Country: string;
  Value: number;
}

const data: Country[] = [
  { Country: 'United States', Value: 12394 },
  { Country: 'Russia', Value: 6148 },
  { Country: 'Germany (FRG)', Value: 1653 },
  { Country: 'France', Value: 2162 },
  { Country: 'United Kingdom', Value: 1214 },
  { Country: 'China', Value: 1131 },
  { Country: 'Spain', Value: 814 },
  { Country: 'Netherlands', Value: 1167 },
  { Country: 'Italy', Value: 660 },
  { Country: 'Israel', Value: 1263 },
];

const dataArray = [
  ['United States', 12394],
  ['Russia', 6148],
  ['Germany (FRG)', 1653],
  ['France', 2162],
  ['United Kingdom', 1214],
  ['China', 1131],
  ['Spain', 814],
  ['Netherlands', 1167],
  ['Italy', 660],
  ['Israel', 1263],
];

const defaultMargin = {
  top: 30,
  rigtht: 30,
  bottom: 70,
  left: 60,
};

export const basic = () => (
  <BarPlot
    data={data}
    width={460}
    height={400}
    margin={defaultMargin}
    dataKey={{ x: (entry: Country) => entry.Country, y: (entry: Country) => entry.Value }}
  />
);

export const dataKeyString = () => (
  <BarPlot
    data={data}
    width={460}
    height={400}
    margin={defaultMargin}
    dataKey={{ x: 'Country', y: 'Value' }}
    color="red"
  />
);

export const dataKeyArray = () => (
  <BarPlot
    data={dataArray}
    width={460}
    height={400}
    margin={defaultMargin}
    dataKey={{ x: 0, y: 1 }}
    color="blue"
  />
);
