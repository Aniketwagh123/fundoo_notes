// note/NoteItemCard.jsx
import { useState } from "react";
import { alpha, Box, Card, Typography } from "@mui/material";
// import { useLocation } from "react-router-dom"; // Import useLocation from react-router-dom
import BottomIconOptionsBar from "./BottomIconOptionsBar";
import TrashBottomIconOptionsBar from "./trashBottomIconOptionsBar";

const NoteItem = ({ item, noteclick }) => {
  const [isHovered, setIsHovered] = useState(false); // State to track hover status

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
        paddingBottom: isHovered ? "50px" : "10px", // Increase space on hover
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
          <BottomIconOptionsBar noteId={item.id} />
        )}
      </Box>
    </Card>
  );
};

export default NoteItem;
