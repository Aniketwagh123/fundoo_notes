import { useState } from 'react';
import styles from './SignUp.module.scss';

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    confirmPassword: '',
    showPassword: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
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
      <form onSubmit={handleSubmit}>
        <div className={styles.row}>
          <div className={styles.column}>
            <div className={styles.inputs}>
              <input
                type="text"
                name="firstName"
                required
                onChange={handleChange}
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
                onChange={handleChange}
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
            onChange={handleChange}
            className={styles.input}
            placeholder=" "
          />
          <label className={styles.inputLabel}>Username*</label>
          <small>You can use letters, numbers & periods</small>
          <a href="#" className={styles.linkBtn}>Use my current email instead</a>
        </div>
        <div className={styles.row}>
          <div className={styles.column}>
            <div className={styles.inputs}>
              <input
                type={formData.showPassword ? 'text' : 'password'}
                name="password"
                required
                onChange={handleChange}
                className={styles.input}
                placeholder=" " 
              />
              <label className={styles.inputLabel}>Password*</label>
            </div>
          </div>
          <div className={styles.column}>
            <div className={styles.inputs}>
              <input
                type={formData.showPassword ? 'text' : 'password'}
                name="confirmPassword"
                required
                onChange={handleChange}
                className={styles.input}
                placeholder=" " 
              />
              <label className={styles.inputLabel}>Confirm*</label>
            </div>
          </div>
        </div>
        <p>Use 8 or more characters with a mix of letters, numbers & symbols</p>
        <div className={styles.checkbox}>
          <input
            type="checkbox"
            name="showPassword"
            onChange={handleChange}
          />
          <label>Show Password</label>
        </div>
        <div className={styles.btnGroup}>
          <a href="#" className={styles.linkBtn}>Sign in instead</a>
          <button type="submit" className={styles.nextBtn}>Next</button>
        </div>
      </form>
      <div className={styles.imageContainer}>
        <img src="signup.png" alt="Signup" className={styles.signupImage} />
      </div>
    </div>
  );
};

export default SignUp;
