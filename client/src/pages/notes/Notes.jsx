// notes/Notes.jsx
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
import { fetchAllNotes } from "./notesSlice";
import NoteItem from "./NoteItemCard"; // Make sure the import is correct

const Notes = () => {
  const dispatch = useDispatch();
  const notesData = useSelector((state) => state.notes.notesData);
  const [open, setOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const loading = useSelector((state) => state.notes.loading);
  const error = useSelector((state) => state.notes.error);

  useEffect(() => {
    dispatch(fetchAllNotes());
  }, [dispatch]);

  // The function to handle opening the dialog
  const handleClickOpen = (note) => {
    console.log('hii');
    
    setSelectedNote(note);
    setOpen(true);
  };

  // Function to close the dialog
  const handleClose = () => {
    setOpen(false);
    setSelectedNote(null);
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
            {/* Pass handleClickOpen as a function to noteclick */}
            <NoteItem item={item} noteclick={() => handleClickOpen(item)} />
          </ImageListItem>
        ))}
      </ImageList>

      {/* Dialog for viewing selected note details */}
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
