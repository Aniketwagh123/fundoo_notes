import { useSelector } from "react-redux";
import { Box, ImageList, ImageListItem } from "@mui/material";
import NoteItem from "../../components/NoteItemCard"; // Reuse the NoteItem component

const ReminderNotes = () => {
  const reminderNotes = useSelector((state) => 
    state.notes.notesData.filter(note => note.reminder !== null)
  );
  const loading = useSelector((state) => state.notes.loading);
  const error = useSelector((state) => state.notes.error);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    if (error === "Request failed with status code 401") {
      // Handle token expired state here
    }
    return <div>Error: {error}</div>;
  }

  return (
    <Box
      sx={{
        width: "100%",
        paddingBlock: "30px",
        paddingInline: "1%",
        display: "flex",
      }}
    >
      <ImageList variant="masonry" cols={4} gap={16}>
        {reminderNotes.map((item) => (
          <ImageListItem key={item.id}>
            <NoteItem item={item} />
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
};

export default ReminderNotes;
