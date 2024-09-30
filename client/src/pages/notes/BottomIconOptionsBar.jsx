import { useState, useEffect, useRef } from "react";
import { Box, IconButton, Portal, Tooltip } from "@mui/material";
import NotificationAddOutlinedIcon from "@mui/icons-material/NotificationAddOutlined";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import ColorLensOutlinedIcon from "@mui/icons-material/ColorLensOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import { useDispatch } from "react-redux";
import { setSelectedColor, setSelectedIcon } from "./NotesSlice";
import BackgroundOptions from "./BackgroundOptions";

const BottomIconOptionsBar = () => {
  const [open, setOpen] = useState(false);
  const [selectedColor, setSelectedColorState] = useState(null);
  const [selectedIcon, setSelectedIconState] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const portalRef = useRef(null);

  const dispatch = useDispatch();

  const handleColorLensClick = (event) => {
    setOpen(true);
    setAnchorEl(event.currentTarget);
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
    console.log(`this is selected color ${icon}`);
    setSelectedIconState(icon);
    dispatch(setSelectedIcon(icon));
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
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, anchorEl]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        width: "250px",
        marginLeft: "-10px",
      }}
    >
      <Tooltip title="Add Reminder">
        <IconButton>
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
      <Tooltip title="Archive">
        <IconButton>
          <ArchiveOutlinedIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="More Options">
        <IconButton>
          <MoreVertOutlinedIcon />
        </IconButton>
      </Tooltip>

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
    </Box>
  );
};

export default BottomIconOptionsBar;
