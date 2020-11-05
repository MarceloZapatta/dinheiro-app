import { createSlice } from '@reduxjs/toolkit';

export const alertErroSlice = createSlice({
  name: 'alertErro',
  initialState: {
    value: {
      show: false,
      header: 'Erro!',
      message: 'Ocorreu um erro!',
    },
  },
  reducers: {
    setShow: (state, action) => {
      state.value.show = action.payload;
    },
    setMessage: (state, action) => {
      state.value.message = action.payload;
    },
    setHeader: (state, action) => {
      state.value.header = action.payload;
    },
  },
});

export const { setShow, setMessage, setHeader } = alertErroSlice.actions;

export default alertErroSlice.reducer;
