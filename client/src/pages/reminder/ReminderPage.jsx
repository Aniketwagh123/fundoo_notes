import { Box } from "@mui/material";
import NoNotes from "../../components/NoNotes";
import ReminderNotes from "./ReminderNotes";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchAllNotes } from "../notes/NotesSlice";

const ReminderPage = () => {
  const dispatch = useDispatch();
  
  // Add a null/undefined check to avoid breaking the application
  const allNotes = useSelector((state) => state.notes?.notesData || []);
  
  // Filter notes that have reminders
  const reminderNotesLength = allNotes.filter(note => note.reminder !== null).length;

  useEffect(() => {
    dispatch(fetchAllNotes());
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
      {reminderNotesLength <= 0 ? <NoNotes /> : <ReminderNotes />}
    </Box>
  );
};

export default ReminderPage;
