export const MAP_DEFAULT_CENTER = {
  latitude: 41.9981,
  longitude: 21.4254,
} as const;

export const MAP_DEFAULT_ZOOM = 12;
export const MAP_MIN_ZOOM = 10;
export const MAP_MAX_ZOOM = 18;

export const MAP_STYLE = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "&copy; OpenStreetMap contributors"
    }
  },
  layers: [
    {
      id: "background",
      type: "background",
      paint: { "background-color": "#e0e0e0" }
    },
    {
      id: "osm-tiles",
      type: "raster",
      source: "osm"
    }
  ]
};

export const MAP_CAMERA_CONSTRAINTS = {
  minZoom: MAP_MIN_ZOOM,
  maxZoom: MAP_MAX_ZOOM,
} as const;
