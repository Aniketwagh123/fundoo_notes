// SignUpForm.jsx
import React from "react";
import PropTypes from "prop-types";
import styles from "./SignUp.module.scss";

const SignUpForm = ({
  formData,
  loading,
  error,
  onChange,
  onSubmit,
  showPassword,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <div className={styles.row}>
        <div className={styles.column}>
          <div className={styles.inputs}>
            <input
              type="text"
              name="firstName"
              required
              onChange={onChange}
              className={styles.input}
              placeholder=" "
            />
            <label className={styles.inputLabel}>First Name*</label>
          </div>
        </div>
        <div className={styles.column}>
          <div className={styles.inputs}>
            <input
              type="text"
              name="lastName"
              required
              onChange={onChange}
              className={styles.input}
              placeholder=" "
            />
            <label className={styles.inputLabel}>Last Name*</label>
          </div>
        </div>
      </div>
      <div className={styles.inputs}>
        <input
          type="text"
          name="username"
          required
          onChange={onChange}
          className={styles.input}
          placeholder=" "
        />
        <label className={styles.inputLabel}>Username*</label>
        <small>You can use letters, numbers & periods</small>
        <a href="#" className={styles.linkBtn}>
          Use my current email instead
        </a>
      </div>
      <div className={styles.row}>
        <div className={styles.column}>
          <div className={styles.inputs}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              onChange={onChange}
              className={styles.input}
              placeholder=" "
            />
            <label className={styles.inputLabel}>Password*</label>
          </div>
        </div>
        <div className={styles.column}>
          <div className={styles.inputs}>
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              required
              onChange={onChange}
              className={styles.input}
              placeholder=" "
            />
            <label className={styles.inputLabel}>Confirm*</label>
          </div>
        </div>
      </div>
      <p>
        Use 8 or more characters with a mix of letters, numbers & symbols
      </p>
      <div className={styles.checkbox}>
        <input
          type="checkbox"
          name="showPassword"
          onChange={onChange}
        />
        <label>Show Password</label>
      </div>
      {error && <p className={styles.errorMsg}>{error}</p>} {/* Display error */}
      <div className={styles.btnGroup}>
        <a href="#" className={styles.linkBtn}>
          Sign in instead
        </a>
        <button type="submit" className={styles.nextBtn} disabled={loading}>
          {loading ? 'Loading...' : 'Next'}
        </button>
      </div>
    </form>
  );
};

// Prop types validation
SignUpForm.propTypes = {
  formData: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  showPassword: PropTypes.bool.isRequired,
};

export default SignUpForm;
