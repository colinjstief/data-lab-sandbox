import { Datasets } from "@/lib/types";

export const datasets: Datasets = {
  tcl: {
    dataset: "tcl",
    name: "Tree cover loss",
    icon: "tree",
    coverage: "Global",
  },
  viirs: {
    dataset: "viirs",
    name: "VIIRS fire alerts",
    icon: "fire",
    coverage: "Global",
  },
  integrated: {
    dataset: "integrated",
    name: "Integrated alerts",
    icon: "chess board",
    coverage: "Tropics",
  },
  radd: {
    dataset: "radd",
    name: "RADD alerts",
    icon: "bullhorn",
    coverage: "Humid tropics",
  },
  "glad-s2": {
    dataset: "glad-s2",
    name: "GLAD-S2 alerts",
    icon: "exclamation triangle",
    coverage: "Amazon",
  },
  "glad-l": {
    dataset: "glad-l",
    name: "GLAD-L",
    icon: "bell",
    coverage: "Tropics",
  },
};
