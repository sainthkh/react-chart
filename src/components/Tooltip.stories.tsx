import React from 'react';
import { Tooltip } from './Tooltip';

export default {
  component: Tooltip,
  title: 'Tooltip',
};

const data = [{ key: 'United States', value: 13224, color: 'blue' }];

export const basic = () => (
  <Tooltip data={data} pointer={{ x: 0, y: 0 }} chart={{ width: 400, height: 200 }} />
);
