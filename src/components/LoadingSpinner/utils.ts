import { CSSProperties } from 'react';

const buildSpinnerSize = (size: number): CSSProperties => {
  const sizePx = `${size}px`;
  const borderPx = `${size / 5}px`;

  return {
    width: sizePx,
    height: sizePx,
    borderWidth: borderPx,
    borderTopWidth: borderPx,
  };
};

export { buildSpinnerSize };
