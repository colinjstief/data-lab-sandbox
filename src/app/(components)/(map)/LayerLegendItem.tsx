import Cross from "@/../public/icon-cross.svg";
import Info from "@/../public/icon-info.svg";
import Opacity from "@/../public/icon-opacity.svg";
import Play from "@/../public/icon-play.svg";
import svgFilters from "@/lib/constants/svgFilters";

const densityOptions = [
  { key: 10, value: 10, text: "10%" },
  { key: 20, value: 20, text: "20%" },
  { key: 30, value: 30, text: "30%" },
];

const heightOptions = [
  { key: 3, value: 3, text: "3m" },
  { key: 4, value: 4, text: "4m" },
  { key: 5, value: 5, text: "5m" },
];

interface LayerLegendItemProps {}

const LayerLegendItem = ({}: LayerLegendItemProps) => {
  return (
    <div className="flex flex-col gap-5 border py-3 pr-3 pl-10 relative">
      <div className="absolute left-[10px] flex gap-1 cursor-move">
        <div className="flex flex-col gap-1">
          <span className="bg-slate-400 w-[4px] h-[4px] block rounded-sm"></span>
          <span className="bg-slate-400 w-[4px] h-[4px] block rounded-sm"></span>
          <span className="bg-slate-400 w-[4px] h-[4px] block rounded-sm"></span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="bg-slate-400 w-[4px] h-[4px] block rounded-sm"></span>
          <span className="bg-slate-400 w-[4px] h-[4px] block rounded-sm"></span>
          <span className="bg-slate-400 w-[4px] h-[4px] block rounded-sm"></span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <div className="font-medium">Tree cover</div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 border px-2 rounded-full h-[20px]">
              <Opacity
                style={{
                  width: "12px",
                  height: "auto",
                  filter: svgFilters.darkGray,
                }}
              />
              <span className="text-sm">Opacity</span>
            </div>
            <div className="flex items-center border px-2 rounded-full h-[20px]">
              <Cross
                style={{
                  width: "12px",
                  height: "auto",
                  filter: svgFilters.darkGray,
                }}
              />
            </div>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <span className="bg-[#9FBC52] w-[12px] h-[12px] block rounded-full"></span>
          <div>Tree cover</div>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <div>Total tree cover in 2016</div>
        <div className="flex gap-4 h-[30px] items-center">
          <Play
            style={{
              width: "14px",
              height: "auto",
              filter: svgFilters.darkGray,
            }}
          />
          <div className="flex flex-col w-full relative">
            <div className="w-full h-[4px]">
              <span className="w-full bg-[#9FBC52] h-[4px] block"></span>
            </div>
            <div className="absolute left-5 top-[-4px]">
              <span className="bg-slate-400 w-[12px] h-[12px] block rounded"></span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex gap-2 justify-between items-center">
          <h4 className="">Canopy density</h4>
          <div className="flex flex-wrap w-[50%]">
            {densityOptions.map((option) => {
              return (
                <button
                  key={option.key}
                  className={`py-1 px-2 border-[1px] flex-1 ${
                    10 === option.value
                      ? "border-slate-500 bg-slate-200"
                      : "border-slate-200"
                  }`}
                >
                  {option.text}
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex gap-2 justify-between items-center">
          <h4 className="">Canopy height</h4>
          <div className="flex flex-wrap w-[50%]">
            {heightOptions.map((option) => {
              return (
                <button
                  key={option.key}
                  className={`py-1 px-2 border-[1px] flex-1 ${
                    3 === option.value
                      ? "border-slate-500 bg-slate-200"
                      : "border-slate-200"
                  }`}
                >
                  {option.text}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 border px-2 rounded-full h-[35px] w-full">
        <Info
          style={{
            width: "15px",
            height: "auto",
            filter: svgFilters.darkGray,
          }}
        />
        <span className="">Learn more</span>
      </div>
    </div>
  );
};

export default LayerLegendItem;
