"use client";

import { useState } from "react";
import { Map, useControl } from "react-map-gl";
import { MapboxOverlay } from "@deck.gl/mapbox";
import { DeckProps } from "@deck.gl/core";
import { TileLayer } from "@deck.gl/geo-layers";
import { BitmapLayer } from "@deck.gl/layers";
import { MB_KEY } from "@/lib/keys";

function DeckGLOverlay(props: DeckProps) {
  const overlay = useControl<MapboxOverlay>(
    () => new MapboxOverlay({ ...props, interleaved: true })
  );
  overlay.setProps(props);
  return null;
}

interface DeckMapProps {}

const DeckMap = ({}: DeckMapProps) => {
  const [mapState, setMapState] = useState({
    longitude: -100,
    latitude: 40,
    zoom: 3.5,
  });

  const devicePixelRatio =
    (typeof window !== "undefined" && window.devicePixelRatio) || 1;

  const layer = new TileLayer({
    id: "TileLayer",
    data: "https://tiles.globalforestwatch.org/umd_tree_cover_loss/v1.11/tcd_30/{z}/{x}/{y}.png",
    maxZoom: 12,
    minZoom: 0,
    longitude: mapState.longitude,
    latitude: mapState.latitude,
    zoom: mapState.zoom,

    renderSubLayers: (props) => {
      const { boundingBox } = props.tile;

      return new DecodedLayer(props, {
        data: undefined,
        image: props.data,
        textureParameters: {
          minFilter: "nearest",
          magFilter: "nearest",
        },
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
      {...mapState}
      onMove={(evt) => setMapState(evt.viewState)}
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
        "fs:#decl": `
          uniform float zoom;
          uniform float startYear;
          uniform float endYear;
        `,
        "fs:DECKGL_FILTER_COLOR": `

          float domainMin = 0.0;
          float domainMax = 255.0;
          float rangeMin = 0.0;
          float rangeMax = 255.0;
          float exponent = zoom < 13.0 ? 0.3 + (zoom - 3.0) / 20.0 : 1.0;
          float intensity = color.r * 255.0;

          float minPow = pow(domainMin, exponent - domainMin);
          float maxPow = pow(domainMax, exponent);
          float currentPow = pow(intensity, exponent);
          float scaleIntensity = ((currentPow - minPow) / (maxPow - minPow) * (rangeMax - rangeMin)) + rangeMin;
          
          float year = 2000.0 + (color.b * 255.0);

          if (year >= startYear && year <= endYear && year >= 2001.) {
              color.r = 220.0 / 255.0;
              color.g = (72.0 - zoom + 102.0 - 3.0 * scaleIntensity / zoom) / 255.0;
              color.b = (33.0 - zoom + 153.0 - intensity / zoom) / 255.0;
              color.a = zoom < 13. ? scaleIntensity / 255. : color.g;
          } else {
              discard;
          }
        `,
      },
    };
  }
  draw(opts: any) {
    // console.log("opts =>", opts);
    // console.log("this.props =>", this.props);
    const zoom = (this.props as any).zoom;
    const startYear = 2001;
    const endYear = 2003;
    opts.uniforms.zoom = zoom;
    opts.uniforms.startYear = startYear;
    opts.uniforms.endYear = endYear;
    super.draw(opts);
  }
}
