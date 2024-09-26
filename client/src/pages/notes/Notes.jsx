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
    if(error === "Request failed with status code 401"){
      //TODO: handle token expired state here
    }
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
          <ImageListItem key={item.id} onClick={() => handleClickOpen(item)}>
            <NoteItem item={item} />
          </ImageListItem>
        ))}
      </ImageList>

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
