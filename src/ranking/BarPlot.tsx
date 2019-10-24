import React, { useEffect, SVGAttributes } from 'react';
import * as d3 from 'd3';
import { useUID } from 'react-uid';
import { SvgProperties } from 'csstype';
import { Margin, Easing, easing } from '../types';
import { camelToKebab, rangeMax as rangeMaxFunc, rangeMin as rangeMinFunc } from '../util';

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

type Order = 'none' | 'desc' | 'asc';

interface BarPlotProps<T> {
  data: Array<T>;
  order?: Order;
  width: number;
  height: number;
  margin?: Margin;
  color?: string;
  negativeColor?: string;
  range?: {
    max?: number;
    min?: number;
  };
  barStyle?: AxisStyle;
  duration?: number;
  easing?: Easing;
  delay?: (d: T, i: number) => number;
  svg?: (svg: d3.Selection<SVGGElement, unknown, HTMLElement, any>) => void;
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
  for (const attr in props.attributes) {
    svg = svg.attr(camelToKebab(attr), (props.attributes as Record<string, any>)[attr]);
  }

  for (const property in props.style) {
    svg = svg.style(camelToKebab(property), (props.style as Record<string, any>)[property]);
  }
}

export function BarPlot<T>(props: Props<T>) {
  const {
    data: userData,
    order = 'none',
    width,
    height,
    margin: userMargin,
    color = '#69b3a2',
    negativeColor,
    barStyle = {},
    range: initialRange = {},
    svg: userSvg,
    duration,
    easing: userEasing,
    delay,
  } = props;
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

    const data =
      order === 'none'
        ? userData
        : userData.sort((a, b) => {
            if (order === 'asc') {
              return accRange(a) - accRange(b);
            } else {
              return accRange(b) - accRange(a);
            }
          });

    const rangeMin = initialRange.min ? initialRange.min : rangeMinFunc(data, accRange);
    const rangeMax = initialRange.max ? initialRange.max : rangeMaxFunc(data, accRange);
    const positiveHeight =
      (rangeMax / (rangeMax + Math.abs(rangeMin < 0 ? rangeMin : 0))) * chartHeight;
    const xAxisPos = positiveHeight > 0 ? positiveHeight : 0;

    // Domain Function
    const domain = d3
      .scaleBand()
      .range([0, chartWidth])
      .domain(data.map(accDomain))
      .padding(0.2);

    // Range Functions
    const barLength = d3
      .scaleLinear()
      .domain([rangeMin > 0 ? rangeMin : 0, rangeMax])
      .range([positiveHeight, 0]);

    const range = d3
      .scaleLinear()
      .domain([rangeMin, rangeMax])
      .range([chartHeight, 0]);

    // Render Bars
    svg
      .selectAll('mybar')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', function(d: T) {
        return domain(accDomain(d));
      })
      .attr('y', function(d: T) {
        if (duration) {
          return xAxisPos;
        } else {
          const yPos = range(accRange(d));
          return yPos < xAxisPos ? yPos : xAxisPos;
        }
      })
      .attr('width', domain.bandwidth())
      .attr('height', function(d: T) {
        return duration ? 0 : Math.abs(positiveHeight - barLength(accRange(d)));
      })
      .attr('fill', function(d: T) {
        if (accRange(d) > 0) {
          return color;
        } else {
          return negativeColor ? negativeColor : color;
        }
      });

    const bars = svg.selectAll('rect');
    applyStyle(bars, barStyle);

    if (duration) {
      svg
        .selectAll('rect')
        .transition()
        .ease(easing(userEasing))
        .duration(duration)
        .attr('y', function(d: T) {
          const yPos = range(accRange(d));
          return yPos < xAxisPos ? yPos : xAxisPos;
        })
        .attr('height', function(d: T) {
          return Math.abs(positiveHeight - barLength(accRange(d)));
        })
        .delay(
          delay ||
            function(_: T, i) {
              return i * 100;
            }
        );
    }

    // Render x Axis
    svg
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${xAxisPos})`)
      .call(rangeMax > 0 ? d3.axisBottom(domain) : d3.axisTop(domain));

    const domainText = svg.selectAll('.x-axis text');
    applyStyle(domainText, domainStyle);

    // Render y Axis
    svg
      .append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(range));

    const rangeText = svg.selectAll('.y-axis text');
    applyStyle(rangeText, rangeStyle);

    if (userSvg) {
      userSvg(svg);
    }
  });

  return <div id={uid}></div>;
}
