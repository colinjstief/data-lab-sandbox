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

  const layer = new TileLayer({
    id: "TileLayer",
    data: "https://tiles.globalforestwatch.org/umd_tree_cover_loss/v1.11/tcd_30/{z}/{x}/{y}.png",
    maxZoom: 15,
    minZoom: 0,
    longitude: mapState.longitude,
    latitude: mapState.latitude,
    zoom: mapState.zoom,

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
        `,
        "fs:DECKGL_FILTER_COLOR": `
            color.r = zoom < 5. ? 151. / 255. : 100. / 255.;
            color.g = zoom < 5. ? 189. / 255. : 200. / 255.;
            color.b = zoom < 5. ? 61. / 255. : 150. / 255.;
          `,
      },
    };
  }
  draw(opts: any) {
    // console.log("opts =>", opts);
    // console.log("this.props =>", this.props);
    const zoom = (this.props as any).zoom;
    console.log("zoom =>", zoom);
    // const colorRange: number[][] = [
    //   [235, 0, 0, 255],
    //   [0, 255, 125, 255],
    // ];
    opts.uniforms.zoom = zoom;
    // opts.uniforms.toColor = colorRange[1].map((x) => x / 255);
    super.draw(opts);
  }
}
