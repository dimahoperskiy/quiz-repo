/// <reference types="vite/client" />

declare module '@countries-geo' {
  import type { FeatureCollection } from 'geojson';
  const value: FeatureCollection;
  export default value;
}
