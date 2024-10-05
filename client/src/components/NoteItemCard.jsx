import { useState } from "react";
import { alpha, Box, Card, Chip, Typography } from "@mui/material";
import BottomIconOptionsBar from "./BottomIconOptionsBar";
import TrashBottomIconOptionsBar from "./TrashBottomIconOptionsBar";
import AccessTimeIcon from "@mui/icons-material/AccessTime"; // Import AccessTimeIcon for the timer
import { useSelector } from "react-redux";

const NoteItem = ({ item, noteclick }) => {
  const [isHovered, setIsHovered] = useState(false); // State to track hover status
  const labelsData = useSelector((state) => state.notes.labels)?.filter((labelD) =>
    item.labels.includes(labelD.id)
  ); // Filter to get labels associated with the note

  return (
    <Card
      elevation={!isHovered ? 0 : 1}
      sx={{
        paddingInline: 5,
        paddingBlock: 1,
        border: "solid .5px",
        borderColor: alpha("#000", 0.2),
        borderRadius: "10px",
        marginBottom: 2,
        maxWidth: "300px",
        background: `url(${item.image})`,
        backgroundRepeat: "no-repeat",
        backgroundBlendMode: "overlay",
        backgroundSize: "cover",
        position: "relative", // Enable positioning for the bottom bar
        minHeight: "150px", // Adjust card height to accommodate content + icon bar
        transition: "padding-bottom 0.3s ease", // Smooth transition on hover
        paddingBottom: isHovered ? "50px" : "50px", // Increase space on hover
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Title with click handler */}
      <Typography
        variant="h6"
        style={{ lineHeight: "20px", cursor: "pointer" }}
        onClick={(e) => {
          noteclick(); // Use the function passed as prop
        }}
      >
        {item.title}
      </Typography>

      <Box height={15}></Box>

      {/* Description with click handler */}
      <Typography
        style={{
          cursor: "pointer",
          transform: isHovered ? "translateY(-10px)" : "translateY(0)", // Move text up on hover
          transition: "transform 0.3s ease", // Smooth transition
        }}
        onClick={(e) => {
          noteclick(); // Use the function passed as prop
        }}
      >
        {item.description}
      </Typography>

      {item.reminder && (
        <Chip
          icon={<AccessTimeIcon />} // Timer icon
          label={new Date(item.reminder).toLocaleString()} // Display the reminder time
          sx={{ marginTop: 1 }}
        />
      )}

      {/* Render chips for labels */}
      <Box sx={{ display: "flex", flexWrap: "wrap", marginTop: 1 }}>
        {labelsData?.map((label) => (
          <Chip
            key={label.id} // Use the label id as key
            label={label.name} // Display the actual label name
            sx={{ marginRight: 0.5, marginBottom: 0.5 }} // Space between chips
            style={{ backgroundColor: label.color }} // Apply the label color
          />
        ))}
      </Box>

      {/* Reserved space for the bottom icon bar */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: 1,
          backgroundColor: alpha("#fff", 0.8),
          display: "flex",
          justifyContent: "space-around",
          visibility: isHovered ? "visible" : "hidden", // Show on hover
        }}
        onClick={(e) => e.stopPropagation()} // Prevent click propagation on the BottomBar
      >
        {location.pathname.includes("trash") ? (
          <TrashBottomIconOptionsBar noteId={item.id} />
        ) : location.pathname.includes("archive") ? (
          <BottomIconOptionsBar noteId={item.id} archive={true} />
        ) : (
          <BottomIconOptionsBar noteId={item.id} pLabels={item.labels} />
        )}
      </Box>
    </Card>
  );
};

export default NoteItem;
