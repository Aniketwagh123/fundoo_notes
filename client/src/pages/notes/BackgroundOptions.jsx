// notes/BackgroundOptions.jsx
import { useState } from "react";
import {
  Avatar,
  Badge,
  Box,
  Card,
  Divider,
  Grid,
  Tooltip,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check"; // MUI check icon for the tick
import { useDispatch } from "react-redux";
import { setSelectedColor, setSelectedIcon } from "./NotesSlice";

const BackgroundOptions = () => {
  // Array of colors with names and values
  const pickColors = [
    { name: "White", value: "#ffffff" },
    { name: "Light Pink", value: "#faafa8" },
    { name: "Peach", value: "#f39f76" },
    { name: "Light Yellow", value: "#fff8b8" },
    { name: "Mint Green", value: "#e2f6d3" },
    { name: "Light Teal", value: "#b4ddd3" },
    { name: "Light Blue", value: "#d4e4ed" },
    { name: "Sky Blue", value: "#aeccdc" },
    { name: "Lavender", value: "#d3bfdb" },
    { name: "Light Coral", value: "#f6e2dd" },
    { name: "Beige", value: "#e9e3d4" },
    { name: "Light Gray", value: "#efeff1" },
  ];

  // Array of icons with names and image URLs
  const iconImages = [
    { name: "Blank", value: "/image.png" },
    {
      name: "Grocery",
      value:
        "https://www.gstatic.com/keep/backgrounds/grocery_light_thumb_0615.svg",
    },
    {
      name: "Food",
      value:
        "https://www.gstatic.com/keep/backgrounds/food_light_thumb_0615.svg",
    },
    {
      name: "Music",
      value:
        "https://www.gstatic.com/keep/backgrounds/music_light_thumb_0615.svg",
    },
    {
      name: "Recipe",
      value:
        "https://www.gstatic.com/keep/backgrounds/recipe_light_thumb_0615.svg",
    },
    {
      name: "Notes",
      value:
        "https://www.gstatic.com/keep/backgrounds/notes_light_thumb_0615.svg",
    },
    {
      name: "Places",
      value:
        "https://www.gstatic.com/keep/backgrounds/places_light_thumb_0615.svg",
    },
    {
      name: "Travel",
      value:
        "https://www.gstatic.com/keep/backgrounds/travel_light_thumb_0615.svg",
    },
    {
      name: "Video",
      value:
        "https://www.gstatic.com/keep/backgrounds/video_light_thumb_0615.svg",
    },
    {
      name: "Celebration",
      value:
        "https://www.gstatic.com/keep/backgrounds/celebration_light_thumb_0715.svg",
    },
    // ... more images
  ];

  const [selectedColor, setSelectedColorState] = useState(null);
  const [selectedIcon, setSelectedIconState] = useState(null); // State for selected icon

  const dispatch = useDispatch(); // Initialize the useDispatch hook

  // Handle color selection
  const handleColorClick = (color) => {
    console.log("Color clicked:", color);
    setSelectedColorState(color);
    dispatch(setSelectedColor(color)); // Dispatch selected color to Redux
  };

  // Handle icon selection
  const handleIconClick = (icon) => {
    console.log(icon);
    
    setSelectedIconState(icon);
    dispatch(setSelectedIcon(icon));
  };

  return (
    <Card
      elevation={3}
      sx={{ marginBlock: "100px", padding: 2, borderRadius: 3 }}
    >
      {/* Color selection section */}
      <Box display="flex" gap={1}>
        {pickColors.map((colorObj, index) => (
          <Tooltip key={index} placement="bottom" arrow title={colorObj.name}>
            <Badge
              badgeContent={
                selectedColor === colorObj.value ? (
                  <CheckIcon sx={{ fontSize: 16 }} />
                ) : null
              }
              color="secondary"
              overlap="circular"
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <Card
                onClick={() => handleColorClick(colorObj.value)}
                sx={{
                  backgroundColor: colorObj.value,
                  width: 32,
                  height: 32,
                  borderRadius: 20,
                  cursor: "pointer",
                  border:
                    selectedColor === colorObj.value
                      ? "2px solid purple"
                      : "none",
                }}
              />
            </Badge>
          </Tooltip>
        ))}
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Icon selection section */}
      <Grid container spacing={6}>
        {iconImages.map((iconObj, index) => (
          <Grid item xs={1} key={index}>
            <Tooltip placement="bottom" arrow title={iconObj.name}>
              <Badge
                badgeContent={
                  selectedIcon === iconObj.value ? (
                    <CheckIcon sx={{ fontSize: 16 }} />
                  ) : null
                }
                color="secondary"
                overlap="circular"
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <Card
                  onClick={() => handleIconClick(iconObj.value)}
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    cursor: "pointer",
                    border:
                      selectedIcon === iconObj.value
                        ? "2px solid purple"
                        : "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Avatar src={iconObj.value} sx={{ width: 50, height: 50 }} />
                </Card>
              </Badge>
            </Tooltip>
          </Grid>
        ))}
      </Grid>
    </Card>
  );
};

export default BackgroundOptions;
