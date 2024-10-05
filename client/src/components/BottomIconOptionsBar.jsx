import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Checkbox,
  ListItemText,
  Portal,
  Button,
} from "@mui/material";
import NotificationAddOutlinedIcon from "@mui/icons-material/NotificationAddOutlined";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import ColorLensOutlinedIcon from "@mui/icons-material/ColorLensOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import UnarchiveRoundedIcon from "@mui/icons-material/UnarchiveRounded";
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined"; // Icon for labels
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedColor,
  setSelectedIcon,
  toggleTrash,
  toggleArchive,
  removeNoteLabel,
  addNoteLabel,
} from "../pages/notes/NotesSlice";
import BackgroundOptions from "./BackgroundOptions";
import ReminderInput from "./ReminderInput"; // Assuming ReminderInput is in the same folder

const BottomIconOptionsBar = (props) => {
  const [open, setOpen] = useState(false);
  const [reminderOpen, setReminderOpen] = useState(false); // New state for reminder
  const [selectedColor, setSelectedColorState] = useState(null);
  const [selectedIcon, setSelectedIconState] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [moreOptionsAnchorEl, setMoreOptionsAnchorEl] = useState(null); // For More Options Menu
  const [labelsAnchorEl, setLabelsAnchorEl] = useState(null); // Anchor for label menu
  const [selectedLabels, setSelectedLabels] = useState([...props.pLabels]); // State for selected labels

  const labels = useSelector((state) => state.notes.labels); // Selector for labels
  const dispatch = useDispatch();
  const portalRef = useRef(null);

  const handleColorLensClick = (event) => {
    setOpen(true);
    setAnchorEl(event.currentTarget);
  };

  const handleReminderClick = (event) => {
    setReminderOpen(true);
    setAnchorEl(event.currentTarget); // Set the anchor element for positioning
  };

  const handleReminderClose = () => {
    setReminderOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
    setAnchorEl(null);
  };

  const handleColorClick = (color) => {
    setSelectedColorState(color);
    dispatch(setSelectedColor(color));
  };

  const handleIconClick = (icon) => {
    setSelectedIconState(icon);
    dispatch(setSelectedIcon(icon));
  };

  const handleMoreOptionsClick = (event) => {
    setMoreOptionsAnchorEl(event.currentTarget);
  };

  const handleMoreOptionsClose = () => {
    setMoreOptionsAnchorEl(null);
  };

  const handleDeleteNote = () => {
    dispatch(toggleTrash(props.noteId));
    handleMoreOptionsClose();
  };

  const handleToggleArchiveNote = () => {
    dispatch(toggleArchive(props.noteId));
  };

  const handleLabelsClick = (event) => {
    setLabelsAnchorEl(event.currentTarget); // Open menu
  };

  const handleLabelsClose = () => {
    setLabelsAnchorEl(null); // Close menu
  };

  const handleLabelToggle = (labelId) => {
    // Toggle label selection without closing the menu
    const currentIndex = selectedLabels.indexOf(labelId);
    const newSelectedLabels = [...selectedLabels];

    if (currentIndex === -1) {
      newSelectedLabels.push(labelId); // Add label if not selected
    } else {
      newSelectedLabels.splice(currentIndex, 1); // Remove label if selected
    }

    setSelectedLabels(newSelectedLabels); // Update state without closing the menu
  };

  const handleDoneClick = () => {
    // Labels that are in props.pLabels but not in newSelectedLabels (i.e., deleted labels)
    const deletedLabels = props.pLabels.filter(
      (label) => !selectedLabels.includes(label)
    );

    // Labels that are in newSelectedLabels but not in props.pLabels (i.e., inserted labels)
    const insertedLabels = selectedLabels.filter(
      (label) => !props.pLabels.includes(label)
    );

    // Dispatch actions if there are any deleted or inserted labels
    if (deletedLabels.length) {
      dispatch(removeNoteLabel({ note_id: props.noteId, label_ids: deletedLabels }));
    }

    if (insertedLabels.length) {
      dispatch(addNoteLabel({ note_id: props.noteId, label_ids: insertedLabels }));
    }

    // Close the label menu when "Done" is clicked
    handleLabelsClose();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        portalRef.current &&
        !portalRef.current.contains(event.target) &&
        anchorEl &&
        !anchorEl.contains(event.target)
      ) {
        handleClose();
        handleReminderClose(); // Close reminder if clicked outside
      }
    };

    if (open || reminderOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dispatch, open, reminderOpen, anchorEl]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        width: "250px",
        marginLeft: "-10px",
      }}
    >
      {/* Tooltips and Icon Buttons for different actions */}
      <Tooltip title="Add Reminder">
        <IconButton onClick={handleReminderClick}>
          <NotificationAddOutlinedIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Collaborate">
        <IconButton>
          <GroupAddOutlinedIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Change Color">
        <IconButton onClick={handleColorLensClick}>
          <ColorLensOutlinedIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Add Image">
        <IconButton>
          <ImageOutlinedIcon />
        </IconButton>
      </Tooltip>

      {props.archive ? (
        <Tooltip title="Unarchive">
          <IconButton onClick={handleToggleArchiveNote}>
            <UnarchiveRoundedIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Archive">
          <IconButton onClick={handleToggleArchiveNote}>
            <ArchiveOutlinedIcon />
          </IconButton>
        </Tooltip>
      )}

      <Tooltip title="Select Labels">
        <IconButton onClick={handleLabelsClick}>
          <LabelOutlinedIcon />
        </IconButton>
      </Tooltip>

      {/* Label Menu */}
      <Menu
        anchorEl={labelsAnchorEl}
        open={Boolean(labelsAnchorEl)}
        onClose={handleLabelsClose}
      >
        {labels.map((label) => (
          <MenuItem key={label.id} onClick={() => handleLabelToggle(label.id)}>
            <Checkbox checked={selectedLabels.includes(label.id)} />
            <ListItemText primary={label.name} />
          </MenuItem>
        ))}
        <MenuItem>
          <Button onClick={handleDoneClick}>Done</Button>
        </MenuItem>
      </Menu>

      <Tooltip title="More Options">
        <IconButton onClick={handleMoreOptionsClick}>
          <MoreVertOutlinedIcon />
        </IconButton>
      </Tooltip>

      {/* More Options Menu */}
      <Menu
        anchorEl={moreOptionsAnchorEl}
        open={Boolean(moreOptionsAnchorEl)}
        onClose={handleMoreOptionsClose}
      >
        <MenuItem onClick={handleDeleteNote}>Delete Note</MenuItem>
      </Menu>

      {/* Color Options Portal */}
      {open && (
        <Portal>
          <Box
            ref={portalRef}
            sx={{
              position: "absolute",
              top: anchorEl ? anchorEl.getBoundingClientRect().bottom : 0,
              left: anchorEl ? anchorEl.getBoundingClientRect().left : 0,
              width: "500px",
              borderRadius: 2,
              zIndex: 1300,
            }}
          >
            <BackgroundOptions
              selectedColor={selectedColor}
              selectedIcon={selectedIcon}
              handleColorClick={handleColorClick}
              handleIconClick={handleIconClick}
            />
          </Box>
        </Portal>
      )}

      {/* Reminder Input Portal */}
      {reminderOpen && (
        <Portal>
          <Box
            ref={portalRef}
            sx={{
              position: "absolute",
              top: anchorEl ? anchorEl.getBoundingClientRect().bottom : 0,
              left: anchorEl ? anchorEl.getBoundingClientRect().left : 0,
              width: "300px",
              borderRadius: 2,
              zIndex: 1300,
            }}
          >
            <ReminderInput
              onClose={handleReminderClose}
              noteId={props.noteId}
            />
          </Box>
        </Portal>
      )}
    </Box>
  );
};

export default BottomIconOptionsBar;