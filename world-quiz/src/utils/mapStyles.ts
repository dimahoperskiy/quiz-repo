import { Fill, Stroke } from 'ol/style';

export const defaultFill = new Fill({
  color: 'rgba(255, 255, 255, 0.6)',
});

export const hoverFill = new Fill({
  color: 'rgb(56,194,255)',
});

export const correctFill = new Fill({
  color: 'rgb(0,255,0)',
});

export const wrongFill = new Fill({
  color: 'rgb(255,0,0)',
});

export const defaultStroke = new Stroke({
  color: '#111',
  width: 1,
});

export const defaultTextFill = new Fill({
  color: '#000',
});
