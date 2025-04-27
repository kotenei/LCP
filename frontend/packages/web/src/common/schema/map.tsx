import { InputNumber, Select, Slider, Radio, ColorPicker } from "antd";
import TextArea from "antd/es/input/TextArea";
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  FileImageOutlined,
} from "@ant-design/icons";

import { ShadowPicker } from "../../components/shadow-picker";
import { IconButton } from "../../components/icon-button";
import { Upload } from "../../components/upload";
import { CSSPropsToForm, PropsToForm } from "./types";

export const mapPropsCategory = [
  { id: "1", label: "基本属性" },
  { id: "2", label: "尺寸" },
  {
    id: "3",
    label: "边框",
  },
  {
    id: "4",
    label: "阴影与透明度",
  },
  {
    id: "5",
    label: "位置",
  },
  // {
  //   id: "6",
  //   label: "事件",
  // },
];

export const customPropsToForm: PropsToForm = {
  children: {
    label: "文本",
    component: TextArea,
    extraProps: { rows: 3 },
    category: "1",
    afterTransform: (e) => e.target.value,
  },
  src: {
    component: Upload,
    category: "1",
  },
};

export const mapPropsToForm: CSSPropsToForm = {
  // 基本属性
  fontSize: {
    label: "字号",
    component: InputNumber,
    category: "1",
    extraProps: { min: 0, max: 100 },
  },
  fontFamily: {
    label: "字体",
    component: Select,
    subComponent: Select.Option,
    category: "1",
    options: [
      { text: "无", value: "" },
      { text: "宋体", value: "SimSun, STSong" },
      { text: "黑体", value: "SimHei, STHeiti" },
      { text: "楷体", value: "KaiTi, STKaiti" },
      { text: "仿宋", value: "FangSong, STFangsong" },
      { text: "Arial", value: "Arial, sans-serif" },
      { text: "Arial Black", value: '"Arial Black", sans-serif' },
      { text: "Comic Sans MS", value: "Comic Sans MS" },
      { text: "Courier New", value: '"Courier New", monospace' },
      { text: "Georgia, serif", value: "Georgia, serif" },
      { text: "Times New Roman", value: '"Times New Roman", serif' },
    ],
  },
  fontWeight: {
    component: IconButton,
    category: "1",
    extraProps: { icon: <BoldOutlined />, tooltip: true, tooltipTitle: "加粗" },
    initalTransform: (value) => {
      return value && value !== "normal";
    },
    afterTransform: (value) => {
      return value ? "bold" : "normal";
    },
  },
  fontStyle: {
    component: IconButton,
    category: "1",
    extraProps: {
      icon: <ItalicOutlined />,
      tooltip: true,
      tooltipTitle: "斜体",
    },
    initalTransform: (value) => {
      return value && value !== "normal";
    },
    afterTransform: (value) => {
      return value ? "italic" : "normal";
    },
  },
  textDecoration: {
    component: IconButton,
    category: "1",
    extraProps: {
      icon: <UnderlineOutlined />,
      tooltip: true,
      tooltipTitle: "下划线",
    },
    initalTransform: (value) => {
      return value && value !== "none";
    },
    afterTransform: (value) => {
      return value ? "underline" : "none";
    },
  },
  lineHeight: {
    label: "行高",
    component: Slider,
    category: "1",
    extraProps: { min: 0, max: 3, step: 0.1 },
  },
  textAlign: {
    label: "对齐",
    component: Radio.Group,
    subComponent: Radio.Button,
    category: "1",
    options: [
      { text: "左", value: "left" },
      { text: "中", value: "center" },
      { text: "右", value: "right" },
    ],
  },
  color: {
    label: "文字颜色",
    component: ColorPicker,
    category: "1",
    extraProps: { allowClear: true },
    afterTransform: (color, value) => {
      return value;
      //return color.cleared ? "transparent" : value;
    },
  },
  backgroundColor: {
    label: "背景颜色",
    component: ColorPicker,
    category: "1",
    extraProps: { allowClear: true },
    afterTransform: (color, value) => {
      return value;
    },
  },
  backgroundImage: {
    // label: "背景图片",
    component: Upload,
    category: "1",
    extraProps: {
      dragger: true,
      remove: true,
      draggerContent: (
        <>
          <FileImageOutlined style={{ fontSize: 32 }} />
          上传背景图片
        </>
      ),
    },
  },
  backgroundRepeat: {
    label: "背景重复",
    component: Select,
    subComponent: Select.Option,
    category: "1",
    options: [
      { text: "无重复", value: "no-repeat" },
      { text: "X轴重复", value: "repeat-x" },
      { text: "Y轴重复", value: "repeat-y" },
      { text: "全部重复", value: "repeat" },
    ],
  },
  backgroundSize: {
    label: "背景大小",
    component: Select,
    subComponent: Select.Option,
    category: "1",
    options: [
      { text: "默认", value: "" },
      { text: "自动缩放", value: "contain" },
      { text: "自动填充", value: "cover" },
    ],
  },
  // 尺寸
  height: {
    label: "高度",
    component: InputNumber,
    category: "2",
    extraProps: { min: 0 },
    afterTransform: (value) => {
      if (value <= 0) {
        return "";
      }
      return value;
    },
  },
  width: {
    label: "宽度",
    component: InputNumber,
    category: "2",
    extraProps: { min: 0 },
    afterTransform: (value) => {
      if (value <= 0) {
        return "";
      }
      return value;
    },
  },
  paddingLeft: {
    label: "左边距",
    component: InputNumber,
    category: "2",
    extraProps: { min: 0, max: 100 },
  },
  paddingRight: {
    label: "右边距",
    component: InputNumber,
    category: "2",
    extraProps: { min: 0, max: 100 },
  },
  paddingTop: {
    label: "上边距",
    component: InputNumber,
    category: "2",
    extraProps: { min: 0, max: 100 },
  },
  paddingBottom: {
    label: "下边距",
    component: InputNumber,
    category: "2",
    extraProps: { min: 0, max: 100 },
  },

  // 边框
  borderStyle: {
    label: "边框类型",
    component: Select,
    subComponent: Select.Option,
    category: "3",
    options: [
      { text: "无", value: "none" },
      { text: "实线", value: "solid" },
      { text: "破折线", value: "dashed" },
      { text: "点状线", value: "dotted" },
    ],
  },
  borderColor: {
    label: "边框颜色",
    component: ColorPicker,
    category: "3",
    extraProps: { allowClear: true },
    afterTransform: (color, value) => {
      return value;
    },
  },
  borderWidth: {
    label: "边框宽度",
    component: Slider,
    category: "3",
    extraProps: { min: 0, max: 20 },
  },
  borderRadius: {
    label: "边框圆角",
    component: Slider,
    category: "3",
    extraProps: { min: 0, max: 200 },
  },

  // 阴影与透明度
  opacity: {
    label: "透明度",
    component: Slider,
    category: "4",
    extraProps: { min: 0, max: 100, reverse: true },
    initalTransform: (value) => {
      return value * 100;
    },
    afterTransform: (value) => {
      return value / 100;
    },
  },
  boxShadow: {
    component: ShadowPicker,
    category: "4",
  },

  // 位置
  left: {
    label: "X轴坐标",
    component: InputNumber,
    category: "5",
    extraProps: { min: 0 },
  },
  top: {
    label: "Y轴坐标",
    component: InputNumber,
    category: "5",
    extraProps: { min: 0 },
  },
};
