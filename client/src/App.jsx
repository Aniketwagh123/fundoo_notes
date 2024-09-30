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
import TrashPage from "./pages/trash/TrashPage";
import ArchivePage from "./pages/archive/ArchivePage";
import { Provider } from "react-redux";
import store from "./app/Store";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Link,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <h1>Welcome</h1>
        <Link to="/login">Login</Link>
        <Link to="/signup">Sign Up</Link>
      </>
    ),
  },
  {
    path: "/login",
    element: <SignIn />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/404",
    element: <NOT_FOUND_404 />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true, // Default child route for /dashboard
        element: <NotePage />,
      },
      {
        path: "reminder",
        element: <ReminderPage />,
      },
      {
        path: "complete",
        element: <CompletePage />,
      },
      {
        path: "edit-labels",
        element: <EditLabelsPage />,
      },
      {
        path: "archive",
        element: <ArchivePage />,
      },
      {
        path: "trash",
        element: <TrashPage />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/404" />,
  },
]);

function AppRoutes() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

function App() {
  return <AppRoutes />;
}

export default App;
