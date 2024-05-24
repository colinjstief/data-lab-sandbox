"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

import { RWAPIArea } from "@/lib/types";
import { getStaticImageURL } from "@/lib/apis/mapbox";

const MapImage = ({ userArea }: { userArea: RWAPIArea }) => {
  const [imageURL, setImageURL] = useState<string>("");

  useEffect(() => {
    const startGetUserAreas = async () => {
      const geojson = userArea.geostore.attributes.geojson.features[0];
      const geojsonString = JSON.stringify(geojson);
      const res = await getStaticImageURL({ geojson: geojsonString });
      const url = res.data as string;

      if (url) {
        setImageURL(url);
      }
    };
    //startGetUserAreas();
  }, []);

  console.log(imageURL);

  return <div className="h-[100px] w-[100px] bg-slate-200"></div>;
};

export default MapImage;
