// NoNotes.jsx
import { Box } from "@mui/material";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";

const NoNotes = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        flexDirection: "column",
        height: "70vh",
        opacity: 0.5,
        fontSize: "25px",
      }}
    >
      <LightbulbOutlinedIcon
        sx={{
          width: "auto",
          height: "30%",
        }}
      />
      <span>Notes you add appear here</span>
    </Box>
  );
};

export default NoNotes;
