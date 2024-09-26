// trash/TrashPage.jsx
import { Box } from "@mui/material";
import NoNotes from "../notes/NoNotes";
import TrashedNotes from "./TrashedNotes";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchTrashedNotes } from "../notes/notesSlice";

const TrashPage = () => {
  const dispatch = useDispatch();
  const trashedNotesLength = useSelector((state) => state.notes.trashedNotes.length);

  useEffect(() => {
    // Fetch trashed notes when the page loads
    dispatch(fetchTrashedNotes());
  }, [dispatch]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        flexDirection: "column",
      }}
    >
      {/* Conditional rendering: Show NoNotes if there are no trashed notes */}
      {trashedNotesLength <= 0 ? <NoNotes /> : <TrashedNotes />}
    </Box>
  );
};

export default TrashPage;
