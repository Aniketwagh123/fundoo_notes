import React, { useState } from "react";
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
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";

function BackgroundOptions() {
  // Updated colors array with color name and value
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

  const iconImages = [
    {
      name: "blanck",
      value:
        "/image.png",
    },
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

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedIcon, setSelectedIcon] = useState(null); // state for selected icon

  const handleColorClick = (color) => {
    setSelectedColor(color);
  };

  const handleIconClick = (icon) => {
    setSelectedIcon(icon);
  };

  return (
    <Card
      elevation={3}
      sx={{ marginBlock: "100px", padding: 2, borderRadius: 3 }}
    >
      {/* Avatar group */}
      <Box display="flex" gap={1}>
        {pickColors.map((colorObj, index) => (
          <Tooltip placement="bottom" arrow key={index} title={colorObj.name}>
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
              ></Card>
            </Badge>
          </Tooltip>
        ))}
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Grid layout for icons */}
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
                    // marginInline:"5px"
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
}

export default BackgroundOptions;
