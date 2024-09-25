// src/components/Notes.jsx
import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ImageList,
  ImageListItem,
} from "@mui/material";
import NoteItem from "./NoteItem";
import BottomIconOptionsBar from "./BottomIconOptionsBar";

const Notes = () => {
  const [open, setOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  const handleClickOpen = (note) => {
    setSelectedNote(note);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedNote(null);
  };
  const [notesData, setNotesData] = useState([
    {
      id: 1,
      title: "Comprehensive Project Overview",
      description:
        "This document provides an in-depth overview of the project, including its objectives, scope, and the timeline for execution. The project aims to address several key issues within the organization, focusing on enhancing efficiency, improving customer satisfaction, and increasing revenue. Throughout the project, various stages will be implemented, starting with an initial assessment phase to identify existing challenges and opportunities. Following this, a strategic planning phase will outline actionable steps and allocate resources appropriately. Team collaboration will be crucial during the execution phase, where progress will be monitored and adjustments made as necessary. A final review will capture lessons learned and best practices, ensuring the organization can benefit from this project for years to come. This comprehensive overview serves as a foundational document that will guide all stakeholders throughout the project lifecycle, emphasizing transparency and accountability.",
    },
    {
      id: 2,
      title: "Team Meeting Summary",
      description:
        "Key points from the meeting include timelines, action items, and responsible individuals.",
    },
    {
      id: 3,
      title: "Market Research Insights",
      description:
        "Our recent findings reveal a notable shift towards online platforms, necessitating immediate adjustments to our marketing strategies to stay competitive.",
    },
    {
      id: 4,
      title: "Design Phase Overview",
      description:
        "In the design phase, we will focus on user-centric approaches, ensuring that interfaces are intuitive and compliant with accessibility standards.",
    },
    {
      id: 5,
      title: "User Experience Feedback",
      description:
        "The feedback we gathered indicates that users are particularly keen on improved navigation and faster response times within our application interface.",
    },
    {
      id: 6,
      title: "Development Milestones",
      description:
        "We have established a clear timeline for development, outlining key milestones, deadlines, and responsible team members for each phase.",
    },
    {
      id: 7,
      title: "Risk Management Analysis",
      description:
        "Our risk assessment has identified several potential issues, including budget overruns and project delays; we have proposed mitigation strategies to address these.",
    },
    {
      id: 8,
      title: "Budget Allocation Summary",
      description:
        "A detailed budget has been prepared, highlighting expected costs across various departments and ensuring that resources are allocated efficiently.",
    },
    {
      id: 9,
      title: "Marketing Strategy Outline",
      description:
        "Our marketing strategy will leverage digital channels to increase brand visibility and engagement with our target audience over the next quarter.",
    },
    {
      id: 10,
      title: "Final Project Report",
      description:
        "This conclusive report summarizes the project's outcomes, challenges encountered, and provides actionable recommendations for future initiatives based on the insights gained.",
    },
  ]);

  return (
    <Box sx={{ width: "100%", paddingBlock: "30px", paddingInline: "10%" }}>
      <ImageList variant="masonry" cols={4} gap={16}>
        {notesData.map((item) => (
          <ImageListItem key={item.id} onClick={() => handleClickOpen(item)}>
            <NoteItem item={item} />
          </ImageListItem>
        ))}
      </ImageList>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{selectedNote?.title}</DialogTitle>
        <DialogContent>
          <p>{selectedNote?.description}</p>
        </DialogContent>
        
        <Box sx={{marginLeft:"20px", display:"flex", justifyContent:"space-between"}}>
          <BottomIconOptionsBar />
          <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default Notes;
