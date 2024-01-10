import { Datasets } from "@/lib/types";

export const datasets: Datasets = {
  tcl: {
    dataset: "tcl",
    name: "Tree cover loss",
    icon: "tree",
    coverage: "Global",
    versions: ["v2012", "v2013"],
  },
  viirs: {
    dataset: "viirs",
    name: "VIIRS fire alerts",
    icon: "fire",
    coverage: "Global",
    versions: [],
  },
  integrated: {
    dataset: "integrated",
    name: "Integrated alerts",
    icon: "chess board",
    coverage: "Tropics",
    versions: [],
  },
  radd: {
    dataset: "radd",
    name: "RADD alerts",
    icon: "bullhorn",
    coverage: "Humid tropics",
    versions: [],
  },
  "glad-s2": {
    dataset: "glad-s2",
    name: "GLAD-S2 alerts",
    icon: "exclamation triangle",
    coverage: "Amazon",
    versions: [],
  },
  "glad-l": {
    dataset: "glad-l",
    name: "GLAD-L",
    icon: "bell",
    coverage: "Tropics",
    versions: [],
  },
};
