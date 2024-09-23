// SignIn.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SignIn.module.scss";
import { login } from "../../services/authServices";
import SignInForm from "./SignInForm"; // Import the new pure component

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ status: null, message: "" }); // Initialize error as an object
  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    setLoading(true);
    setError({ status: null, message: "" }); // Reset error

    const result = await login(email, password);
    setLoading(false);

    if (result.status === "success") {
      navigate("/dashboard");
    } else {
      const errorMessage =
        result.errors?.message || "An unknown error occurred";
      setError({
        status: result.status,
        message: errorMessage.includes("Invalid")
          ? "Invalid email or password"
          : errorMessage,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(email, password);
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

      <SignInForm
        email={email}
        password={password}
        loading={loading}
        error={error}
        onEmailChange={(e) => setEmail(e.target.value)}
        onPasswordChange={(e) => setPassword(e.target.value)}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default SignIn;
