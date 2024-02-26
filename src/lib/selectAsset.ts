import { WizardQuery } from "@/lib/types";

export const selectAsset = ({
  area,
  dataset,
  range,
  timeSegment,
  areaSegment,
}: WizardQuery): string => {
  let asset = "";

  switch (dataset) {
    case "tcl":
      switch (area.type) {
        case "gadm_global":
          switch (timeSegment) {
            case "year":
              asset = "gadm__tcl__iso_change";
              break;
            default:
              asset = !!range.length
                ? "gadm__tcl__iso_change"
                : "gadm__tcl__iso_summary";
              break;
          }
          break;
        case "gadm_iso":
          switch (timeSegment) {
            case "year":
              switch (areaSegment) {
                case "adm1":
                  asset = "gadm__tcl__adm1_change";
                  break;
                case "adm2":
                  asset = "gadm__tcl__adm2_change";
                  break;
                default:
                  asset = "gadm__tcl__iso_change";
                  break;
              }
              break;
            default:
              switch (areaSegment) {
                case "adm1":
                  asset = !!range.length
                    ? "gadm__tcl__adm1_change"
                    : "gadm__tcl__adm1_summary";
                  break;
                case "adm2":
                  asset = !!range.length
                    ? "gadm__tcl__adm2_change"
                    : "gadm__tcl__adm2_summary";
                  break;
                default:
                  asset = !!range.length
                    ? "gadm__tcl__iso_change"
                    : "gadm__tcl__iso_summary";
                  break;
              }
              break;
          }
          break;
        case "gadm_adm1":
          switch (timeSegment) {
            case "year":
              switch (areaSegment) {
                case "adm2":
                  asset = "gadm__tcl__adm2_change";
                  break;
                default:
                  asset = "gadm__tcl__adm1_change";
                  break;
              }
              break;
            default:
              switch (areaSegment) {
                case "adm2":
                  asset = !!range.length
                    ? "gadm__tcl__adm2_change"
                    : "gadm__tcl__adm2_summary";
                  break;
                default:
                  asset = !!range.length
                    ? "gadm__tcl__adm1_change"
                    : "gadm__tcl__adm1_summary";
                  break;
              }
              break;
          }
          break;
        case "gadm_adm2":
          switch (timeSegment) {
            case "year":
              asset = "gadm__tcl__adm2_change";
              break;
            default:
              asset = !!range.length
                ? "gadm__tcl__adm2_change"
                : "gadm__tcl__adm2_summary";
              break;
          }
          break;
        case "wdpa":
          switch (timeSegment) {
            case "year":
              asset = "wdpa_protected_areas__tcl__change";
              break;
            default:
              asset = !!range.length
                ? "wdpa_protected_areas__tcl__change"
                : "wdpa_protected_areas__tcl__summary";
              break;
          }
          break;
        case "custom_saved":
          switch (timeSegment) {
            case "year":
              asset = "geostore__tcl__change";
              break;
            default:
              asset = !!range.length
                ? "geostore__tcl__change"
                : "geostore__tcl__summary";
              break;
          }
          break;
        case "custom_pending":
          asset = "umd_tree_cover_loss";
          break;
      }
      break;

    case "viirs":
      switch (area.type) {
        case "gadm_global":
          asset = "gadm__viirs__iso_weekly_alerts";
          break;
        case "gadm_iso":
          switch (areaSegment) {
            case "adm1":
              asset = "gadm__viirs__adm1_weekly_alerts";
              break;
            case "adm2":
              asset = "gadm__viirs__adm2_weekly_alerts";
              break;
            default:
              asset = "gadm__viirs__iso_weekly_alerts";
              break;
          }
          break;
        case "gadm_adm1":
          switch (timeSegment) {
            case "day":
              switch (areaSegment) {
                case "adm2":
                  asset = "gadm__viirs__adm2_daily_alerts";
                  break;
                default:
                  asset = "gadm__viirs__adm1_daily_alerts";
                  break;
              }
              break;
            default:
              switch (areaSegment) {
                case "adm2":
                  asset = "gadm__viirs__adm2_weekly_alerts";
                  break;
                default:
                  asset = "gadm__viirs__adm1_weekly_alerts";
                  break;
              }
              break;
          }
          break;
        case "gadm_adm2":
          switch (timeSegment) {
            case "day":
              asset = "gadm__viirs__adm2_daily_alerts";
              break;
            default:
              asset = "gadm__viirs__adm2_weekly_alerts";
              break;
          }
          break;
        case "wdpa":
          switch (timeSegment) {
            case "day":
              asset = "wdpa_protected_areas__viirs__daily_alerts";
              break;
            default:
              asset = "wdpa_protected_areas__viirs__weekly_alerts";
              break;
          }
          break;
        case "custom_saved":
          switch (timeSegment) {
            case "day":
              asset = "geostore__viirs__daily_alerts";
              break;
            default:
              asset = "geostore__viirs__weekly_alerts";
              break;
          }
          break;
        case "custom_pending":
          asset = "nasa_viirs_fire_alerts";
          break;
      }
      break;

    case "integrated":
    case "radd":
    case "glad-s2":
      switch (area.type) {
        case "gadm_global":
          asset = "gadm__integrated_alerts__iso_daily_alerts";
          break;
        case "gadm_iso":
          switch (areaSegment) {
            case "adm1":
              asset = "gadm__integrated_alerts__adm1_daily_alerts";
              break;
            case "adm2":
              asset = "gadm__integrated_alerts__adm2_daily_alerts";
              break;
            default:
              asset = "gadm__integrated_alerts__iso_daily_alerts";
              break;
          }
          break;
        case "gadm_adm1":
          switch (areaSegment) {
            case "adm2":
              asset = "gadm__integrated_alerts__adm2_daily_alerts";
              break;
            default:
              asset = "gadm__integrated_alerts__adm1_daily_alerts";
              break;
          }
          break;
        case "gadm_adm2":
          asset = "gadm__integrated_alerts__adm2_daily_alerts";
          break;
        case "wdpa":
          asset = "wdpa_protected_areas__integrated_alerts__daily_alerts";
          break;
        case "custom_saved":
          asset = "geostore__integrated_alerts__daily_alerts";
          break;
        case "custom_pending":
          switch (dataset) {
            case "integrated":
              asset = "gfw_integrated_alerts";
              break;
            case "radd":
              asset = "wur_radd_alerts";
              break;
            case "glad-s2":
              asset = "umd_glad_sentinel2_alerts";
              break;
          }
          break;
      }
      break;

    case "glad-l":
      switch (area.type) {
        case "gadm_global":
          switch (timeSegment) {
            case "day":
              asset = "gadm__glad__iso_daily_alerts";
              break;
            case "week":
              asset = "gadm__glad__iso_weekly_alerts";
              break;
            default:
              asset = "gadm__glad__iso_summary ";
              break;
          }
          break;
        case "gadm_iso":
          switch (timeSegment) {
            case "day":
              switch (areaSegment) {
                case "adm1":
                  asset = "gadm__glad__adm1_daily_alerts";
                  break;
                case "adm2":
                  asset = "gadm__glad__adm2_daily_alerts";
                  break;
                default:
                  asset = "gadm__glad__iso_daily_alerts";
                  break;
              }
              break;
            case "week":
              switch (areaSegment) {
                case "adm1":
                  asset = "gadm__glad__adm1_weekly_alerts";
                  break;
                case "adm2":
                  asset = "gadm__glad__adm2_weekly_alerts";
                  break;
                default:
                  asset = "gadm__glad__iso_weekly_alerts";
                  break;
              }
              break;
            default:
              switch (areaSegment) {
                case "adm1":
                  asset = "gadm__viirs__adm1_weekly_alerts";
                  break;
                case "adm2":
                  asset = "gadm__viirs__adm2_weekly_alerts";
                  break;
                default:
                  asset = "gadm__viirs__iso_weekly_alerts";
                  break;
              }
              break;
          }
          break;
        case "gadm_adm1":
          switch (timeSegment) {
            case "day":
              switch (areaSegment) {
                case "adm2":
                  asset = "gadm__glad__adm2_daily_alerts";
                  break;
                default:
                  asset = "gadm__glad__adm1_daily_alerts";
                  break;
              }
              break;
            case "week":
              switch (areaSegment) {
                case "adm2":
                  asset = "gadm__glad__adm2_weekly_alerts";
                  break;
                default:
                  asset = "gadm__glad__adm1_weekly_alerts";
                  break;
              }
              break;
            default:
              asset = "gadm__glad__adm1_summary";
              break;
          }
          break;
        case "gadm_adm2":
          switch (timeSegment) {
            case "day":
              asset = "gadm__glad__adm2_daily_alerts";
              break;
            case "week":
              asset = "gadm__glad__adm2_weekly_alerts";
              break;
            default:
              asset = "gadm__glad__adm2_summary";
              break;
          }
          break;
        case "wdpa":
          switch (timeSegment) {
            case "day":
              asset = "wdpa_protected_areas__glad__daily_alerts";
              break;
            case "week":
              asset = "wdpa_protected_areas__glad__weekly_alerts";
              break;
            default:
              asset = "wdpa_protected_areas__glad__summary";
              break;
          }
          break;
        case "custom_saved":
          switch (timeSegment) {
            case "day":
              asset = "geostore__glad__daily_alerts";
              break;
            case "week":
              asset = "geostore__glad__weekly_alerts";
              break;
            default:
              asset = "geostore__glad__summary";
              break;
          }
          break;
        case "custom_pending":
          asset = "umd_glad_landsat_alerts";
          break;
      }
      break;
  }

  return asset;
};
