import React, { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import NotificationAddOutlinedIcon from '@mui/icons-material/NotificationAddOutlined';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import ColorLensOutlinedIcon from '@mui/icons-material/ColorLensOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import ArchiveOutlined from '@mui/icons-material/ArchiveOutlined';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import BackgroundOptions from './BackgroundOptions';

const BottomIconOptionsBar = () => {
  const [open, setOpen] = useState(false);

  const handleColorLensClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '250px',
        marginLeft: '-10px',
        position: 'relative', // Make the parent Box position relative
      }}
    >
      <IconButton>
        <NotificationAddOutlinedIcon sx={{ width: '20px', height: 'auto', color: 'black', opacity: 0.7 }} />
      </IconButton>
      <IconButton>
        <GroupAddOutlinedIcon sx={{ width: '20px', height: 'auto', color: 'black', opacity: 0.7 }} />
      </IconButton>
      <IconButton onClick={handleColorLensClick}>
        <ColorLensOutlinedIcon sx={{ width: '20px', height: 'auto', color: 'black', opacity: 0.7 }} />
      </IconButton>
      <IconButton>
        <ImageOutlinedIcon sx={{ width: '20px', height: 'auto', color: 'black', opacity: 0.7 }} />
      </IconButton>
      <IconButton>
        <ArchiveOutlined sx={{ width: '20px', height: 'auto', color: 'black', opacity: 0.7 }} />
      </IconButton>
      <IconButton>
        <MoreVertOutlinedIcon sx={{ width: '20px', height: 'auto', color: 'black', opacity: 0.7 }} />
      </IconButton>

      {/* Detached Box for Background Options */}
      {open && (
        <Box
          sx={{
            position: 'absolute',
            top: '-60px', // Adjust this value to position the box below the Color Lens icon
            // left: '120%',
            transform: 'translateX(16%)',
            // backgroundColor: 'white', // Change as needed
            // boxShadow: 3, // Optional: adds shadow for better visibility
            borderRadius: 2, // Optional: rounds corners
            zIndex: 1300, // Ensures it's above other content
            // padding: 2, // Optional: adds padding inside the box
          }}
        >
          <BackgroundOptions onClose={handleClose} />
          {/* <IconButton onClick={handleClose} sx={{ position: 'absolute', top: 8, right: 8 }}>
            Close
          </IconButton> */}
        </Box>
      )}
    </Box>
  );
};

export default BottomIconOptionsBar;
