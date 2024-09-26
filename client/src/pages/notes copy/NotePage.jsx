// NotePage.jsx
import { Box } from "@mui/material";
import NoNotes from "./NoNotes";
import Notes from "./Notes";
import ExpandableNote from "./TakeNote";
// import BackgroundOptions from "./BackgroundOptions";
import { useSelector } from "react-redux";


const NotePage = () => {
  const selectedColor = useSelector((state) => state.notes.notesData.length);

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
      {(selectedColor<=0) && <NoNotes />} {/* Conditional rendering for NoNotes */}
      {/* <BackgroundOptions/> */}
      <Notes />
      
    </Box>
  );
};

export default NotePage;
