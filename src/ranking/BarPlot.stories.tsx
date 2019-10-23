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

export const basicDataKey = () => (
  <BarPlot
    data={data}
    width={700}
    height={400}
    margin={defaultMargin}
    dataKey={{
      domain: (entry: Country) => entry.Country,
      range: (entry: Country) => entry.Value,
    }}
  />
);

export const dataKeyString = () => (
  <BarPlot
    data={data}
    width={700}
    height={400}
    margin={defaultMargin}
    dataKey={{
      domain: 'Country',
      range: 'Value',
    }}
    color="red"
  />
);

export const dataKeyArray = () => (
  <BarPlot
    data={dataArray}
    width={700}
    height={400}
    margin={defaultMargin}
    dataKey={{
      domain: 0,
      range: 1,
    }}
    color="blue"
  />
);

export const basicAxes = () => (
  <BarPlot
    data={data}
    width={700}
    height={400}
    margin={defaultMargin}
    axes={{
      domain: {
        dataKey: (entry: Country) => entry.Country,
      },
      range: {
        dataKey: (entry: Country) => entry.Value,
      },
    }}
  />
);

export const axesString = () => (
  <BarPlot
    data={data}
    width={700}
    height={400}
    margin={defaultMargin}
    axes={{
      domain: {
        dataKey: 'Country',
      },
      range: {
        dataKey: 'Value',
      },
    }}
    color="red"
  />
);

export const axesArray = () => (
  <BarPlot
    data={dataArray}
    width={700}
    height={400}
    margin={defaultMargin}
    axes={{
      domain: {
        dataKey: 0,
      },
      range: {
        dataKey: 1,
      },
    }}
    color="blue"
  />
);

export const axesStyle = () => (
  <BarPlot
    data={data}
    width={460}
    height={400}
    margin={defaultMargin}
    axes={{
      domain: {
        dataKey: (entry: Country) => entry.Country,
        attributes: {
          transform: 'translate(-10,0)rotate(-45)',
        },
        style: {
          textAnchor: 'end',
        },
      },
      range: {
        dataKey: (entry: Country) => entry.Value,
        style: {
          fill: 'blue',
        },
      },
    }}
    barStyle={{
      style: {
        stroke: 'black',
      },
    }}
  />
);

export const axesRange = () => (
  <BarPlot
    data={data}
    width={700}
    height={400}
    margin={defaultMargin}
    range={{
      max: 15000,
      min: 0,
    }}
    dataKey={{
      domain: (entry: Country) => entry.Country,
      range: (entry: Country) => entry.Value,
    }}
    color="green"
  />
);
