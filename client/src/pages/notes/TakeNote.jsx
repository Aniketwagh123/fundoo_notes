import { useState, useRef, useEffect } from "react";
import { TextField, Box, Paper, Button } from "@mui/material";
import PushPinRoundedIcon from "@mui/icons-material/PushPinRounded";
import PushPinOutlined from "@mui/icons-material/PushPinOutlined";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import BrushOutlinedIcon from "@mui/icons-material/BrushOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import BottomIconOptionsBar from "./BottomIconOptionsBar";

const ExpandableNote = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [titleText, setTitleText] = useState("");
  const noteRef = useRef(null);
  const [isPin, setIsPin] = useState();

  const handleExpand = () => setIsExpanded(true);

  const handleShrink = (e) => {
    if (noteRef.current && !noteRef.current.contains(e.target)) {
      setIsExpanded(false);
    }
  };

  useEffect(() => {
    if (isExpanded) {
      document.addEventListener("mousedown", handleShrink);
    }
    return () => {
      document.removeEventListener("mousedown", handleShrink);
    };
  }, [isExpanded]);

  return (
    <Paper
      elevation={3}
      ref={noteRef}
      sx={{
        width: "700px",
        height: isExpanded ? "auto" : "auto",
        paddingBlock: "8px",
        paddingInline: "16px",
        borderRadius: "8px",
        transition: "width 0.3s ease",
        display: "flex",
        flexDirection: "column",
      }}
      onClick={!isExpanded ? handleExpand : undefined}
    >
      <Box sx={{ display: "flex", alignItems: "center", height: "40px" }}>
        <TextField
          fullWidth
          multiline
          placeholder={isExpanded ? "Title" : "Take a note..."}
          variant="standard"
          value={titleText}
          onChange={(e) => setTitleText(e.target.value)}
          slotProps={{
            input: {
              disableUnderline: true,
              style: { fontSize: "1.25rem", fontWeight: "bold" },
            },
            inputLabel: { style: { color: "red" } },
          }}
          sx={{
            "& .MuiInputBase-input::placeholder": {
              color: !isExpanded ? "black" : "gray",
              fontSize: "16px",
              letterSpacing: "9",
              opacity: 1,
            },
          }}
        />
        {isExpanded &&
          (isPin ? (
            <PushPinRoundedIcon
              onClick={() => {
                setIsPin(!isPin);
              }}
            />
          ) : (
            <PushPinOutlined
              onClick={() => {
                setIsPin(!isPin);
              }}
            />
          ))}
        {!isExpanded && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "200px",
            }}
          >
            <CheckBoxOutlinedIcon />
            <BrushOutlinedIcon />
            <ImageOutlinedIcon />
          </Box>
        )}
      </Box>

      {isExpanded && (
        <>
          <TextField
            fullWidth
            placeholder="Take a note..."
            multiline
            variant="standard"
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            slotProps={{
              input: {
                disableUnderline: true,
                style: { fontSize: "1rem", overflowWrap: "break-word" },
              },
            }}
            sx={{
              mb: 2,
              maxHeight: "50vh",
              transition: "max-height 0.3s ease",
              overflow: "auto",
            }}
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* Use the new IconOptions component */}
            <BottomIconOptionsBar />
            <Button
              color="inhitit"
              onClick={() => {
                setIsExpanded(false);
              }}
            >
              Close
            </Button>
          </Box>
        </>
      )}
    </Paper>
  );
};

export default ExpandableNote;
