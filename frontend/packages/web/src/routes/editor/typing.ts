import { CSSProperties } from "react";
import { PropToForm } from "../../common/schema/typing";

export interface ComponentProps {
  [key: string]: any;
  style?: { [key: string]: any };
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

export interface FormProps extends PropToForm {
  key: any;
  value?: any;
  eventName?: string;
  onChange?: (eventName: string, val: any) => void;
}
