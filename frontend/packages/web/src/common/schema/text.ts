import { v4 as uuidv4 } from "uuid";
import { PresetData } from "./typing";
import { textStyle } from "./style";

export const textData: PresetData = {
  title: "文本",
  components: [
    {
      id: uuidv4(),
      type: "h2",
      props: {
        style: {
          ...textStyle,
          fontWeight: "bold",
          fontSize: 30,
        },
        children: "主标题",
      },
    },
    {
      id: uuidv4(),
      type: "h3",
      props: {
        style: {
          ...textStyle,
          fontWeight: "bold",

          fontFamily: "KaiTi, STKaiti",
          fontSize: 20,
        },
        children: "楷体副标题",
      },
    },
    {
      id: uuidv4(),
      type: "p",
      props: {
        style: {
          ...textStyle,
        },
        children: "正文内容",
      },
    },
    {
      id: uuidv4(),
      type: "p",
      props: {
        style: {
          ...textStyle,

          fontFamily: "SimSun, STSong",
        },
        children: "宋体正文内容",
      },
    },
    {
      id: uuidv4(),
      type: "p",
      props: {
        style: {
          ...textStyle,

          fontFamily: "Arial, sans-serif",
        },
        children: "Arial Style",
      },
    },
    {
      id: uuidv4(),
      type: "p",
      props: {
        style: {
          ...textStyle,

          fontFamily: "Courier New",
        },
        children: "Courier New",
      },
    },
    {
      id: uuidv4(),
      type: "p",
      props: {
        style: {
          ...textStyle,

          fontFamily: "Times New Roman",
        },
        children: "Times New Roman",
      },
    },
    {
      id: uuidv4(),
      type: "p",
      props: {
        style: {
          ...textStyle,
          color: "#1890ff",
          textDecoration: "underline",
        },
        children: "链接内容",
      },
    },
    {
      id: uuidv4(),
      type: "button",
      props: {
        style: {
          ...textStyle,
          color: "#fff",
          backgroundColor: "#1890ff",
          borderRadius: "4px",
          padding: "8px",
          border: "none",
          width: 80,
        },
        children: "按钮内容",
      },
    },
  ],
};
