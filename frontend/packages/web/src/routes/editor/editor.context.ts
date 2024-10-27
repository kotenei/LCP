import React from "react";
import { ComponentData } from "./typing";

export interface EditorContextProps {
  onItemAdd: (item: ComponentData) => void;
  onItemClick: (item: ComponentData, changeTab?: boolean) => void;
  onToggle: (id: string, show: boolean) => void;
  onNameChange: (id: string, name: string) => void;
  onPageChange: (key: string, value: any) => void;
  onPropChange: (key: string, value: any) => void;
  onSort: (components: ComponentData[]) => void;
  onUndo: () => void;
  onRedo: () => void;
}

const EditorContext = React.createContext<EditorContextProps | undefined>(
  undefined
);

export default EditorContext;
