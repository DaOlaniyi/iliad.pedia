export const PageLCol = "#ffffff";
export const PageRCol = "#eeeeee";

export const LightCoral = "#f69185";
export const VibrantRed = "#eb4745";
export const Teal = "#8cebd3";
export const SoftRed = "#f06761";
export const DeepMaroon = "#7f1313";
export const DeepShadow = "#330303";
export const BrightRed = "#ed5d55";

export function GetPageColor(index:number) {
  return  (index % 2 == 0) ? PageLCol : PageRCol;
}