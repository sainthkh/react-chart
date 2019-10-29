import React, { useEffect, SVGAttributes, MouseEvent, useReducer } from 'react';
import * as d3 from 'd3';
import { useUID } from 'react-uid';
import { SvgProperties } from 'csstype';
import { Margin, Easing, easing, Coordinate } from '../types';
import { camelToKebab, rangeMax as rangeMaxFunc, rangeMin as rangeMinFunc } from '../util';
import { Tooltip, Entry } from '../components/Tooltip';

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
type Direction = 'horizontal' | 'vertical';

type ChartSVG = d3.Selection<SVGGElement, unknown, HTMLElement, any>;
interface Event<T> {
  data: T;
  DOMEvent: MouseEvent;
  index: number;
  svg: ChartSVG;
  d3: typeof d3;
}
type EventHandler<T> = (event: Event<T>) => void;

interface BarPlotProps<T> {
  data: Array<T>;
  order?: Order;
  direction?: Direction;
  width: number;
  height: number;
  margin?: Margin;
  color?: string;
  negativeColor?: string;
  tooltip?: boolean;
  range?: {
    max?: number;
    min?: number;
  };
  barStyle?: AxisStyle;
  duration?: number;
  easing?: Easing;
  delay?: (d: T, i: number) => number;
  onBarClick?: EventHandler<T>;
  onBarContextMenu?: EventHandler<T>;
  onBarMouseEnter?: EventHandler<T>;
  onBarMouseMove?: EventHandler<T>;
  onBarMouseLeave?: EventHandler<T>;
  svg?: (svg: ChartSVG) => void;
}

type PropsWithDataKey<T> = BarPlotProps<T> & {
  dataKey?: {
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

interface State {
  showTooltip: boolean;
  pointer: Coordinate | null;
  data: Entry | null;
}

// prettier-ignore
type Action = 
  | { type: 'SHOW_TOOLTIP'; pointer: Coordinate; data: Entry; }
  | { type: 'HIDE_TOOLTIP'}

function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'SHOW_TOOLTIP':
      return {
        ...state,
        showTooltip: true,
        pointer: action.pointer,
        data: action.data,
      };
    case 'HIDE_TOOLTIP':
      return {
        ...state,
        showTooltip: false,
        pointer: null,
        data: null,
      };
    default:
      throw Error(`${(action as any).type} doesn't exist.`);
  }
}

export function BarPlot<T>(props: Props<T>) {
  const { width, height } = props;
  const [{ showTooltip, pointer, data }, dispatch] = useReducer(reducer, {
    showTooltip: false,
    pointer: { x: 0, y: 0 },
    data: null,
  });

  return (
    <>
      <Renderer {...props} dispatch={dispatch} />
      {showTooltip ? <Tooltip pointer={pointer} chart={{ width, height }} data={[data]} /> : null}
    </>
  );
}

function unpackProps<T, A extends AxisType>(props: Props<T>, axis: AxisType): AxisProps<T, A> {
  if ((props as PropsWithAxes<T>).axes) {
    const p = props as PropsWithAxes<T>;
    const { dataKey, attributes, style } = p.axes[axis];
    return {
      accessor: dataKeyAccessor<T, A>(dataKey),
      attributes,
      style,
    };
  } else {
    const p = props as PropsWithDataKey<T>;
    const dataKey = p.dataKey
      ? p.dataKey
      : {
          domain: 'key',
          range: 'value',
        };

    return {
      accessor: dataKeyAccessor<T, A>(dataKey[axis]),
      attributes: {},
      style: {},
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

type RendererProps<T> = Props<T> & {
  dispatch: React.Dispatch<Action>;
};

function Renderer<T>(props: RendererProps<T>) {
  const {
    data: userData,
    order = 'none',
    direction = 'vertical',
    width,
    height,
    margin: userMargin,
    color = '#69b3a2',
    negativeColor,
    tooltip,
    barStyle,
    range: userRange,
    svg: userSvg,
    duration,
    easing: userEasing,
    delay,
    onBarClick,
    onBarContextMenu,
    onBarMouseEnter,
    onBarMouseLeave,
    onBarMouseMove,
    dispatch,
  } = props;
  const id = useUID();
  const uid = `barplot-id-${id}`;

  useEffect(() => {
    // Phase 1. Calculate related numbers
    const margin = { top: 0, right: 0, bottom: 0, left: 0, ...userMargin };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    const domainLength = direction === 'vertical' ? chartWidth : chartHeight;
    const rangeLength = direction === 'vertical' ? chartHeight : chartWidth;

    const { accessor: accDomain, ...domainStyle } = unpackProps<T, 'domain'>(props, 'domain');
    const { accessor: accRange, ...rangeStyle } = unpackProps<T, 'range'>(props, 'range');

    const data =
      order === 'none'
        ? userData
        : [...userData].sort((a, b) => {
            if (order === 'asc') {
              return accRange(a) - accRange(b);
            } else {
              return accRange(b) - accRange(a);
            }
          });

    const initialRange = userRange ? userRange : {};
    const rangeMin = initialRange.min ? initialRange.min : rangeMinFunc(data, accRange);
    const rangeMax = initialRange.max ? initialRange.max : rangeMaxFunc(data, accRange);
    let maxBarLength = rangeLength;
    if (rangeMin * rangeMax < 0) {
      maxBarLength = (rangeMax / (rangeMax + Math.abs(rangeMin < 0 ? rangeMin : 0))) * rangeLength;
    }
    let domainAxisPos = 0;
    if (direction === 'vertical') {
      domainAxisPos = rangeMax > 0 ? maxBarLength : 0;
    } else {
      domainAxisPos = rangeMax > 0 ? rangeLength - maxBarLength : rangeLength;
    }

    // Phase 2. Generate functions for rendering.
    // Domain value -> Chart domain axis value
    const domain = d3
      .scaleBand()
      .range([0, domainLength])
      .domain(data.map(accDomain))
      .padding(0.2);

    // Range value -> Bar's end point bar on chart's range axis.
    let barEndPos: d3.ScaleLinear<number, number>;

    if (rangeMin > 0 || rangeMax > 0) {
      barEndPos = d3
        .scaleLinear()
        .domain([rangeMin > 0 ? rangeMin : 0, rangeMax])
        .range([maxBarLength, 0]);
    } else {
      barEndPos = d3
        .scaleLinear()
        .domain([rangeMin, rangeMax])
        .range([0, maxBarLength]);
    }

    // Range value -> Bar's starting point on chart's range axis.
    const range = d3
      .scaleLinear()
      .domain([rangeMin, rangeMax])
      .range(direction === 'vertical' ? [rangeLength, 0] : [0, rangeLength]);

    // Generate functions according to direction.
    const barFuncs = (direction: Direction) => {
      const domainStart = (d: T) => domain(accDomain(d));
      const rangePos = (d: T) => {
        const pos = range(accRange(d));
        return pos < domainAxisPos ? pos : domainAxisPos;
      };
      const rangeStart = (d: T) => (duration ? domainAxisPos : rangePos(d));
      const domainWidth = (_: T) => domain.bandwidth();
      const rangeLength = (d: T) => Math.abs(maxBarLength - barEndPos(accRange(d)));
      const rangeWidth = (d: T) => (duration ? 0 : rangeLength(d));

      if (direction === 'vertical') {
        return {
          xFunc: domainStart,
          yFunc: rangeStart,
          widthFunc: domainWidth,
          heightFunc: rangeWidth,
          animX: domainStart,
          animY: rangePos,
          animWidth: domainWidth,
          animHeight: rangeLength,
        };
      } else {
        return {
          xFunc: rangeStart,
          yFunc: domainStart,
          widthFunc: rangeWidth,
          heightFunc: domainWidth,
          animX: rangePos,
          animY: domainStart,
          animWidth: rangeLength,
          animHeight: domainWidth,
        };
      }
    };
    const { xFunc, yFunc, widthFunc, heightFunc, animX, animY, animWidth, animHeight } = barFuncs(
      direction
    );

    // Phase 3. Render Chart.
    // append the svg object to the body of the page
    const svg = d3
      .select(`#${uid}`)
      .html('')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Render Bars
    svg
      .selectAll('mybar')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', xFunc)
      .attr('y', yFunc)
      .attr('width', widthFunc)
      .attr('height', heightFunc)
      .attr('fill', function(d: T) {
        if (accRange(d) > 0) {
          return color;
        } else {
          return negativeColor ? negativeColor : color;
        }
      });

    const bars = svg.selectAll('rect');
    applyStyle(bars, barStyle || {});

    // Set up events for bars.
    const showTooltip = (event: MouseEvent, data: T) => {
      const x = event.pageX;
      const y = event.pageY;
      dispatch({
        type: 'SHOW_TOOLTIP',
        pointer: {
          x,
          y,
        },
        data: { key: accDomain(data), value: accRange(data), color },
      });
    };

    bars.on('click', function(data: T, index: number) {
      if (onBarClick) {
        onBarClick({ data, DOMEvent: d3.event, index, svg, d3 });
      }
    });
    bars.on('contextmenu', function(data: T, index: number) {
      if (onBarContextMenu) {
        onBarContextMenu({ data, DOMEvent: d3.event, index, svg, d3 });
      }
    });
    bars.on('mouseenter', function(data: T, index: number) {
      if (tooltip) {
        showTooltip(d3.event as MouseEvent, data);
      }

      if (onBarMouseEnter) {
        onBarMouseEnter({ data, DOMEvent: d3.event, index, svg, d3 });
      }
    });
    bars.on('mousemove', function(data: T, index: number) {
      if (tooltip) {
        showTooltip(d3.event as MouseEvent, data);
      }

      if (onBarMouseMove) {
        onBarMouseMove({ data, DOMEvent: d3.event, index, svg, d3 });
      }
    });
    bars.on('mouseleave', function(data: T, index: number) {
      dispatch({ type: 'HIDE_TOOLTIP' });
      if (onBarMouseLeave) {
        onBarMouseLeave({ data, DOMEvent: d3.event, index, svg, d3 });
      }
    });

    // Render Animation
    if (duration) {
      svg
        .selectAll('rect')
        .transition()
        .ease(easing(userEasing))
        .duration(duration)
        .attr('x', animX)
        .attr('y', animY)
        .attr('width', animWidth)
        .attr('height', animHeight)
        .delay(
          delay ||
            function(_: T, i) {
              return i * 100;
            }
        );
    }

    // Render x Axis
    const xAxis = svg.append('g').attr('class', 'x-axis');

    if (direction === 'vertical') {
      xAxis
        .attr('transform', `translate(0,${domainAxisPos})`)
        .call(rangeMax > 0 ? d3.axisBottom(domain) : d3.axisTop(domain));
    } else {
      xAxis.attr('transform', `translate(0, ${chartHeight})`).call(d3.axisBottom(range));
    }

    const domainText = svg.selectAll('.x-axis text');
    applyStyle(domainText, domainStyle);

    // Render y Axis
    const yAxis = svg.append('g').attr('class', 'y-axis');

    if (direction === 'vertical') {
      yAxis.call(d3.axisLeft(range));
    } else {
      yAxis
        .attr('transform', `translate(${domainAxisPos}, 0)`)
        .call(rangeMax > 0 ? d3.axisLeft(domain) : d3.axisRight(domain));
    }

    const rangeText = svg.selectAll('.y-axis text');
    applyStyle(rangeText, rangeStyle);

    if (userSvg) {
      userSvg(svg);
    }
  }, [
    userData,
    order,
    direction,
    width,
    height,
    userMargin,
    color,
    negativeColor,
    tooltip,
    barStyle,
    userRange,
    userSvg,
    duration,
    userEasing,
    delay,
    onBarClick,
    onBarContextMenu,
    onBarMouseEnter,
    onBarMouseLeave,
    onBarMouseMove,
  ]);

  return <div id={uid}></div>;
}
