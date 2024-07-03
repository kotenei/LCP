import { PropToForm } from "../../common/schema/typing";

export interface ComponentProps {
  [key: string]: any;
  style?: { [key: string]: any };
  children?: React.ReactNode;
}

export interface ComponentData {
  id: string;
  type: string;
  name?: string;
  props?: ComponentProps;
  show?: boolean;
}

export interface PageData {
  props?: ComponentProps;
}

export interface TemplateData {
  id: number;
  title: string;
  coverImg: string;
  author: string;
  copiedCount: number;
  components?: ComponentData[];
  page?: PageData;
}

export interface FormProps extends PropToForm {
  id: string;
  key: any;
  value?: any;
  eventName?: string;
  onChange?: (eventName: string, val: any) => void;
}
