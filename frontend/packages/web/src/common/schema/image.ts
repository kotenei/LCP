import { v4 as uuidv4 } from "uuid";
import { PresetData } from "./types";
import { commonStyle } from "./style";

const DEFAULT_STYLE = {
  ...commonStyle,
  left: 0,
  top: 0,
  width: 100,
  height: "",
};

export const imageData: PresetData = {
  title: "图片",
  components: [
    {
      id: uuidv4(),
      type: "img",
      props: {
        src: "/images/frame1.png",
        style: {
          ...DEFAULT_STYLE,
        },
      },
    },
    {
      id: uuidv4(),
      type: "img",
      props: {
        src: "/images/frame2.png",
        style: {
          ...DEFAULT_STYLE,
        },
      },
    },
    {
      id: uuidv4(),
      type: "img",
      props: {
        src: "/images/money.png",
        style: {
          ...DEFAULT_STYLE,
        },
      },
    },
    {
      id: uuidv4(),
      type: "img",
      props: {
        src: "/images/bag.png",
        style: {
          ...DEFAULT_STYLE,
        },
      },
    },
  ],
};
