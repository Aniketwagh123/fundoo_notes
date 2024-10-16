// trash/archivedNotes.jsx
import { useSelector } from "react-redux";
import { Box, ImageList, ImageListItem } from "@mui/material";
import NoteItem from "../../components/NoteItemCard"; // Reuse the NoteItem component

const ArchivedNotes = () => {
  // const dispatch = useDispatch();
  const archivedNotes = useSelector((state) => state.notes.archivedNotes);
  const loading = useSelector((state) => state.notes.loading); // Loading state
  const error = useSelector((state) => state.notes.error); // Error state

  // Handle loading and error states
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
        {archivedNotes.map((item) => (
          <ImageListItem key={item.id}>
            <NoteItem item={item} />
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
};

export default ArchivedNotes;
