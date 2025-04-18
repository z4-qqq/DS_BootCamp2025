import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from 'services';
import { assistantApi} from "services";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefault) => getDefault().concat(baseApi.middleware).concat(assistantApi.middleware),
});
