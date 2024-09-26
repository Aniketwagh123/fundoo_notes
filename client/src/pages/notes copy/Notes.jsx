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
import NoteItem from "./NoteItem";
import BottomIconOptionsBar from "./BottomIconOptionsBar";
import { fetchAllNotes } from "./notesSlice"; // Update the import to include the async thunk

const Notes = () => {
  const dispatch = useDispatch();
  const notesData = useSelector((state) => state.notes.notesData);
  const [open, setOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const loading = useSelector((state) => state.notes.loading); // Loading state
  const error = useSelector((state) => state.notes.error); // Error state

  useEffect(() => {
    // Dispatch the fetchAllNotes action to get notes data
    dispatch(fetchAllNotes());
  }, [dispatch]);

  const handleClickOpen = (note) => {
    setSelectedNote(note);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedNote(null);
  };

  // Optionally handle loading and error states
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
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: "16px", // Spacing between items
      }}
    >
      {notesData.map((item) => (
        <Box
          key={item.id}
          onClick={() => handleClickOpen(item)}
          sx={{
            cursor: "pointer",
          }}
        >
          <NoteItem item={item} />
        </Box>
      ))}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{selectedNote?.title}</DialogTitle>
        <DialogContent>
          <p>{selectedNote?.description}</p>
        </DialogContent>
        <DialogActions>
          <BottomIconOptionsBar />
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Notes;
