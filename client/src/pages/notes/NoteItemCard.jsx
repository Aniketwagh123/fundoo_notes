// note/NoteItemCardxjsx
import { useState } from "react";
import { alpha, Box, Card, Typography } from "@mui/material";
import BottomIconOptionsBar from "./BottomIconOptionsBar";

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
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Title with click handler */}
      <Typography
        variant="h6"
        style={{ lineHeight: "20px", cursor: "pointer" }}
        onClick={(e) => {
          // e.stopPropagation(); // Prevents event bubbling
          noteclick; // Use the function passed as prop
        }}
      >
        {item.title}
      </Typography>

      <Box height={15}></Box>

      {/* Description with click handler */}
      <Typography
        style={{ cursor: "pointer" }}
        onClick={(e) => {
          // e.stopPropagation(); // Prevents event bubbling
          noteclick; // Use the function passed as prop
        }}
      >
        {item.description}
      </Typography>

      {isHovered && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            marginLeft: "-10px",
            marginTop: 2,
          }}
          onClick={(e) => e.stopPropagation()} // Prevents click propagation on the BottomBar
        >
          <BottomIconOptionsBar />
        </Box>
      )}
    </Card>
  );
};

export default NoteItem;
