import { createAsyncThunk } from '@reduxjs/toolkit';
import { template } from '@lcp/apis';
import { TemplateData } from './template.types';

export const getTemplate = createAsyncThunk('@template/getTemplate', async (id: number) => {
  const response = await template.getTemplates(id);
  return response.data;
});

export const getTemplates = createAsyncThunk('@template/getTemplates', async (params: any): Promise<TemplateData[]> => {
  const response = await template.getTemplates(params);
  return response.data;
});
