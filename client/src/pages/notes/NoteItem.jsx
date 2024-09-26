// NoteItem.jsx
import { useState } from "react";
import { alpha, Box, Card, Typography } from "@mui/material";
import ReactMarkdown from "react-markdown";
import BottomIconOptionsBar from "./BottomIconOptionsBar";

const NoteItem = ({ item }) => {
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
        // position: "relative",
        // width: "300px",
        maxWidth:"300px",
        background: `url(${item.image})`,

        // backgroundPosition: "center", // Optional: center the image
        backgroundRepeat: "no-repeat",
        backgroundBlendMode: "overlay",
        backgroundSize: "cover",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Typography variant="h6" style={{ lineHeight: "20px" }}>
        {item.title}{" "}
      </Typography>
      <Box height={15}></Box>
      {item.description}

      {isHovered && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            marginLeft: "-10px",
            marginTop: 2,
          }}
        >
          <BottomIconOptionsBar />
        </Box>
      )}
    </Card>
  );
};

export default NoteItem;
