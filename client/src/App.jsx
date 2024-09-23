import "./App.css";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/dashboard";
import NOT_FOUND_404 from "./pages/Error/NOT_FOUND_404"; // Ensure correct path and casing
import SignIn from "./pages/signin/SignIn";
import SignUp from "./pages/signup/SignUp"; // Ensure correct path and casing
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";

function AppRoutes() {
  return (
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
      <Route path="/signup" element={<SignUp />} /> {/* Changed to lowercase */}
      <Route path="/404" element={<NOT_FOUND_404 />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/404" />} />
    </Routes>
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
