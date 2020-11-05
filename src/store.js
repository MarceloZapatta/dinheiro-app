import { configureStore } from '@reduxjs/toolkit';
import alertErroReducer from './store/reducers/alertErroReducer';

const store = configureStore({
  reducer: {
    alertErro: alertErroReducer,
  },
});

export default store;
