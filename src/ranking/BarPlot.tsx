import React, { useEffect, SVGAttributes } from 'react';
import * as d3 from 'd3';
import { useUID } from 'react-uid';
import { SvgProperties } from 'csstype';
import { Margin } from '../types';
import { toKebabCase } from '../util';

type AxisType = 'domain' | 'range';
type DataKeyDomainFunc<T> = (data: T) => string;
type DataKeyDomain<T> = string | number | DataKeyDomainFunc<T>;
type DataKeyRangeFunc<T> = (data: T) => number;
type DataKeyRange<T> = string | number | DataKeyRangeFunc<T>;
type DataKeyFunc<T, A extends AxisType> = A extends 'domain'
  ? DataKeyDomainFunc<T>
  : DataKeyRangeFunc<T>;

interface AxisStyle {
  attributes?: SVGAttributes<any>;
  style?: SvgProperties;
}

interface Domain<T> extends AxisStyle {
  dataKey: DataKeyDomain<T>;
}

interface Range<T> extends AxisStyle {
  dataKey: DataKeyRange<T>;
}

export function dataKeyAccessor<T, A extends AxisType>(
  accessor: DataKeyDomain<T> | DataKeyRange<T>
): DataKeyFunc<T, A> {
  const type = typeof accessor;
  if (type === 'number') {
    return ((data: T) => ((data as unknown) as Array<any>)[accessor as number]) as any;
  } else if (type === 'string') {
    return ((data: T) => (data as Record<string, any>)[accessor as string]) as any;
  }
  return accessor as DataKeyFunc<T, A>;
}

interface BarPlotProps<T> {
  data?: Array<T>;
  width: number;
  height: number;
  margin?: Margin;
  color?: string;
  barStyle?: AxisStyle;
}

type PropsWithDataKey<T> = BarPlotProps<T> & {
  dataKey: {
    domain: DataKeyDomain<T>;
    range: DataKeyRange<T>;
  };
};

type PropsWithAxes<T> = BarPlotProps<T> & {
  axes: {
    domain: Domain<T>;
    range: Range<T>;
  };
};

type Props<T> = PropsWithDataKey<T> | PropsWithAxes<T>;

interface AxisProps<T, A extends AxisType> {
  accessor: DataKeyFunc<T, A>;
  attributes: React.SVGAttributes<any>;
  style: SvgProperties;
}

function unpackProps<T, A extends AxisType>(props: Props<T>, axis: AxisType): AxisProps<T, A> {
  if ((props as PropsWithDataKey<T>).dataKey) {
    return {
      accessor: dataKeyAccessor<T, A>((props as PropsWithDataKey<T>).dataKey[axis]),
      attributes: {},
      style: {},
    };
  } else {
    const p = props as PropsWithAxes<T>;
    const { dataKey, attributes, style } = p.axes[axis];
    return {
      accessor: dataKeyAccessor<T, A>(dataKey),
      attributes,
      style,
    };
  }
}

function applyStyle(svg: d3.Selection<d3.BaseType, unknown, any, any>, props: AxisStyle) {
  const attributes = props.attributes || {};
  for (const attr in attributes) {
    svg = svg.attr(toKebabCase(attr), (props.attributes as Record<string, any>)[attr]);
  }

  const style = props.style || {};
  for (const property in style) {
    svg = svg.style(toKebabCase(property), (props.style as Record<string, any>)[property]);
  }
}

export function BarPlot<T>(props: Props<T>) {
  const { data, width, height, margin: userMargin, color, barStyle } = props;
  const id = useUID();
  const uid = `barplot-id-${id}`;
  useEffect(() => {
    // set the dimensions and margins of the graph
    const margin = { top: 0, right: 0, bottom: 0, left: 0, ...userMargin };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3
      .select(`#${uid}`)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const { accessor: accDomain, ...domainStyle } = unpackProps<T, 'domain'>(props, 'domain');
    const { accessor: accRange, ...rangeStyle } = unpackProps<T, 'range'>(props, 'range');

    // Domain axis
    const domain = d3
      .scaleBand()
      .range([0, chartWidth])
      .domain(data.map(accDomain))
      .padding(0.2);
    svg
      .append('g')
      .attr('class', 'domain-axis')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(d3.axisBottom(domain));

    const domainText = svg.selectAll('.domain-axis text');
    applyStyle(domainText, domainStyle);

    // Range axis
    var y = d3
      .scaleLinear()
      .domain([0, 13000])
      .range([chartHeight, 0]);
    svg
      .append('g')
      .attr('class', 'range-axis')
      .call(d3.axisLeft(y));

    const rangeText = svg.selectAll('.range-axis text');
    applyStyle(rangeText, rangeStyle);

    // Bars
    svg
      .selectAll('mybar')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', function(d: T) {
        return domain(accDomain(d));
      })
      .attr('y', function(d: T) {
        return y(accRange(d));
      })
      .attr('width', domain.bandwidth())
      .attr('height', function(d: T) {
        return chartHeight - y(accRange(d));
      })
      .attr('fill', color ? color : '#69b3a2');

    const bars = svg.selectAll('rect');
    applyStyle(bars, barStyle || {});
  });

  return <div id={uid}></div>;
}
