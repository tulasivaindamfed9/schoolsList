// frontend/src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
// import schoolReducer from "../features/schools/schoolSlice";
import schoolReducer from "./ReduxSlices/schoolSlice"

const store = configureStore({
  reducer: {
    schools: schoolReducer,
  },
});

export default store;
