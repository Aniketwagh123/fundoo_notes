import axios from "axios";
import { getAccessToken } from "./authServices"; // Assuming you have an authService that handles tokens

const API_URL = "http://localhost:8000/api/"; // Update with your actual API URL

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
  const response = await axiosInstance.get("notes/");
  //   console.log(`???${JSON.stringify(response.data)}`);
  return response.data;
};

// Get archived notes
const getArchivedNotes = async () => {
  const response = await axiosInstance.get("notes/archived/");
  return response.data;
};

// Get trashed notes
const getTrashedNotes = async () => {
  const response = await axiosInstance.get("notes/trashed/");
  //   console.log(response.data)
  return response.data;
};

// Create a new note
const createNote = async (noteData) => {
  console.log("AAAA>>>??????");

  const response = await axiosInstance.post("notes/", noteData);
  console.log(`??...>,<,.${JSON.stringify(response.data)}`);
  return response.data;
};

// Update a note
const updateNote = async (id, noteData) => {
  const response = await axiosInstance.put(`notes/${id}/`, noteData);
  return response.data;
};

// Toggle archive status
const toggleArchive = async (id) => {
  const response = await axiosInstance.patch(`notes/${id}/is_archive/`);
  return response.data;
};

// Toggle trash status
const toggleTrash = async (id) => {
  const response = await axiosInstance.patch(`notes/${id}/is_trash/`);
  return response.data;
};

// Delete a note
const deleteNote = async (id) => {
  const response = await axiosInstance.delete(`notes/${id}/`);
  console.log(`aaqq ${JSON.stringify(response)}`);

  return response.data;
};

// Add collaborators
const addCollaborators = async (collaboratorData) => {
  const response = await axiosInstance.post(
    "notes/add_collaborators/",
    collaboratorData
  );
  return response.data;
};

// Remove collaborators
const removeCollaborators = async (collaboratorData) => {
  const response = await axiosInstance.post(
    "notes/remove_collaborators/",
    collaboratorData
  );
  return response.data;
};

// Add labels
const addLabel = async (labelData) => {
  const response = await axiosInstance.post("labels/", labelData);
  return response;
};

// Remove labels
const removeLabel = async (id) => {
  const response = await axiosInstance.delete(`labels/${id}/`);
  return response;
};

// get all labels
const getAllLabels = async () => {
  const response = await axiosInstance.get("labels/");
  return response;
};

// Add labels
const addNoteLabel = async (note_id, label_ids) => {
  const response = await axiosInstance.post("notes/add_labels/", {
    note_id: note_id,
    label_ids: label_ids,
  });
  return response;
};

// Remove labels
const removeNoteLabel = async (note_id, label_ids) => {
  const response = await axiosInstance.post("notes/remove_labels/", {
    note_id: note_id,
    label_ids: label_ids,
  });
  return response;
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
  addLabel,
  removeLabel,
  getAllLabels,
  addNoteLabel,
  removeNoteLabel,
};

export default noteService;
