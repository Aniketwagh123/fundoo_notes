import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import SignIn from "./components/auth/SignIn";
import NOT_FOUND_404 from "./components/Error/NOT_FOUND_404";
import SignUp from "./components/auth/SignUp";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h1>dashboard</h1>} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/404" element={<NOT_FOUND_404 />} />
        <Route path="*" element={<Navigate to="/404" />} />
      </Routes>
    </Router>
  );
}

export default App;
