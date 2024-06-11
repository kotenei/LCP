import React, { CSSProperties } from "react";

export interface ComponentProps {
  [key: string]: any;
  style?: CSSProperties;
  children?: React.ReactNode;
}

export interface ComponentData {
  id: string;
  type: string;
  props?: ComponentProps;
}

export interface TemplateData {
  id: number;
  title: string;
  coverImg: string;
  author: string;
  copiedCount: number;
  components?: ComponentData[];
}

export interface PresetData {
  title: string;
  components: ComponentData[];
}

export interface PropToForm {
  label?: string;
  component: any;
  subComponent?: any;
  category: string;
  extraProps?: { [key: string]: any };
  options?: { text: string; value: string }[];
  initalTransform?: (v: any) => any;
  afterTransform?: (...args: any) => any;
}

export type PropsToForm = {
  [P in keyof CSSProperties]?: PropToForm;
};
