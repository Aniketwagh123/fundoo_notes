import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateNote } from "../pages/notes/NotesSlice";

const ReminderInput = ({ onClose, noteId }) => {
  const [startDateTime, setStartDateTime] = useState("");
  const [minDateTime, setMinDateTime] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const now = new Date();
    const formattedDateTime = now.toISOString().slice(0, 16);
    setStartDateTime(formattedDateTime);
    setMinDateTime(formattedDateTime); // Set minimum datetime to now
  }, []);

  const handleSetReminder = () => {
    const confirmMessage = `You selected: ${startDateTime}. Do you want to confirm?`;
    if (window.confirm(confirmMessage)) {
      console.log("Confirmed Date and Time:", startDateTime, noteId);
      // Trigger the onClose to hide the ReminderInput
      dispatch(
        updateNote({ id: noteId, noteData: { reminder: startDateTime } })
      );
      onClose;
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column", // Stack elements vertically
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        borderRadius: 2,
        padding: "20px",
        // backgroundColor:"#FFFFFF",
        bgcolor: "rgba(255, 255, 255, 0.1)", // Transparent white background
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)", // Subtle shadow
        backdropFilter: "blur(10px)", // Frosted glass effect
        border: "1px solid rgba(255, 255, 255, 0.3)", // Optional: border with transparency
      }}
    >
      <label htmlFor="remindertime">Reminder (Date and Time):</label>
      <input
        type="datetime-local"
        id="remindertime"
        name="remindertime"
        value={startDateTime} // Set the value to the state
        min={minDateTime} // Set minimum datetime to prevent past selection
        onChange={(e) => setStartDateTime(e.target.value)} // Handle input changes
        style={{
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          //   backgroundColor: "rgba(255, 255, 255, 0.5)", // Semi-transparent input background
          color: "#000",
          marginTop: "20px",
        }}
      />
      <Button
        variant="contained"
        onClick={handleSetReminder}
        sx={{
          marginTop: "20px",
          backgroundColor: "#1976d2",
          color: "#fff",
          padding: "10px 20px",
          borderRadius: "8px",
          "&:hover": {
            backgroundColor: "#1565c0",
          },
        }}
      >
        Set Reminder
      </Button>
    </Box>
  );
};

export default ReminderInput;
