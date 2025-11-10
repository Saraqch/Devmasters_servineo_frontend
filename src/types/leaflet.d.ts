declare namespace L {
  interface LatLng {
    lat: number;
    lng: number;
  }

  interface LeafletEvent {
    latlng: LatLng;
  }

  interface LayerOptions {
    attribution?: string;
    maxZoom?: number;
  }

  interface Layer {
    addTo(map: Map): this;
  }

  interface Marker extends Layer {
    setLatLng(latlng: LatLng): this;
  }

  type LatLngBounds = object;

  interface PanInsideBoundsOptions {
    animate?: boolean;
  }

  interface Map {
    setView(center: LatLng | [number, number], zoom: number): this;
    on(type: string, fn: (e: LeafletEvent) => void): this;
    remove(): void;
    removeLayer(layer: Layer): this;
    setMaxBounds(bounds: LatLngBounds): this;
    panInsideBounds(bounds: LatLngBounds, options?: PanInsideBoundsOptions): this;
  }

  function map(element: HTMLElement): Map;
  function tileLayer(urlTemplate: string, options?: LayerOptions): Layer;
  function marker(latlng: LatLng | [number, number]): Marker;
  function latLng(lat: number, lng: number): LatLng;
  function latLngBounds(corner1: LatLng, corner2: LatLng): LatLngBounds;
}

interface Window {
  L: typeof L;
}