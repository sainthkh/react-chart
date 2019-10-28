import React, { CSSProperties } from 'react';
import { measureText } from '../util';
import { Coordinate } from '../types';

export interface Entry {
  key: string;
  value: string | number;
  color: string;
}

interface Props {
  pointer: Coordinate;
  chart: {
    width: number;
    height: number;
  };
  style?: CSSProperties;
  data: Array<Entry>;
}

const FONT_SIZE = 14;
const PADDING_HORZ = 6;

export function Tooltip({ pointer, data, style }: Props) {
  if (data.length === 1) {
    const { key, value, color } = data[0];
    const { width: keyWidth } = measureText(key, FONT_SIZE * 1.2);
    const { width: valueWidth } = measureText(`${value}`, FONT_SIZE * 1);
    const width = keyWidth > valueWidth ? keyWidth : valueWidth;

    return (
      <div
        style={{
          ...wrapper,
          left: pointer.x + 10,
          top: pointer.y + 10,
          width: width + PADDING_HORZ * 2,
          ...style,
        }}
      >
        <div style={keyStyle}>{key}</div>
        <div style={{ color }}>{value}</div>
      </div>
    );
  }
  return <></>;
}

const wrapper: CSSProperties = {
  position: 'absolute',
  padding: `10px ${PADDING_HORZ}px`,
  border: `1px solid #e0e0e0`,
  fontSize: FONT_SIZE,
  borderRadius: 4,
  background: 'white',
};

const keyStyle = {
  fontSize: `1.2em`,
  fontWeight: 700,
  marginBottom: 6,
};
