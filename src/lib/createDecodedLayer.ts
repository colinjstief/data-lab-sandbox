import { TileLayer, TileLayerProps } from "@deck.gl/geo-layers";
import { BitmapLayer } from "@deck.gl/layers";

export const createDecodedLayer = (props: DecodedLayerProps): TileLayer => {
  return new TileLayer({
    ...props,
    renderSubLayers: (subLayerProps) => {
      const { boundingBox } = subLayerProps.tile;

      return new ExtendedBitmapLayer(subLayerProps, {
        data: undefined,
        image: subLayerProps.data,
        textureParameters: {
          minFilter: "nearest",
          magFilter: "nearest",
        },
        pickable: true,
        bounds: [
          boundingBox[0][0],
          boundingBox[0][1],
          boundingBox[1][0],
          boundingBox[1][1],
        ],
        //@ts-ignore
        uniformVariables: props.uniformVariables,
        shaderInjections: props.shaderInjections,
      });
    },
  });
};

export default createDecodedLayer;

class ExtendedBitmapLayer extends BitmapLayer {
  getShaders() {
    return {
      ...super.getShaders(),
      //@ts-ignore
      inject: this.props.shaderInjections,
    };
  }
  draw(opts: any) {
    const uniforms: { [key: string]: any } = {};
    //@ts-ignore
    this.props.uniformVariables.forEach(({ name, type, value }: Uniform) => {
      if (type === "float") uniforms[name] = parseFloat(value);
    });

    opts.uniforms = { ...opts.uniforms, ...uniforms };
    super.draw(opts);
  }
}

interface Uniform {
  name: string;
  type: string;
  value: any;
}

interface DecodedLayerProps extends TileLayerProps {
  zoom: number;
  uniformVariables: Uniform[];
  shaderInjections: {};
}
