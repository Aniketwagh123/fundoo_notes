import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { PhotoshopPicker } from "react-color"; // Import PhotoshopPicker from react-color
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllLabels, addLabel, removeLabel } from "../notes/NotesSlice"; // Adjust path if necessary

const EditLabelsPage = () => {
  const dispatch = useDispatch();

  // Fetch labels from Redux store
  const labels = useSelector((state) => state.notes.labels);
  const [newLabel, setNewLabel] = useState({ name: "", color: "#000" });
  const [editingLabelId, setEditingLabelId] = useState(null);
  const [colorPickerVisible, setColorPickerVisible] = useState(false);

  // Fetch all labels when the component mounts
  useEffect(() => {
    dispatch(fetchAllLabels());
    console.log(labels);
  }, [dispatch]);

  // Helper function to determine if the text should be black or white based on the background color
  const getTextColor = (bgColor) => {
    const color = bgColor.substring(1); // Remove "#"
    const r = parseInt(color.substr(0, 2), 16);
    const g = parseInt(color.substr(2, 2), 16);
    const b = parseInt(color.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? "#000" : "#fff"; // Return black for light colors and white for dark colors
  };

  // Handle adding a new label (API call)
  const handleAddLabel = () => {
    console.log(newLabel);
    
    if (newLabel.name.trim()) {
      dispatch(addLabel(newLabel)); // Dispatch addLabel action to Redux
      setNewLabel({ name: "", color: "#000" });
      setColorPickerVisible(false); // Hide color picker after adding the label
    }
  };

  // Handle deleting a label (API call)
  const handleDeleteLabel = (id) => {
    dispatch(removeLabel(id)); // Dispatch removeLabel action to Redux
  };

  // Handle color selection from PhotoshopPicker
  const handleColorChange = (color) => {
    setNewLabel({ ...newLabel, color: color.hex });
  };

  return (
    <Box
      sx={{
        padding: 2,
        maxWidth: 700,
        margin: "auto", // Centers horizontally
        display: "flex",
        flexDirection: "column",
        justifyContent: "center", // Centers vertically
        alignItems: "center", // Centers horizontally
      }}
    >
      <Typography variant="h6">Manage Labels</Typography>

      {/* List of Labels */}
      <div>
        <List>
          {labels?.length > 0 &&
            labels.map((label) => (
              <ListItem
                key={label.id}
                sx={{
                  backgroundColor: label.color,
                  borderRadius: 1,
                  mb: 1,
                  color: getTextColor(label.color), // Set text color dynamically
                }}
              >
                {editingLabelId === label.id ? (
                  <TextField
                    value={label.name}
                    onChange={(e) => {
                      dispatch(updateLabel({ id: label.id, name: e.target.value })); // Handle label update through Redux
                    }}
                    onBlur={() => setEditingLabelId(null)} // End editing on blur
                    size="small"
                    sx={{
                      input: {
                        color: getTextColor(label.color), // Adjust input text color
                      },
                    }}
                  />
                ) : (
                  <ListItemText primary={label.name} />
                )}
                <IconButton onClick={() => setEditingLabelId(label.id)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDeleteLabel(label.id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
        </List>

        {/* Add New Label */}
        <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
          <TextField
            label="New Label"
            value={newLabel.name}
            onChange={(e) => setNewLabel({ ...newLabel, name: e.target.value })}
            size="small"
          />

          {/* Color Picker */}
          <Box sx={{ ml: 2, position: "relative" }}>
            <Button
              variant="outlined"
              onClick={() => setColorPickerVisible(!colorPickerVisible)}
            >
              Pick Color
            </Button>
            {colorPickerVisible && (
              <Box sx={{ position: "absolute", zIndex: 2 }}>
                <PhotoshopPicker
                  color={newLabel.color}
                  onChangeComplete={handleColorChange} // Update color on final change
                  onAccept={handleAddLabel} // Save label on "OK" click
                  onCancel={() => setColorPickerVisible(false)} // Hide on cancel
                />
              </Box>
            )}
          </Box>

          <Button
            variant="contained"
            color="primary"
            onClick={handleAddLabel}
            sx={{ ml: 2 }}
            startIcon={<AddIcon />}
          >
            Add Label
          </Button>
        </Box>
      </div>
    </Box>
  );
};

export default EditLabelsPage;