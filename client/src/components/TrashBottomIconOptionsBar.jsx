import { Box, IconButton, Tooltip } from "@mui/material";
import RestoreFromTrashRoundedIcon from "@mui/icons-material/RestoreFromTrashRounded";
import DeleteOutlineOutlined from "@mui/icons-material/DeleteOutlineOutlined";
import { useDispatch } from "react-redux";
import { toggleTrash, deleteNote } from "../pages/notes/NotesSlice";

const TrashBottomIconOptionsBar = (props) => {
  const dispatch = useDispatch();

  const handleRestoreNote = () => {
    // console.log(`Delete Note with id: ${props.noteId}`);
    dispatch(toggleTrash(props.noteId));
  };
  const handleDeleteNote = () => {
    // console.log(`Delete Note with id: ${props.noteId}`);
    dispatch(deleteNote(props.noteId));
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        width: "250px",
        marginLeft: "-10px",
      }}
    >
      <Tooltip title="Delete Forever">
        <IconButton onClick={handleDeleteNote}>
          <DeleteOutlineOutlined />
        </IconButton>
      </Tooltip>
      <Tooltip title="Collaborate">
        <IconButton onClick={handleRestoreNote}>
          <RestoreFromTrashRoundedIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default TrashBottomIconOptionsBar;
