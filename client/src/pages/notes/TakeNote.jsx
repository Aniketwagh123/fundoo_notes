// notes/TakeNote.jsx
import { useState, useRef, useEffect } from "react";
import { TextField, Box, Paper, Button } from "@mui/material";
import PushPinRoundedIcon from "@mui/icons-material/PushPinRounded";
import PushPinOutlined from "@mui/icons-material/PushPinOutlined";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import BrushOutlinedIcon from "@mui/icons-material/BrushOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import BottomIconOptionsBar from "./BottomIconOptionsBar";
import { useDispatch, useSelector } from "react-redux";
import { addNewNote as addNote } from "./NotesSlice"; // Adjust the path as necessary

const ExpandableNote = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [titleText, setTitleText] = useState("");
  const noteRef = useRef(null);
  const [isPin, setIsPin] = useState();
  const dispatch = useDispatch(); // Initialize the useDispatch hook

  const handleExpand = () => setIsExpanded(true);
  const selectedColor = useSelector((state) => state.notes.selectedColor);

  const selectedIcon = useSelector((state) => state.notes.selectedIcon);

  const handleShrink = (e) => {
    // console.log(`${titleText},... ${noteText}`);
    if (noteRef.current && !noteRef.current.contains(e.target)) {
      console.log(`${titleText}, ${noteText}`);
      if (titleText || noteText) {
        dispatch(addNote({ title: titleText, description: noteText }));
      }
      setIsExpanded(false);
      setNoteText("");
      setTitleText("");
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
        background: `url(${selectedIcon})`,
        backgroundSize: "cover", // Optional: cover the whole area
        backgroundPosition: "center", // Optional: center the image
        backgroundRepeat: "no-repeat", // Optional: prevent the image from repeating
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
          onChange={(e) => {
            const newValue = e.target.value;
            setTitleText(newValue);
          }}
          slotProps={{
            input: {
              disableUnderline: true,
              style: { fontSize: "1.25rem", fontWeight: "bold" },
            },
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
                style: {
                  fontSize: "1rem",
                  overflowWrap: "break-word",
                },
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
            <BottomIconOptionsBar />

            <Button
              color="inhitit"
              onClick={() => {
                // Dispatch addNote when the Close button is clicked
                if (titleText || noteText) {
                  dispatch(
                    addNote({
                      title: titleText,
                      description: noteText,
                      image: selectedIcon,
                      color: selectedColor,
                    })
                  );
                }
                setIsExpanded(false);
                setNoteText(""); // Optionally clear note text
                setTitleText(""); // Optionally clear title text
              }}
            >
              Save
            </Button>
          </Box>
        </>
      )}
    </Paper>
  );
};

export default ExpandableNote;
