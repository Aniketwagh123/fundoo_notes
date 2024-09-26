// note/NotesSlice.jsx
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import noteService from "../../services/notesService"; // Adjust the path as needed

// Async thunk to fetch all notes
export const fetchAllNotes = createAsyncThunk("notes/fetchAll", async () => {
  const response = await noteService.getNotes();
  //   console.log(response);
  return response.data; // Ensure this matches your API response structure
});

export const fetchTrashedNotes = createAsyncThunk("notes/fetchTrashed", async () => {
    const response = await noteService.getTrashedNotes();
    console.log(response);
    return response; // Ensure this matches your API response structure
  });

// export const fetchTrashedNotes = createAsyncThunk(
//   "notes/fetchTrashed",
//   async () => {
//     const response = await noteService.getTrashedNotes();
//     console.log(response);
//     return response;
//   }
// );
// Async thunk to add a new note
export const addNewNote = createAsyncThunk(
  "notes/addNote",
  async (noteData) => {
    console.log("noteData");
    console.log(noteData);

    const response = await noteService.createNote(noteData);
    return response; // Ensure this matches your API response structure
  }
);

const notesSlice = createSlice({
  name: "notes",
  initialState: {
    notesData: [],
    trashedNotes: [],
    selectedColor: null,
    selectedIcon: null,
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedColor: (state, action) => {
      state.selectedColor = action.payload;
    },
    setSelectedIcon: (state, action) => {
      state.selectedIcon = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllNotes.fulfilled, (state, action) => {
        state.notesData = action.payload; // Set the fetched notes
        state.loading = false;
      })
      .addCase(fetchAllNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addNewNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNewNote.fulfilled, (state, action) => {
        // console.log(action.payload);
        state.notesData.push(action.payload.data); // Add new note
        state.loading = false;
      })
      .addCase(addNewNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchTrashedNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrashedNotes.fulfilled, (state, action) => {
        state.trashedNotes = action.payload;
        console.log(`????///${action.payload}`);

        state.loading = false;
      })
      .addCase(fetchTrashedNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export actions for updating selected color and icon
export const { setSelectedColor, setSelectedIcon } = notesSlice.actions;

// Export the reducer as default
export default notesSlice.reducer;
