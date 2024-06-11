import { v4 as uuidv4 } from "uuid";
import { PresetData } from "./typing";

export const imageData: PresetData = {
  title: "图片",
  components: [
    {
      id: uuidv4(),
      type: "img",
      props: {
        src: "https://img.zcool.cn/community/01c2e3579f740d0000018c1bd7a16f.png@1280w_1l_2o_100sh.png",
      },
    },
  ],
};
