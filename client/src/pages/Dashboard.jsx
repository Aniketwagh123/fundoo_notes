import Logout from "../components/Logout";
import TextField from "@mui/material/TextField";

const Dashboard = () => {
  return (
    <>
      <div>
        <h1>Dashboard</h1>
      </div>
      <Logout />
      <TextField
        error
        id="outlined-error-helper-text"
        label="Error"
        defaultValue="Hello World"
        helperText="Incorrect entry."
      />
    </>
  );
};

export default Dashboard;
