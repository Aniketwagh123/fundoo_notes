import { useState } from "react";
import styles from "./SignIn.module.scss";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
    // Add your login logic here
  };

  return (
    <div className={styles.container}>
      <div className={styles.topContent}>
        <img
          src="https://i.postimg.cc/CL7CmGSx/google-logo-png-29530.png"
          alt="Google Logo"
        />
        <h2>Sign in</h2>
        <p className={styles.heading}>Use your Google Account</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className={styles.inputs}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            required
            placeholder=" " 
          />
          <label htmlFor="email" className={styles.inputLabel}>
            Email or phone*
          </label>
        </div>
        <div className={styles.inputs}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required
            placeholder=" " 
          />
          <label htmlFor="password" className={styles.inputLabel}>
            Password*
          </label>
        </div>
        <a href="#" className={styles.linkBtn}>
          Forgot Password?
        </a>
        <div className={styles.btnGroup}>
          <button type="button" className={styles.createBtn}>
            Create account
          </button>
          <button type="submit" className={styles.loginBtn}>
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
