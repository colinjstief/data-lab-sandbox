import { useControl } from "react-map-gl";
import { MapboxOverlay } from "@deck.gl/mapbox";
import { DeckProps } from "@deck.gl/core";

const DeckGLOverlay = (props: DeckProps) => {
  const overlay = useControl<MapboxOverlay>(
    () => new MapboxOverlay({ ...props, interleaved: true })
  );
  overlay.setProps(props);
  return null;
};

export default DeckGLOverlay;
