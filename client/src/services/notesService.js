import axios from "axios";
import { getAccessToken } from "./authServices"; // Assuming you have an authService that handles tokens

const API_URL = "http://localhost:8000/api/notes/"; // Update with your actual API URL

// Set up axios with the token in the Authorization header
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${getAccessToken()}`, // Retrieve JWT token from local storage or other method
  },
});

// Get all notes
const getNotes = async () => {
  console.log(`???`);
  const response = await axiosInstance.get("/");
  //   console.log(`???${JSON.stringify(response.data)}`);
  return response.data;
};

// Get archived notes
const getArchivedNotes = async () => {
  const response = await axiosInstance.get("archived/");
  return response.data;
};

// Get trashed notes
const getTrashedNotes = async () => {
  const response = await axiosInstance.get("trashed/");
//   console.log(response.data)
  return response.data;
};

// Create a new note
const createNote = async (noteData) => {
  console.log("AAAA>>>??????");

  const response = await axiosInstance.post("/", noteData);
  console.log(`??...>,<,.${JSON.stringify(response.data)}`);
  return response.data;
};

// Update a note
const updateNote = async (id, noteData) => {
  const response = await axiosInstance.put(`${id}/`, noteData);
  return response.data;
};

// Toggle archive status
const toggleArchive = async (id) => {
  const response = await axiosInstance.patch(`${id}/is_archive/`);
  return response.data;
};

// Toggle trash status
const toggleTrash = async (id) => {
  const response = await axiosInstance.patch(`${id}/is_trash/`);
  return response.data;
};

// Delete a note
const deleteNote = async (id) => {
  const response = await axiosInstance.delete(`${id}/`);
  return response.data;
};

// Add collaborators
const addCollaborators = async (collaboratorData) => {
  const response = await axiosInstance.post(
    "add_collaborators/",
    collaboratorData
  );
  return response.data;
};

// Remove collaborators
const removeCollaborators = async (collaboratorData) => {
  const response = await axiosInstance.post(
    "remove_collaborators/",
    collaboratorData
  );
  return response.data;
};

// Add labels
const addLabels = async (labelData) => {
  const response = await axiosInstance.post("add_labels/", labelData);
  return response.data;
};

// Remove labels
const removeLabels = async (labelData) => {
  const response = await axiosInstance.post("remove_labels/", labelData);
  return response.data;
};


const noteService = {
  getNotes,
  getArchivedNotes,
  getTrashedNotes,
  createNote,
  updateNote,
  toggleArchive,
  toggleTrash,
  deleteNote,
  addCollaborators,
  removeCollaborators,
  addLabels,
  removeLabels,
};

export default noteService;
