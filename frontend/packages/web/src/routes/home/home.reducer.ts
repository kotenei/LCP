import { createSlice } from '@reduxjs/toolkit';

export interface HomeState {}

export const initialState: HomeState = {};

export const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

export const homeReducerKey = homeSlice.name;

export default homeSlice.reducer;
