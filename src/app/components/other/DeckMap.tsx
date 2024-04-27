"use client";

import { Map, useControl } from "react-map-gl";
import { MapboxOverlay } from "@deck.gl/mapbox";
import { DeckProps } from "@deck.gl/core";
import { TileLayer, TileLayerPickingInfo } from "@deck.gl/geo-layers";
import { BitmapLayer } from "@deck.gl/layers";
import { MB_KEY } from "@/lib/keys";

function DeckGLOverlay(props: DeckProps) {
  const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay(props));
  overlay.setProps(props);
  return null;
}

interface DeckMapProps {}

const DeckMap = ({}: DeckMapProps) => {
  const layer = new TileLayer({
    id: "TileLayer",
    data: "https://tiles.globalforestwatch.org/umd_regional_primary_forest_2001/v201901/uint16/{z}/{x}/{y}.png",
    maxZoom: 13,
    minZoom: 0,

    renderSubLayers: (props) => {
      const { boundingBox } = props.tile;

      return new DecodedLayer(props, {
        data: undefined,
        image: props.data,
        bounds: [
          boundingBox[0][0],
          boundingBox[0][1],
          boundingBox[1][0],
          boundingBox[1][1],
        ],
      });
    },
    pickable: true,
  });

  return (
    <Map
      initialViewState={{
        longitude: 0,
        latitude: 0,
        zoom: 3,
      }}
      mapStyle="mapbox://styles/mapbox/light-v9"
      mapboxAccessToken={MB_KEY}
    >
      <DeckGLOverlay layers={[layer]} />
    </Map>
  );
};

export default DeckMap;

class DecodedLayer extends BitmapLayer {
  getShaders() {
    return {
      ...super.getShaders(),
      inject: {
        // Include declarations for any needed uniforms
        "fs:#decl": `
          uniform vec4 purpleColor;
          uniform float threshold; // Threshold below which pixels are considered "null"
        `,
        // Adjust the color filtering logic
        "fs:DECKGL_FILTER_COLOR": `
          // Calculate the grayscale value to determine pixel intensity
          float grayscale = (color.r + color.g + color.b) / 3.0;
          // Check if the grayscale value is above the threshold
          if (grayscale > threshold) {
            color = purpleColor;
          } else {
            color = vec4(0.0, 0.0, 0.0, 0.0); // Make color transparent
          }
        `,
      },
    };
  }
  draw(opts: any) {
    // Define the purple color and threshold
    const purpleColor = [128, 0, 128, 255]; // RGBA for purple
    const threshold = 0.01; // Threshold for determining "null" pixels

    // Pass the uniform values to the shader
    opts.uniforms.purpleColor = purpleColor.map((x) => x / 255); // Normalize RGBA to 0-1
    opts.uniforms.threshold = threshold;
    super.draw(opts);
  }
}
