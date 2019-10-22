import React from 'react';
// @ts-ignore
import { action } from '@storybook/addon-actions';
// @ts-ignore
import { Button } from '@storybook/react/demo';

export default {
  title: 'Button',
};

export const text: React.FC<{}> = () => <Button onClick={action('clicked')}>Hello Button</Button>;

export const emoji = () => (
  <Button onClick={action('clicked')}>
    <span role="img" aria-label="so cool">
      😀 😎 👍 💯
    </span>
  </Button>
);
