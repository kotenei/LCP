import { createSlice } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash-es";
import { v4 as uuidv4 } from "uuid";
import { getTemplate } from "./editor.actions";
import { ComponentData, HistoryProps, PageData, TemplateData } from "./typing";
import { insertAt, debounce } from "@lcp/utils";

// 定义初始状态的类型
interface EditorState {
  template?: TemplateData | null;
  templateLoading: boolean;
  components?: ComponentData[];
  currentComponent?: ComponentData | null;
  page?: PageData;
  copiedComponent?: ComponentData | null;
  histories: HistoryProps[];
  historyIndex: number;
}

// 初始状态
const initialState: EditorState = {
  template: null,
  templateLoading: false,
  components: [],
  currentComponent: null,
  page: {
    props: {
      style: {
        backgroundColor: "",
        backgroundImage: "",
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
        height: 530,
      },
    },
  },
  copiedComponent: null,
  histories: [],
  historyIndex: -1,
};

const pushModifyHistory = (state) => {};

export const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    setCurrentComponent: (state, action) => {
      state.currentComponent = action.payload;
    },
    setCopiedComponent: (state, action) => {
      state.copiedComponent = action.payload;
    },
    pasteCopiedComponent: (state, action) => {
      if (action.payload) {
        const newItem = cloneDeep(action.payload);
        action.payload = newItem;
        editorSlice.caseReducers.addComponent(state, action);

        state.histories.push({
          id: uuidv4(),
          componentId: newItem.id,
          type: "add",
          data: cloneDeep(newItem),
        });
      }
    },
    addComponent: (state, action) => {
      const len = state.components?.length || 0;
      const newItem = action.payload;
      newItem.id = uuidv4();
      newItem.name = `图层${len + 1}`;
      newItem.show = true;
      state.components?.push(newItem);

      const histories = state.histories.length
        ? (state.histories.slice(0, state.historyIndex + 1) as any)
        : [];
      histories.push({
        id: uuidv4(),
        componentId: newItem.id,
        type: "add",
        data: cloneDeep(newItem),
      });
      state.histories = histories;
      state.historyIndex++;
    },
    deleteComponent: (state, action) => {
      const id = action.payload;

      if (state.currentComponent && state.currentComponent.id === id) {
        let index = -1;
        const newComponents = state.components
          ? state.components.filter((item, idx) => {
              if (item.id !== id) {
                return true;
              }
              index = idx;
              return false;
            })
          : [];
        const currentComponent = state.currentComponent;
        state.components = newComponents;
        state.currentComponent = null;
        state.histories.push({
          id: uuidv4(),
          componentId: id,
          type: "delete",
          data: currentComponent,
          index,
        });
        state.historyIndex++;
      }
    },
    updateComponent: (state, action) => {
      const component = action.payload;
      const newComponents = state.components ? [...state.components] : [];
      const index = newComponents.findIndex((c) => c.id === component.id);

      if (index >= 0) {
        const oldComponent = newComponents[index];
        newComponents[index] = component;
        state.components = newComponents;
        if (
          state.currentComponent &&
          state.currentComponent.id === component.id
        ) {
          state.currentComponent = component;
        }
        state.histories.push({
          id: uuidv4(),
          componentId: component.id,
          type: "update",
          data: {
            oldValue: {
              name: oldComponent.name,
              show: oldComponent.show,
              props: oldComponent.props,
            },
            newValue: {
              name: component.name,
              show: component.show,
              props: component.props,
            },
          },
          index,
        });
        state.historyIndex++;
      }
    },
    updateComponents: (state, action) => {
      state.components = action.payload;
    },
    updatePage: (state, action) => {
      const { key, value } = action.payload;
      const newPageData = { ...state.page };
      if (newPageData.props && newPageData.props.style) {
        newPageData.props.style[key] = value;
      }
      state.page = newPageData;
    },
    undo: (state) => {
      const history = state.histories[state.historyIndex];
      if (history) {
        switch (history.type) {
          case "add":
            state.components = state.components?.filter(
              (item) => item.id !== history.componentId
            );
            break;
          case "delete":
            state.components = insertAt(
              state.components as any[],
              history.index as number,
              history.data
            );
            break;
          case "update":
            const { componentId, data } = history;
            const { oldValue } = data;
            const updateComponent = state.components?.find(
              (item) => item.id === componentId
            );
            if (updateComponent) {
              updateComponent.props = oldValue.props;
              updateComponent.name = oldValue.name;
              updateComponent.show = oldValue.show;
            }
            break;
          default:
            break;
        }
        state.historyIndex--;
      }
    },
    redo: (state) => {
      const history = state.histories[state.historyIndex + 1];
      if (history) {
        switch (history.type) {
          case "add":
            state.components?.push(history.data);
            break;
          case "delete":
            state.components = state.components?.filter(
              (item) => item.id !== history.componentId
            );
            break;
          case "update":
            const { componentId, data } = history;
            const { newValue } = data;
            const updateComponent = state.components?.find(
              (item) => item.id === componentId
            );
            if (updateComponent) {
              updateComponent.props = newValue.props;
              updateComponent.name = newValue.name;
              updateComponent.show = newValue.show;
            }
            break;
          default:
            break;
        }
        state.historyIndex++;
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
  updateComponents,
  updatePage,
  deleteComponent,
  setCopiedComponent,
  pasteCopiedComponent,
  undo,
  redo,
} = editorSlice.actions;

export const editorReducerKey = editorSlice.name;

export default editorSlice.reducer;
