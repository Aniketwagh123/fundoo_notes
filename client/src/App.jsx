import "./App.css";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layout/DashboardLayout";
import CompletePage from "./pages/complete/CompletePage";
import EditLabelsPage from "./pages/edit_labels/EditLabelsPage";
import NOT_FOUND_404 from "./pages/Error/NOT_FOUND_404"; // Ensure correct path and casing
import NotePage from "./pages/notes/NotePage";
import ReminderPage from "./pages/reminder/ReminderPage";
import SignIn from "./pages/signin/SignIn";
import SignUp from "./pages/signup/SignUp"; // Ensure correct path and casing
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import TrashPage from "./pages/trash/TrashPage";
import ArchivePage from "./pages/archive/ArchivePage";
import { Provider } from "react-redux";
import store from "./app/Store";
import noteService from "./services/notesService"
import { useEffect } from "react";

function AppRoutes() {
  useEffect(()=>{
    console.log(noteService.getNotes());
  },[])
  // console.log(getNotes())
  return (
    <Provider store={store}>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <h1>Welcome</h1>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign Up</Link>
            </>
          }
        />
        <Route path="/login" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />{" "}
        {/* Changed to lowercase */}
        <Route path="/404" element={<NOT_FOUND_404 />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<NotePage />} />
          <Route path="reminder" element={<ReminderPage />} />
          <Route path="complete" element={<CompletePage />} />
          <Route path="edit-labels" element={<EditLabelsPage />} />
          <Route path="archive" element={<ArchivePage />} />
          <Route path="trash" element={<TrashPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/404" />} />
      </Routes>
    </Provider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
