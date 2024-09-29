import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ImageList,
  ImageListItem,
} from "@mui/material";
import BottomIconOptionsBar from "./BottomIconOptionsBar";
import { fetchAllNotes, updateNote } from "./notesSlice"; // Import updateNote
import NoteItem from "./NoteItemCard"; // Make sure the import is correct

const Notes = () => {
  const dispatch = useDispatch();
  const notesData = useSelector((state) => state.notes.notesData);
  const [open, setOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [editedNote, setEditedNote] = useState({ title: "", description: "" });
  const loading = useSelector((state) => state.notes.loading);
  const error = useSelector((state) => state.notes.error);

  useEffect(() => {
    dispatch(fetchAllNotes());
  }, [dispatch]);

  // Handle opening the dialog
  const handleClickOpen = (note) => {
    setSelectedNote(note);
    setEditedNote({
      title: note.title,
      description: note.description,
    });
    setOpen(true);
  };

  // Handle closing the dialog
  const handleClose = () => {
    setOpen(false);
    setSelectedNote(null);
  };

  // Handle content editing for title and description
  const handleEdit = (field, event) => {
    setEditedNote({
      ...editedNote,
      [field]: event.target.textContent,
    });
  };

  // Save the edited note
  const handleSave = () => {
    if (selectedNote) {
      dispatch(updateNote({ id: selectedNote.id, noteData: editedNote }));
      handleClose(); // Close the dialog after saving
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Box
      sx={{
        width: "100%",
        paddingBlock: "30px",
        paddingInline: "10%",
        display: "flex",
      }}
    >
      <ImageList variant="masonry" cols={4} gap={16}>
        {notesData.map((item) => (
          <ImageListItem key={item.id}>
            <NoteItem item={item} noteclick={() => handleClickOpen(item)} />
          </ImageListItem>
        ))}
      </ImageList>

      {/* Dialog for viewing selected note details */}
      <Dialog open={open} onClose={handleClose}>
        <Box
          sx={{
            background: `url(${selectedNote?.image})`,
            backgroundRepeat: "no-repeat",
            backgroundBlendMode: "overlay",
            backgroundSize: "cover",
          }}
        >
          <DialogTitle
            contentEditable
            suppressContentEditableWarning
            onBlur={(event) => handleEdit("title", event)}
            sx={{
              outline: "none", // Remove outline
              border: "none",  // Remove border (if any)
            }}
          >
            {editedNote.title}
          </DialogTitle>
          <DialogContent>
            <p
              contentEditable
              suppressContentEditableWarning
              onBlur={(event) => handleEdit("description", event)}
              style={{
                outline: "none", // Remove outline
                border: "none",  // Remove border (if any)
              }}
            >
              {editedNote.description}
            </p>
          </DialogContent>
          <DialogActions
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <BottomIconOptionsBar />
            <Button onClick={handleSave} color="primary">
              Save
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default Notes;
