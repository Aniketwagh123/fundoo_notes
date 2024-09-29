// note/NotesSlice.jsx
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import noteService from "../../services/notesService"; // Adjust the path as needed

// Async thunk to fetch all notes
export const fetchAllNotes = createAsyncThunk("notes/fetchAll", async () => {
  const response = await noteService.getNotes();
  //   console.log(response);
  return response.data; // Ensure this matches your API response structure
});

export const fetchTrashedNotes = createAsyncThunk(
  "notes/fetchTrashed",
  async () => {
    const response = await noteService.getTrashedNotes();
    console.log(response);
    return response; // Ensure this matches your API response structure
  }
);

export const addNewNote = createAsyncThunk(
  "notes/addNote",
  async (noteData) => {
    console.log("noteData");
    console.log(noteData);

    const response = await noteService.createNote(noteData);
    return response; // Ensure this matches your API response structure
  }
);

export const updateNote = createAsyncThunk(
  "notes/updateNote",
  async ({ id, noteData }) => {
    const response = await noteService.updateNote(id, noteData);
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
      })
      .addCase(updateNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Handle fulfilled state for updating note
      .addCase(updateNote.fulfilled, (state, action) => {
        const index = state.notesData.findIndex(
          (note) => note.id === action.payload.data.id
        );
        console.log(index);
        
        if (index !== -1) {
          state.notesData[index] = action.payload.data; // Update the note in the array
        }
        state.loading = false;
      })
      // Handle rejected state for updating note
      .addCase(updateNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export actions for updating selected color and icon
export const { setSelectedColor, setSelectedIcon } = notesSlice.actions;

// Export the reducer as default
export default notesSlice.reducer;
