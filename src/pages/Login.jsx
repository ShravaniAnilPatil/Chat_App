import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/login.module.css";
import { AuthContext } from "../context/AuthContext";
import Loginimg from "../images/login.png";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  // Real-time validation
  const validateField = (name, value) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case "email":
        if (!value) {
          newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = "Invalid email format";
        } else {
          delete newErrors.email;
        }
        break;
        
      case "password":
        if (!value) {
          newErrors.password = "Password is required";
        } else if (value.length < 8) {
          newErrors.password = "Password must be 8+ characters";
        } else {
          delete newErrors.password;
        }
        break;
        
      default:
        break;
    }
    
    setErrors(newErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
    validateField(name, value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Final validation check
    validateField("email", email);
    validateField("password", password);
    
    if (Object.keys(errors).length > 0) return;
    
    try {
      // Existing API call remains unchanged
      const response = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        login({ email: data.email });
        localStorage.setItem("authToken", data.authToken);
        setShowPopup(true);
        navigate('/recivers');
        setTimeout(() => setShowPopup(false), 3000);
      } else {
        setErrors({ api: data.message || "Login failed" });
      }
    } catch (error) {
      setErrors({ api: "Network error. Please try again." });
    }
  };

  return (
    <div className={styles.login}>
      <div className={styles["login-box"]}>
        <div className={styles["left-side"]}>
          <h2>Welcome Back!</h2>
          <p>Log in to continue accessing your account and Chat</p>
          <img src={Loginimg} alt="Login" style={{ maxWidth: "300px", marginBottom: "20px" }} />
        </div>
        
        <div className={styles["right-side"]}>
          <h2>Sign In</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles["input-group"]}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleChange}
                className={errors.email ? styles["error-input"] : ""}
              />
              {errors.email && <span className={styles["error-text"]}>{errors.email}</span>}
            </div>
            
            <div className={styles["input-group"]}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={handleChange}
                className={errors.password ? styles["error-input"] : ""}
              />
              {errors.password && <span className={styles["error-text"]}>{errors.password}</span>}
            </div>
            
            <button 
              type="submit" 
              className={styles["login-button"]}
              disabled={Object.keys(errors).length > 0 || !email || !password}
            >
              Sign In
            </button>
          </form>
          
          {errors.api && <p className={styles["error-message"]}>{errors.api}</p>}
          
          <div className={styles["signup-link"]}>
            <p>New user? <Link to="/signup">Sign up</Link></p>
          </div>
        </div>
      </div>
      
      {showPopup && (
        <div className={styles["popup"]}>
          <h2>Login Successful!</h2>
          <p>Redirecting...</p>
        </div>
      )}
    </div>
  );
};

export default Login;