// src/store.js
import { configureStore } from "@reduxjs/toolkit";
import notesReducer from "../pages/notes/NotesSlice";

const store = configureStore({
  reducer: {
    notes: notesReducer,
  },
});

export default store;
