"use client";

import { Map } from "react-map-gl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MB_KEY } from "@/lib/keys";
import ReactSlider from "react-slider";

import DeckGLOverlay from "@/app/(components)/(map)/DeckGLOverlay";
import { createDecodedLayer } from "@/lib/createDecodedLayer";

interface RasterLayerProps {}

const tcdOptions = [
  { key: 10, value: 10, text: 10 },
  { key: 15, value: 15, text: 15 },
  { key: 20, value: 20, text: 20 },
  { key: 25, value: 25, text: 25 },
  { key: 30, value: 30, text: 30 },
  { key: 50, value: 50, text: 50 },
  { key: 75, value: 75, text: 75 },
];

const RasterLayer = ({}: RasterLayerProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentParams = new URLSearchParams(Array.from(searchParams.entries()));

  const longitude = currentParams.get("longitude")
    ? Number(currentParams.get("longitude"))
    : -100;
  const latitude = currentParams.get("latitude")
    ? Number(currentParams.get("latitude"))
    : 40;
  const zoom = currentParams.get("zoom")
    ? Number(currentParams.get("zoom"))
    : 3.5;

  const tcd = currentParams.get("tcd") ? Number(currentParams.get("tcd")) : 30;
  const startYear = currentParams.get("startYear")
    ? Number(currentParams.get("startYear"))
    : 2001;
  const endYear = currentParams.get("endYear")
    ? Number(currentParams.get("endYear"))
    : 2023;

  const updateQueryParams = ({
    params,
    currentParams,
  }: {
    params: { name: string; value: string }[];
    currentParams: URLSearchParams;
  }) => {
    params.forEach((param) => {
      currentParams.set(param.name, param.value);
    });

    const search = currentParams.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`);
  };

  const umd_tree_cover_loss = createDecodedLayer({
    id: "umd_tree_cover_loss",
    data: `https://tiles.globalforestwatch.org/umd_tree_cover_loss/v1.11/tcd_${tcd}/{z}/{x}/{y}.png`,
    maxZoom: 12,
    minZoom: 0,
    zoom: zoom,
    zoomOffset: 1,
    uniformVariables: [
      { name: "zoom", type: "float", value: zoom },
      { name: "startYear", type: "float", value: startYear },
      { name: "endYear", type: "float", value: endYear },
    ],
    shaderInjections: {
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
            color.a = scaleIntensity / 255.;
            color.r = 220.0 / 255.0;
            color.g = (72.0 - zoom + 102.0 - 3.0 * scaleIntensity / zoom) / 255.0;
            color.b = (33.0 - zoom + 153.0 - intensity / zoom) / 255.0;  
        } else {
            discard;
        }
    `,
    },
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-10 h-[calc(100vh-50px)] sm:h-[calc(100vh-90px)]">
      <div className="h-[300px] sm:col-span-2 sm:h-auto overflow-auto p-5">
        <h3 className="font-bold">Layer controls</h3>
        <div className="py-4">
          <h4 className="pb-2">Tree cover density</h4>
          <div className="flex flex-wrap">
            {tcdOptions.map((option) => {
              return (
                <button
                  key={option.key}
                  className={`py-2 px-3 border-[1px] ${
                    tcd === option.value ? "border-blue-500" : "border-gray-200"
                  }`}
                  onClick={(e) => {
                    const newTCD = (e.target as HTMLInputElement)
                      .textContent as string;

                    updateQueryParams({
                      params: [{ name: "tcd", value: newTCD.toString() }],
                      currentParams,
                    });
                  }}
                >
                  {option.text}
                </button>
              );
            })}
          </div>
        </div>
        <div className="py-4">
          <h4 className="pb-4">Range</h4>
          <div className="flex flex-col gap-4">
            <ReactSlider
              min={2001}
              max={2023}
              className="w-full h-3 bg-gray-200 rounded-full"
              thumbClassName="rounded-full p-3 bg-slate-400 cursor-grab top-[-6px]"
              renderTrack={(props, state) => {
                const { key } = props;
                delete props.key;
                if (key === "track-1") {
                  const newProps = {
                    ...props,
                    className: "h-full bg-pink-400 rounded-full",
                  };
                  return <span key={key} {...newProps}></span>;
                } else {
                  return <span key={key} {...props}></span>;
                }
              }}
              defaultValue={[startYear, endYear]}
              onChange={(value, index) => {
                const [startYear, endYear] = value;
                updateQueryParams({
                  params: [
                    { name: "startYear", value: startYear.toString() },
                    { name: "endYear", value: endYear.toString() },
                  ],
                  currentParams,
                });
              }}
            />
            <p className="">{`${startYear} to ${endYear}`}</p>
          </div>
        </div>
      </div>
      <div className="sm:col-span-8 h-[calc(100vh-360px)] sm:h-auto relative">
        <Map
          initialViewState={{
            longitude: longitude,
            latitude: latitude,
            zoom: zoom,
          }}
          onMove={(e) => {
            const { longitude, latitude, zoom } = e.viewState;
            updateQueryParams({
              params: [
                { name: "longitude", value: longitude.toString() },
                { name: "latitude", value: latitude.toString() },
                { name: "zoom", value: zoom.toString() },
              ],
              currentParams,
            });
          }}
          mapStyle="mapbox://styles/mapbox/light-v9"
          mapboxAccessToken={MB_KEY}
          minZoom={2}
        >
          <DeckGLOverlay layers={[umd_tree_cover_loss]} />
        </Map>
      </div>
    </div>
  );
};

export default RasterLayer;
