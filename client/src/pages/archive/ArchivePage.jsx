// trash/TrashPage.jsx
import { Box } from "@mui/material";
import NoNotes from "../../components/NoNotes";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchArchivedNotes } from "../notes/notesSlice";
import ArchivedNotes from "./ArchivedNotes";

const ArchivePage = () => {
  const dispatch = useDispatch();
  const archivedNotesLength = useSelector(
    (state) => state.notes.archivedNotes.length
  );

  useEffect(() => {
    // Fetch trashed notes when the page loads
    dispatch(fetchArchivedNotes());
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
      {archivedNotesLength <= 0 ? <NoNotes /> : <ArchivedNotes />}
    </Box>
  );
};

export default ArchivePage;
