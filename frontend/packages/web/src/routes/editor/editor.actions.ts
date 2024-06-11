import { template } from "@lcp/apis";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getTemplate = createAsyncThunk(
  "@editor/getTemplate",
  async (id: number) => {
    const response = await template.getTemplate(id);
    return response.data;
  }
);
