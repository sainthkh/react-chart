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
  right: 30,
  bottom: 70,
  left: 60,
};

export const basic = () => (
  <BarPlot
    data={[
      { key: 'United States', value: 12394 },
      { key: 'Russia', value: 6148 },
      { key: 'Germany (FRG)', value: 1653 },
      { key: 'France', value: 2162 },
      { key: 'United Kingdom', value: 1214 },
    ]}
    width={700}
    height={400}
    margin={defaultMargin}
  />
);

export const dataKeyFunction = () => (
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

export const userSvg = () => (
  <BarPlot
    data={data}
    width={700}
    height={400}
    margin={defaultMargin}
    dataKey={{
      domain: (entry: Country) => entry.Country,
      range: (entry: Country) => entry.Value,
    }}
    color="cyan"
    svg={(svg) => {
      svg.selectAll('.x-axis text').attr('font-weight', (_, i) => {
        return i === 2 ? 'bold' : 'normal';
      });
    }}
  />
);

export const animation = () => (
  <BarPlot
    data={data}
    width={700}
    height={400}
    margin={defaultMargin}
    duration={800}
    easing="elastic"
    delay={(_, i) => i * 150}
    dataKey={{
      domain: (entry: Country) => entry.Country,
      range: (entry: Country) => entry.Value,
    }}
    color="purple"
  />
);

const someNegativeValues: Country[] = [
  { Country: 'United States', Value: 12394 },
  { Country: 'Russia', Value: 6148 },
  { Country: 'Germany (FRG)', Value: -1653 },
  { Country: 'France', Value: 2162 },
  { Country: 'United Kingdom', Value: 1214 },
  { Country: 'China', Value: 1131 },
  { Country: 'Spain', Value: -814 },
  { Country: 'Netherlands', Value: 1167 },
  { Country: 'Italy', Value: -660 },
  { Country: 'Israel', Value: 1263 },
];

export const negativeValues = () => (
  <BarPlot
    data={someNegativeValues}
    width={700}
    height={400}
    margin={defaultMargin}
    negativeColor="red"
    dataKey={{
      domain: (entry: Country) => entry.Country,
      range: (entry: Country) => entry.Value,
    }}
  />
);

export const negativeValueAnimation = () => (
  <BarPlot
    data={someNegativeValues}
    width={700}
    height={400}
    margin={defaultMargin}
    duration={800}
    easing="elastic"
    delay={(_, i) => i * 150}
    dataKey={{
      domain: (entry: Country) => entry.Country,
      range: (entry: Country) => entry.Value,
    }}
    color="orange"
  />
);

const negativeOnly: Country[] = [
  { Country: 'United States', Value: -12394 },
  { Country: 'Russia', Value: -6148 },
  { Country: 'Germany (FRG)', Value: -1653 },
  { Country: 'France', Value: -2162 },
  { Country: 'United Kingdom', Value: -1214 },
  { Country: 'China', Value: -1131 },
  { Country: 'Spain', Value: -814 },
  { Country: 'Netherlands', Value: -1167 },
  { Country: 'Italy', Value: -660 },
  { Country: 'Israel', Value: -1263 },
];

export const allNegativeValues = () => (
  <BarPlot
    data={negativeOnly}
    width={700}
    height={400}
    margin={defaultMargin}
    dataKey={{
      domain: (entry: Country) => entry.Country,
      range: (entry: Country) => entry.Value,
    }}
  />
);

export const order = () => (
  <BarPlot
    data={data}
    order="asc"
    width={700}
    height={400}
    margin={defaultMargin}
    dataKey={{
      domain: (entry: Country) => entry.Country,
      range: (entry: Country) => entry.Value,
    }}
  />
);

const horizontalMargin = {
  top: 10,
  right: 80,
  bottom: 20,
  left: 80,
};

export const horizontal = () => (
  <BarPlot
    data={data}
    direction="horizontal"
    width={700}
    height={400}
    margin={horizontalMargin}
    dataKey={{
      domain: (entry: Country) => entry.Country,
      range: (entry: Country) => entry.Value,
    }}
  />
);

export const horizontalAnimation = () => (
  <BarPlot
    data={data}
    direction="horizontal"
    width={700}
    height={400}
    margin={horizontalMargin}
    duration={800}
    dataKey={{
      domain: (entry: Country) => entry.Country,
      range: (entry: Country) => entry.Value,
    }}
  />
);

export const horizontalNegativeValues = () => (
  <BarPlot
    data={someNegativeValues}
    direction="horizontal"
    width={700}
    height={400}
    margin={horizontalMargin}
    duration={800}
    dataKey={{
      domain: (entry: Country) => entry.Country,
      range: (entry: Country) => entry.Value,
    }}
  />
);

export const horizontalAllNegative = () => (
  <BarPlot
    data={negativeOnly}
    direction="horizontal"
    width={700}
    height={400}
    margin={horizontalMargin}
    duration={800}
    dataKey={{
      domain: (entry: Country) => entry.Country,
      range: (entry: Country) => entry.Value,
    }}
  />
);

export const chartwiseEvent = () => (
  <div
    onClick={() => {
      alert('clicked');
    }}
  >
    <BarPlot
      data={negativeOnly}
      direction="horizontal"
      width={700}
      height={400}
      margin={horizontalMargin}
      duration={800}
      dataKey={{
        domain: (entry: Country) => entry.Country,
        range: (entry: Country) => entry.Value,
      }}
    />
  </div>
);

export const barEvent = () => (
  <BarPlot
    data={negativeOnly}
    direction="horizontal"
    width={700}
    height={400}
    margin={horizontalMargin}
    duration={800}
    dataKey={{
      domain: (entry: Country) => entry.Country,
      range: (entry: Country) => entry.Value,
    }}
    onBarClick={(event) => {
      alert(event.data.Country);
    }}
  />
);

export const tooltip = () => (
  <BarPlot
    data={data}
    width={700}
    height={400}
    margin={defaultMargin}
    tooltip={true}
    dataKey={{
      domain: (entry: Country) => entry.Country,
      range: (entry: Country) => entry.Value,
    }}
  />
);

export const tooltipWithAnimation = () => (
  <BarPlot
    data={data}
    width={700}
    height={400}
    margin={defaultMargin}
    tooltip={true}
    duration={800}
    dataKey={{
      domain: (entry: Country) => entry.Country,
      range: (entry: Country) => entry.Value,
    }}
  />
);
