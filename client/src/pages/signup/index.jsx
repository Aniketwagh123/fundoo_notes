// SignUp.jsx
import { useState } from "react";
import styles from "./SignUp.module.scss";
import { signup } from "../../services/authServices"; // Assuming the service is correctly imported
import { useNavigate } from "react-router-dom";
import SignUpForm from "./SignUpForm"; // Import the new form component

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    showPassword: false,
  });
  const [loading, setLoading] = useState(false); // Loading state to manage spinner
  const [error, setError] = useState(null); // State for handling errors
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true); // Start loading
    setError(null); // Reset error state

    const result = await signup(
      formData.username,
      formData.username, // Using username for email
      formData.password,
      formData.firstName,
      formData.lastName
    );
    setLoading(false); // Stop loading

    if (result.status === "success") {
      navigate("/login"); // Redirect to login after successful signup
    } else {
      setError(result.errors); // Display error message
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.topContent}>
        <img
          src="https://i.postimg.cc/CL7CmGSx/google-logo-png-29530.png"
          alt="Google Logo"
          className={styles.logo}
        />
        <h2>Create your Google Account</h2>
      </div>
      {loading && (
        <div className={styles.loader}>
          <h1>Loading...</h1>
        </div>
      )}
      {!loading && (
        <SignUpForm
          formData={formData}
          loading={loading}
          error={error}
          onChange={handleChange}
          onSubmit={handleSubmit}
          showPassword={formData.showPassword}
        />
      )}
      <div className={styles.imageContainer}>
        <img src="signup.png" alt="Signup" className={styles.signupImage} />
      </div>
    </div>
  );
};

export default SignUp;
