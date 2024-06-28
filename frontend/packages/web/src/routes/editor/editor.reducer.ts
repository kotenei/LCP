import { createSlice } from "@reduxjs/toolkit";
import _ from "lodash-es";

import { getTemplate } from "./editor.actions";
import { ComponentData, PageData, TemplateData } from "./typing";

// 定义初始状态的类型
interface EditorState {
  template?: TemplateData | null;
  templateLoading: boolean;
  components?: ComponentData[];
  currentComponent?: ComponentData | null;
  page?: PageData;
}

// 初始状态
const initialState: EditorState = {
  template: null,
  templateLoading: false,
  components: [],
  currentComponent: null,
  page:{
    props:{
      backgroundColor:'',
      backgroundImage:'',
      
    }
  }
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
    deleteComponent: (state, action) => {
      const id = action.payload;
      const newComponents = state.components
        ? state.components.filter((item) => item.id !== id)
        : [];

      state.components = newComponents;
      if (state.currentComponent && state.currentComponent.id === id) {
        state.currentComponent = null;
      }
    },
    updateComponent: (state, action) => {
      const component = action.payload;
      const newComponents = state.components ? [...state.components] : [];
      const index = newComponents.findIndex((c) => c.id === component.id);

      if (index >= 0) {
        newComponents[index] = component;
        state.components = newComponents;
        if (
          state.currentComponent &&
          state.currentComponent.id === component.id
        ) {
          state.currentComponent = component;
        }
      }
    },
    setDisplay: (state, action) => {
      const { id, show } = action.payload;
      const newComponents = state.components ? [...state.components] : [];
      const index = newComponents.findIndex((c) => c.id === id);

      if (index >= 0) {
        newComponents[index].show = show;
        state.components = newComponents;
      }

      if (state.currentComponent && state.currentComponent.id === id) {
        state.currentComponent = newComponents[index];
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

export const {
  setCurrentComponent,
  addComponent,
  updateComponent,
  setDisplay,
} = editorSlice.actions;

export const editorReducerKey = editorSlice.name;

export default editorSlice.reducer;
