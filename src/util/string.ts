export const camelToKebab = (str: string) =>
  str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

export const kebabToCamel = (str: string) =>
  str.replace(/(-[a-z])/g, (g) => g.toUpperCase().replace('-', ''));

const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');
export const measureText = (text: string, fontSize: number) => {
  context.font = `bold ${fontSize}px arial`;
  const metrics = context.measureText(text);
  return {
    width: metrics.width,
    height: parseInt(context.font, 10),
  };
};
