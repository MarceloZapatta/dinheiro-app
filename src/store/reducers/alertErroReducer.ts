import { createSlice } from '@reduxjs/toolkit';

export const alertErroSlice = createSlice({
  name: 'alertErro',
  initialState: {
    value: {
      show: false,
      titulo: 'Erro!',
      mensagem: 'Ocorreu um erro!',
    },
  },
  reducers: {
    setShow: (state, action) => {
      state.value.show = action.payload.show;

      state.value.mensagem = '';
      if (action.payload.mensagem) {
        state.value.mensagem = action.payload.mensagem;
      }

      state.value.titulo = '';
      if (action.payload.titulo) {
        state.value.titulo = action.payload.titulo;
      }
    },
  },
});

export const { setShow } = alertErroSlice.actions;

export default alertErroSlice.reducer;
