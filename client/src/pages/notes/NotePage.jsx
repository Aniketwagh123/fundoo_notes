// src/components/NotePage.jsx
import { Box } from "@mui/material";
import NoNotes from "./NoNotes";
import Notes from "./Notes";
import ExpandableNote from "./TakeNote";
// import BackgroundOptions from "./BackgroundOptions";

const NotePage = () => {
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
      <ExpandableNote />
      {false && <NoNotes />} {/* Conditional rendering for NoNotes */}
      {/* <BackgroundOptions/> */}
      <Notes />
      
    </Box>
  );
};

export default NotePage;
