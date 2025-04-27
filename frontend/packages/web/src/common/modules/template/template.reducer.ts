import { createSlice } from '@reduxjs/toolkit';
import { TemplateData } from './template.types';
import { getTemplate, getTemplates } from './template.actions';

// 定义初始状态的类型
export interface TemplateState {
  template?: TemplateData | null;
  templateLoading: boolean;
  templates?: TemplateData[] | null;
  templatesLoading: boolean;
}

export const initialState: TemplateState = {
  template: null,
  templateLoading: false,
  templates: null,
  templatesLoading: false,
};

export const templateSlice = createSlice({
  name: 'template',
  initialState,
  reducers: {
    
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
      })
      .addCase(getTemplates.pending, (state) => {
        state.templates = null;
        state.templatesLoading = true;
      })
      .addCase(getTemplates.fulfilled, (state, action) => {
        state.templates = action.payload;
        state.templatesLoading = false;
      })
      .addCase(getTemplates.rejected, (state) => {
        state.templates = null;
        state.templatesLoading = false;
      });
  },
});

export const templateReducerKey = templateSlice.name;

export default templateSlice.reducer;
