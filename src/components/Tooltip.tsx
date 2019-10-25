import React, { CSSProperties } from 'react';
import { measureText } from '../util';

interface Entry {
  key: string;
  value: string | number;
  color: string;
}

interface Props {
  pointer: {
    x: number;
    y: number;
  };
  chart: {
    width: number;
    height: number;
  };
  style?: CSSProperties;
  data: Array<Entry>;
}

const FONT_SIZE = 14;
const PADDING_HORZ = 6;

export function Tooltip({ data, style }: Props) {
  if (data.length === 1) {
    const { key, value, color } = data[0];
    const { width } = measureText(key, FONT_SIZE * 1.2);
    return (
      <div style={{ ...wrapper, width: width + PADDING_HORZ * 2, ...style }}>
        <div style={keyStyle}>{key}</div>
        <div style={{ color }}>{value}</div>
      </div>
    );
  }
  return <></>;
}

const wrapper = {
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
