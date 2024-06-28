import { textData } from "./text";
import { imageData } from "./image";
import { shapeData } from "./shape";
import { PresetData } from "./typing";

export const presetData: { [key: string]: PresetData } = {
  text: textData,
  img: imageData,
  shape: shapeData,
};

export * from "./map";
