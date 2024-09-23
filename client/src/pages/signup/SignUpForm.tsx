// SignUpForm.jsx
import React from "react";
import PropTypes from "prop-types";
import { TextField, CircularProgress, Backdrop } from "@mui/material";
import styles from "./SignUp.module.scss";

const SignUpForm = ({
  formData,
  loading,
  errors, // Accept the errors prop
  onChange,
  onSubmit,
  showPassword,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <div className={styles.inputs}>
        <div className={styles.row}>
          <div className={styles.column}>
            <TextField
              variant="outlined"
              type="text"
              name="firstName"
              onChange={onChange}
              className={styles.input}
              disabled={loading}
              value={formData.firstName}
              label="First Name"
              fullWidth
              error={!!errors.firstName}
              helperText={errors.firstName}
            />
          </div>
          <div className={styles.column}>
            <TextField
              variant="outlined"
              type="text"
              name="lastName"
              onChange={onChange}
              className={styles.input}
              disabled={loading}
              value={formData.lastName}
              label="Last Name"
              fullWidth
              error={!!errors.lastName}
              helperText={errors.lastName}
            />
          </div>
        </div>
      </div>
      <div className={styles.inputs}>
        <TextField
          variant="outlined"
          type="email"
          name="email"
          required
          onChange={onChange}
          className={styles.input}
          disabled={loading}
          value={formData.email}
          label="Email"
          fullWidth
          error={!!errors.email}
          helperText={errors.email}
        />
      </div>
      <div className={styles.inputs}>
        <TextField
          variant="outlined"
          type="text"
          name="username"
          required
          onChange={onChange}
          className={styles.input}
          value={formData.username}
          disabled={loading}
          label="Username"
          fullWidth
          helperText={
            errors.username || "You can use letters, numbers & periods"
          }
          error={!!errors.username}
        />
      </div>

      <div className={styles.row}>
        <div className={styles.column}>
          <TextField
            variant="outlined"
            type={showPassword ? "text" : "password"}
            name="password"
            required
            onChange={onChange}
            className={styles.input}
            disabled={loading}
            value={formData.password}
            label="Password"
            fullWidth
            error={!!errors.password}
            helperText={
              errors.password ||
              "Use 8 or more characters with a mix of letters, numbers & symbols"
            }
          />
        </div>
        <div className={styles.column}>
          <TextField
            variant="outlined"
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            required
            onChange={onChange}
            className={styles.input}
            disabled={loading}
            value={formData.confirmPassword}
            label="Confirm Password"
            fullWidth
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
          />
        </div>
      </div>

      <div className={styles.checkbox}>
        <input type="checkbox" name="showPassword" onChange={onChange} />
        <label>Show Password</label>
      </div>

      {Object.values(errors).length > 0 && (
        <p className={styles.errorMsg}>Please fix the errors above.</p>
      )}

      {errors.general && <p className={styles.errorMsg}>{errors.general}</p>}

      <div className={styles.btnGroup}>
        <a href="#" className={styles.linkBtn}>
          Sign in instead
        </a>
        <button type="submit" className={styles.nextBtn} disabled={loading}>
          Next
        </button>
        <Backdrop
          sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    </form>
  );
};

// Prop types validation
SignUpForm.propTypes = {
  formData: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  errors: PropTypes.object, // Updated prop types to include errors
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  showPassword: PropTypes.bool.isRequired,
};

export default SignUpForm;
