import { z } from "zod";

const tools = {
  queryISO: {
    description: "Get geospatial statistics for a specific country",
    parameters: z.object({
      iso: z.string().describe("3 digit ISO code for a country")
      startYear: z.string().,
      endYear: 
    }),
    generate: () => {},
  },
};


////////////////////////////////////////
/// Suggestions    //  Stats         ///
/// -------------- // -------------- ///
/// Chat           //  Map           ///
////////////////////////////////////////