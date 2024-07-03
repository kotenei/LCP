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
        children: "主标题",
        style: {
          ...textStyle,
          fontWeight: "bold",
          fontSize: 30,
        },
      },
    },
    {
      id: uuidv4(),
      type: "h3",
      props: {
        children: "楷体副标题",
        style: {
          ...textStyle,
          fontWeight: "bold",
          fontFamily: "KaiTi, STKaiti",
          fontSize: 20,
        },
      },
    },
    {
      id: uuidv4(),
      type: "p",
      props: {
        children: "正文内容",
        style: {
          ...textStyle,
        },
      },
    },
    {
      id: uuidv4(),
      type: "p",
      props: {
        children: "宋体正文内容",
        style: {
          ...textStyle,

          fontFamily: "SimSun, STSong",
        },
      },
    },
    {
      id: uuidv4(),
      type: "p",
      props: {
        children: "Arial Style",
        style: {
          ...textStyle,

          fontFamily: "Arial, sans-serif",
        },
      },
    },
    {
      id: uuidv4(),
      type: "p",
      props: {
        children: "Courier New",
        style: {
          ...textStyle,

          fontFamily: "Courier New",
        },
      },
    },
    {
      id: uuidv4(),
      type: "p",
      props: {
        children: "Times New Roman",
        style: {
          ...textStyle,
          fontFamily: "Times New Roman",
        },
      },
    },
    {
      id: uuidv4(),
      type: "p",
      props: {
        children: "链接内容",
        style: {
          ...textStyle,
          color: "#1890ff",
          textDecoration: "underline",
        },
      },
    },
    {
      id: uuidv4(),
      type: "button",
      props: {
        children: "按钮内容",
        style: {
          ...textStyle,
          color: "#fff",
          backgroundColor: "#1890ff",
          borderRadius: "4px",
          padding: "8px",
          border: "none",
          width: 80,
          cursor: "pointer",
        },
      },
    },
  ],
};
