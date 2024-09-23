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
  const [errors, setError] = useState({}); // State for handling errors
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

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError({ confirmPassword: "Passwords do not match!" });
      return;
    }

    setLoading(true);
    setError({}); // Reset errors

    try {
      const result = await signup(
        formData.username,
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName
      );

      if (result.status === "success") {
        navigate("/login"); // Redirect on success
      } else if (result.status === "error") {
        const errorMessages = result.errors || {};
        console.log(errorMessages);
        setError({
          email: errorMessages.errors.email?.join(", "),
          username: errorMessages.errors.username?.join(", "),
          password: errorMessages.errors.password?.join(", "),
          confirmPassword:
            formData.password !== formData.confirmPassword
              ? "Passwords do not match!"
              : "",
        });
      } else {
        setError({
          general: result.message || "Registration failed. Please try again.",
        });
      }
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError({
        general: "An unexpected error occurred. Please try again later.",
      });
    }

    setLoading(false);
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
      <div className={styles.row}>
        <SignUpForm
          formData={formData}
          loading={loading}
          errors={errors}
          onChange={handleChange}
          onSubmit={handleSubmit}
          showPassword={formData.showPassword}
        />

        <div className={styles.imageContainer}>
          <img src="signup.png" alt="Signup" className={styles.signupImage} />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
