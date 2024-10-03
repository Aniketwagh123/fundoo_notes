import { Box } from "@mui/material";
import { useEffect, useState } from "react";

const ReminderPage = () => {
  const [startDateTime, setStartDateTime] = useState("");
  const [minDateTime, setMinDateTime] = useState("");

  useEffect(() => {
    // Get the current date and time
    const now = new Date();
    
    // Format it to 'YYYY-MM-DDTHH:MM' format
    const formattedDateTime = now.toISOString().slice(0, 16);
    setStartDateTime(formattedDateTime);
    setMinDateTime(formattedDateTime); // Set minimum datetime to now
  }, []);

  const handleBlur = () => {
    const confirmMessage = `You selected: ${startDateTime}. Do you want to confirm?`;
    if (window.confirm(confirmMessage)) {
      console.log("Confirmed Date and Time:", startDateTime);
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
        height: "100vh",
        borderRadius: 1,
        bgcolor: "lightpink",
      }}
    >
      <h1>Reminder</h1>
      <label htmlFor="remindertime">reminder (date and time):</label>
      <input 
        type="datetime-local" 
        id="remindertime" 
        name="remindertime" 
        value={startDateTime} // Set the value to the state
        min={minDateTime} // Set minimum datetime to prevent past selection
        onChange={(e) => setStartDateTime(e.target.value)} // Handle input changes
        onBlur={handleBlur} // Trigger confirm on blur
      />
    </Box>
  );
};

export default ReminderPage;
