// SignInForm.jsx
import PropTypes from "prop-types";
import { TextField, Button, CircularProgress, Backdrop } from "@mui/material";
import styles from "./SignIn.module.scss";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";

const SignInForm = ({
  email,
  password,
  loading,
  error,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}) => {
  const navigate = useNavigate();

  const emailError =
    error?.status === "error" && error.message.includes("Invalid email");
  const passwordError =
    error?.status === "error" &&
    error.message.includes("Invalid email or password");
  const notVerified =
    error?.status === "error" && error.message.includes("User is not verified");

  return (
    <form onSubmit={onSubmit}>
      {notVerified && (
        <Alert severity="error">
          Please verify your email address first before proceeding.
        </Alert>
      )}

      <TextField
        error={emailError}
        id="email"
        label="Email or phone"
        value={email}
        onChange={onEmailChange}
        helperText={emailError ? error.message : ""}
        required
        disabled={loading}
        fullWidth
        margin="normal"
      />
      <TextField
        error={passwordError}
        id="password"
        label="Password"
        type="password"
        value={password}
        onChange={onPasswordChange}
        helperText={passwordError ? error.message : ""}
        required
        disabled={loading}
        fullWidth
        margin="normal"
      />
      <a href="#" className={styles.linkBtn}>
        Forgot Password?
      </a>
      <div className={styles.btnGroup}>
        <Button
          variant="outlined"
          disabled={loading}
          onClick={() => {
            navigate("/signup");
          }}
        >
          Create account
        </Button>
        <Backdrop
          sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <Button type="submit" variant="contained" disabled={loading}>
          Login
        </Button>
      </div>
    </form>
  );
};

// Define prop types
SignInForm.propTypes = {
  email: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.object, // Update to expect an object
  onEmailChange: PropTypes.func.isRequired,
  onPasswordChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default SignInForm;
