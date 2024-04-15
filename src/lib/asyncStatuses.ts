import { SemanticCOLORS, SemanticICONS } from "semantic-ui-react";

export const asyncStatuses = {
  loading: {
    iconName: "circle notched" as SemanticICONS,
    color: "blue" as SemanticCOLORS,
    loading: true,
  },
  success: {
    iconName: "check" as SemanticICONS,
    color: "green" as SemanticCOLORS,
    loading: false,
  },
  error: {
    iconName: "times circle" as SemanticICONS,
    color: "red" as SemanticCOLORS,
    loading: false,
  },
  default: {
    iconName: "pause" as SemanticICONS,
    color: "blue" as SemanticCOLORS,
    loading: false,
  },
};
