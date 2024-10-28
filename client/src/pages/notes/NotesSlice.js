// note/NotesSlice.jsx
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import noteService from "../../services/notesService"; // Adjust the path as needed
// import { act } from "react";

// Async thunk to fetch all notes
export const fetchAllNotes = createAsyncThunk("notes/fetchAll", async () => {
  const response = await noteService.getNotes();
  return response.data; // Ensure this matches your API response structure
});

export const fetchTrashedNotes = createAsyncThunk(
  "notes/fetchTrashed",
  async () => {
    const response = await noteService.getTrashedNotes();
    return response; // Ensure this matches your API response structure
  }
);

export const fetchArchivedNotes = createAsyncThunk(
  "notes/fetchArchived",
  async () => {
    const response = await noteService.getArchivedNotes();
    return response; // Ensure this matches your API response structure
  }
);

export const addNewNote = createAsyncThunk(
  "notes/addNote",
  async (noteData) => {
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
export const toggleTrash = createAsyncThunk("notes/toggleTrash", async (id) => {
  const response = await noteService.toggleTrash(id);
  return response; // Ensure this matches your API response structure
});

export const toggleArchive = createAsyncThunk(
  "notes/toggleArchive",
  async (id) => {
    const response = await noteService.toggleArchive(id);
    return response; // Ensure this matches your API response structure
  }
);

export const deleteNote = createAsyncThunk("notes/deleteNote", async (id) => {
  const response = await noteService.deleteNote(id);
  return { id }; // Ensure this matches your API response structure
});

// Async thunk to fetch all labels
export const fetchAllLabels = createAsyncThunk(
  "label/fetchAllLabels",
  async () => {
    const response = await noteService.getAllLabels(); // Create this function in your service
    return response.data; // Ensure this matches your API response structure
  }
);

// Async thunk to add labels
export const addLabel = createAsyncThunk(
  "label/addLabel",
  async (labelData) => {
    const response = await noteService.addLabel(labelData);
    return response.data; // Ensure this matches your API response structure
  }
);

// Async thunk to remove labels
export const removeLabel = createAsyncThunk("label/removeLabel", async (id) => {
  const response = await noteService.removeLabel(id);
  return id; // Ensure this matches your API response structure
});

// Async thunk to add note labels
export const addNoteLabel = createAsyncThunk(
  "notes/addNoteLabel",
  async ({note_id, label_ids}) => {
    await noteService.addNoteLabel(note_id, label_ids);
    return {note_id, label_ids}; // Ensure this matches your API response structure
  }
);
// Async thunk to remove labels
export const removeNoteLabel = createAsyncThunk(
  "notes/removeNoteLabel",
  async ({note_id, label_ids}) => {
    await noteService.removeNoteLabel(note_id, label_ids);
    return {note_id, label_ids}; // Ensure this matches your API response structure
  }
);

const notesSlice = createSlice({
  name: "notes",
  initialState: {
    notesData: [],
    trashedNotes: [],
    archivedNotes: [],
    labels: [],
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
        console.log(action.payload);

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

        state.loading = false;
      })
      .addCase(fetchTrashedNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchArchivedNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArchivedNotes.fulfilled, (state, action) => {
        state.archivedNotes = action.payload;
        state.loading = false;
      })
      .addCase(fetchArchivedNotes.rejected, (state, action) => {
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

        if (index !== -1) {
          state.notesData[index] = action.payload.data; // Update the note in the array
        }
        state.loading = false;
      })
      // Handle rejected state for updating note
      .addCase(updateNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Handle the toggleTrash action
      .addCase(toggleTrash.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleTrash.fulfilled, (state, action) => {
        const noteId = action.payload.id;
        const isTrash = action.payload.is_trash;
        const isArchive = action.payload.is_archive;

        // Remove from current location
        state.notesData = state.notesData.filter((note) => note.id !== noteId);
        state.trashedNotes = state.trashedNotes.filter(
          (note) => note.id !== noteId
        );
        state.archivedNotes = state.archivedNotes.filter(
          (note) => note.id !== noteId
        );

        if (isTrash) {
          // Add to trashedNotes if it's trashed
          state.trashedNotes.push(action.payload);
        } else if (isArchive) {
          // Add to archivedNotes if it's archived
          state.archivedNotes.push(action.payload);
        } else {
          // Otherwise, add it back to notesData
          state.notesData.push(action.payload);
        }

        state.loading = false;
      })

      .addCase(toggleTrash.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Handle the toggleArchive action
      .addCase(toggleArchive.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleArchive.fulfilled, (state, action) => {
        const noteId = action.payload.id;
        const isTrash = action.payload.is_trash;
        const isArchive = action.payload.is_archive;

        // Remove from current location
        state.notesData = state.notesData.filter((note) => note.id !== noteId);
        state.trashedNotes = state.trashedNotes.filter(
          (note) => note.id !== noteId
        );
        state.archivedNotes = state.archivedNotes.filter(
          (note) => note.id !== noteId
        );

        if (isTrash) {
          // Add to trashedNotes if it's trashed
          state.trashedNotes.push(action.payload);
        } else if (isArchive) {
          // Add to archivedNotes if it's archived
          state.archivedNotes.push(action.payload);
        } else {
          // Otherwise, add it back to notesData
          state.notesData.push(action.payload);
        }

        state.loading = false;
      })

      .addCase(toggleArchive.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Handle the toggleArchive action
      .addCase(deleteNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        const noteId = action.payload.id;

        // Remove from all lists: notesData, trashedNotes, and archivedNotes
        state.notesData = state.notesData.filter((note) => note.id !== noteId);
        state.trashedNotes = state.trashedNotes.filter(
          (note) => note.id !== noteId
        );
        state.archivedNotes = state.archivedNotes.filter(
          (note) => note.id !== noteId
        );

        state.loading = false;
      })

      .addCase(deleteNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchAllLabels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllLabels.fulfilled, (state, action) => {
        state.labels = action.payload; // Set the fetched labels
        console.log(state.labels);
        
        state.loading = false;
      })
      .addCase(fetchAllLabels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addLabel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addLabel.fulfilled, (state, action) => {
        state.labels.push(action.payload); // Add the new label to the labels array
        state.loading = false;
      })
      .addCase(addLabel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(removeLabel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeLabel.fulfilled, (state, action) => {
        state.labels = state.labels.filter(
          (label) => label.id !== action.payload
        ); // Remove the label from the array
        state.loading = false;
      })
      .addCase(removeLabel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(addNoteLabel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNoteLabel.fulfilled, (state, action) => {
        const { note_id, label_ids } = action.payload;
      
        const note = state.notesData.find((n) => n.id === note_id);
        if (note) {
          const existingLabels = new Set(note.labels);
          const newLabels = label_ids.filter(
            (labelId) => !existingLabels.has(labelId)
          );
      
          note.labels = [...note.labels, ...newLabels];
        }
        state.loading = false;
      })
      .addCase(addNoteLabel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(removeNoteLabel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeNoteLabel.fulfilled, (state, action) => {
        const { note_id, label_ids } = action.payload;
      
        const note = state.notesData.find((n) => n.id === note_id);
        if (note) {
          note.labels = note.labels.filter(
            (labelId) => !label_ids.includes(labelId)
          );
        }
        state.loading = false;
      })
      
      .addCase(removeNoteLabel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export actions for updating selected color and icon
export const { setSelectedColor, setSelectedIcon } = notesSlice.actions;

// Export the reducer as default
export default notesSlice.reducer;
