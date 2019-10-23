import React, { useEffect } from 'react';
import * as d3 from 'd3';
import { useUID } from 'react-uid';
import { Margin } from '../types';

type DataKeyXFunc<T> = (data: T) => string;
type DataKeyX<T> = string | number | DataKeyXFunc<T>;
type DataKeyYFunc<T> = (data: T) => number;
type DataKeyY<T> = string | number | DataKeyYFunc<T>;
type DataKeyFunc<T> = DataKeyXFunc<T> | DataKeyYFunc<T>;

export function dataKeyAccessor<T>(accessor: DataKeyX<T> | DataKeyY<T>): DataKeyFunc<T> {
  const type = typeof accessor;
  if (type === 'number') {
    return (data: T) => ((data as unknown) as Array<any>)[accessor as number];
  } else if (type === 'string') {
    return (data: T) => ((data as unknown) as Record<string, any>)[accessor as string];
  }
  return accessor as DataKeyFunc<T>;
}

interface Props<T> {
  data?: Array<T>;
  width: number;
  height: number;
  margin?: Margin;
  dataKey: {
    x: DataKeyX<T>;
    y: DataKeyY<T>;
  };
  color?: string;
}

export function BarPlot<T>({ data, width, height, margin: userMargin, dataKey, color }: Props<T>) {
  const id = useUID();
  const uid = `barplot-id-${id}`;
  useEffect(() => {
    // set the dimensions and margins of the graph
    const margin = { top: 0, right: 0, bottom: 0, left: 0, ...userMargin };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3
      .select(`#${uid}`)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const accX = dataKeyAccessor(dataKey.x) as DataKeyXFunc<T>;
    const accY = dataKeyAccessor(dataKey.y) as DataKeyYFunc<T>;
    // X axis
    var x = d3
      .scaleBand()
      .range([0, chartWidth])
      .domain(data.map(accX))
      .padding(0.2);
    svg
      .append('g')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'translate(-10,0)rotate(-45)')
      .style('text-anchor', 'end');

    // Add Y axis
    var y = d3
      .scaleLinear()
      .domain([0, 13000])
      .range([chartHeight, 0]);
    svg.append('g').call(d3.axisLeft(y));

    // Bars
    svg
      .selectAll('mybar')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', function(d: T) {
        return x(accX(d));
      })
      .attr('y', function(d: T) {
        return y(accY(d));
      })
      .attr('width', x.bandwidth())
      .attr('height', function(d: T) {
        return chartHeight - y(accY(d));
      })
      .attr('fill', color ? color : '#69b3a2');
  });

  return <div id={uid}></div>;
}
