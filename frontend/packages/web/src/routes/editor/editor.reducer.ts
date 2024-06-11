import { createSlice } from "@reduxjs/toolkit";
import _ from "lodash-es";

import { getTemplate } from "./editor.actions";
import { ComponentData, TemplateData } from "./typing";

// 定义初始状态的类型
interface EditorState {
  template?: TemplateData | null;
  templateLoading: boolean;
  components?: ComponentData[];
  currentComponent?: ComponentData | null;
}

// 初始状态
const initialState: EditorState = {
  template: null,
  templateLoading: false,
  components: [],
  currentComponent: null,
};

export const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    setCurrentComponent: (state, action) => {
      state.currentComponent = action.payload;
    },
    addComponent: (state, action) => {
      state.components?.push(action.payload);
    },
    updateComponent: (state, action) => {
      const currentComponent = _.cloneDeep(state.currentComponent);
      const newComponents = state.components ? [...state.components] : [];
      const index = newComponents.findIndex(
        (c) => c.id === currentComponent?.id
      );

      if (currentComponent && currentComponent.props && index >= 0) {
        const { key, value } = action.payload;
        if (currentComponent.props[key] != null) {
          currentComponent.props[key] = value;
        } else {
          for (const k in currentComponent.props.style) {
            if (k === key) {
              currentComponent.props.style[key] = value;
              break;
            }
          }
        }
        newComponents[index] = currentComponent;
        state.currentComponent = currentComponent;
        state.components = newComponents;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTemplate.pending, (state) => {
        state.template = null;
        state.templateLoading = true;
      })
      .addCase(getTemplate.fulfilled, (state, action) => {
        state.template = action.payload;
        state.templateLoading = false;
      })
      .addCase(getTemplate.rejected, (state) => {
        state.template = null;
        state.templateLoading = false;
      });
  },
});

export const { setCurrentComponent, addComponent, updateComponent } =
  editorSlice.actions;

export const editorReducerKey = editorSlice.name;

export default editorSlice.reducer;
