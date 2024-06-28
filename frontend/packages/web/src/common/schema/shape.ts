import { v4 as uuidv4 } from "uuid";
import { PresetData } from "./typing";
import { commonStyle } from "./style";

const COLOR = "#40A9FF";
const DEFAULT_STYLE = {
  ...commonStyle,
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: COLOR,
  backgroundColor: COLOR,
};

export const shapeData: PresetData = {
  title: "形状",
  components: [
    {
      id: uuidv4(),
      type: "div",
      props: {
        style: {
          ...DEFAULT_STYLE,
          width: 100,
          height: 50,
        },
      },
    },
    {
      id: uuidv4(),
      type: "div",
      props: {
        style: {
          ...DEFAULT_STYLE,
          width: 100,
          height: 100,
          borderRadius: 100,
        },
      },
    },
    {
      id: uuidv4(),
      type: "div",
      props: {
        style: {
          ...DEFAULT_STYLE,
          width: 100,
          height: 100,
        },
      },
    },
  ],
};
