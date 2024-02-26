export const selectRangeField = ({ dataset, asset }) => {
  switch (asset) {
    case "nasa_viirs_fire_alerts":
    case "gadm__viirs__adm2_daily_alerts":
    case "wdpa_protected_areas__viirs__daily_alerts":
    case "geostore__viirs__daily_alerts":
      return "alert__date";
      break;

    case "gadm__integrated_alerts__iso_daily_alerts":
    case "gadm__integrated_alerts__adm1_daily_alerts":
    case "gadm__integrated_alerts__adm1_daily_alerts":
    case "wdpa_protected_areas__integrated_alerts__daily_alerts":
    case "geostore__integrated_alerts__daily_alerts":
    case "gfw_integrated_alerts":
    case "wur_radd_alerts":
    case "umd_glad_sentinel2_alerts":
      switch (dataset) {
        case "radd":
          return "wur_radd_alerts__date";
          break;
        case "glad-s2":
          return "umd_glad_sentinel2_alerts__date";
          break;
        default:
          return "gfw_integrated_alerts__date";
          break;
      }
      break;

    case "gadm__tcl__iso_change":
    case "gadm__tcl__adm1_change":
    case "gadm__tcl__adm2_change":
    case "wdpa_protected_areas__tcl__change":
    case "geostore__tcl__change":
      return "umd_tree_cover_loss__year";
      break;

    default:
      return "umd_glad_landsat_alerts__date";
      break;
  }
};
