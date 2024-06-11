import { textData } from "./text";
import { imageData } from "./image";
import { PresetData } from "./typing";

export const presetData: { [key: string]: PresetData } = {
  text: textData,
  // img: imageData,
};

export * from "./map";
