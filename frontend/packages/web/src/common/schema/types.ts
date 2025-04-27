import React, { CSSProperties } from "react";
import { ComponentData } from "../../routes/editor/editor.types";

export interface ComponentProps {
  [key: string]: any;
  style?: CSSProperties;
  children?: React.ReactNode;
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

export interface PropsToForm {
  [key: string]: PropToForm;
}

export type CSSPropsToForm = {
  [P in keyof CSSProperties]?: PropToForm;
};
