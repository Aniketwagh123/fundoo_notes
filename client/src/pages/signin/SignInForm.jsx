// SignInForm.jsx
import PropTypes from "prop-types";
import styles from "./SignIn.module.scss";

const SignInForm = ({ email, password, loading, error, onEmailChange, onPasswordChange, onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <div className={styles.inputs}>
        <input
          type="email"
          value={email}
          onChange={onEmailChange}
          className={styles.input}
          required
          placeholder=" "
          disabled={loading} // Disable input when loading
        />
        <label htmlFor="email" className={styles.inputLabel}>
          Email or phone*
        </label>
      </div>
      <div className={styles.inputs}>
        <input
          type="password"
          value={password}
          onChange={onPasswordChange}
          className={styles.input}
          required
          placeholder=" "
          disabled={loading} // Disable input when loading
        />
        <label htmlFor="password" className={styles.inputLabel}>
          Password*
        </label>
      </div>
      <a href="#" className={styles.linkBtn}>
        Forgot Password?
      </a>
      {error && <p className={styles.errorMsg}>{error}</p>} {/* Display error */}
      <div className={styles.btnGroup}>
        <button type="button" className={styles.createBtn} disabled={loading}>
          Create account
        </button>
        <button type="submit" className={styles.loginBtn} disabled={loading}>
          {loading ? 'Logging in...' : 'Login'} {/* Change button text when loading */}
        </button>
      </div>
    </form>
  );
};

// Define prop types
SignInForm.propTypes = {
  email: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  onEmailChange: PropTypes.func.isRequired,
  onPasswordChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default SignInForm;
