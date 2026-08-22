import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
} from "react-icons/fi";

import "./Auth.css";

import { notifyError, notifySuccess } from "../utils/toast";

const Signup = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
    username: "",
  });

  const { email, password, username } = inputValue;

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setInputValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLoading) return;

    setIsLoading(true);

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/signup`,
        inputValue,
        {
          withCredentials: true,
        },
      );

      if (data.success) {
        notifySuccess(data.message || "Account created successfully");

        setInputValue({
          email: "",
          password: "",
          username: "",
        });

        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        notifyError(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Signup failed:", error);

      const errors = error.response?.data?.errors;

      if (errors) {
        const firstError = Object.values(errors)?.[0]?.[0];

        notifyError(firstError || "Please check your information.");
      } else {
        notifyError(
          error.response?.data?.message || "Failed to create account",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Brand */}
        <div className="auth-brand">
          <div className="auth-brand-mark">
            <span>J</span>
          </div>

          <span className="auth-brand-name">Job Tracker</span>
        </div>

        {/* Heading */}
        <div className="auth-heading">
          <h1>Create your account</h1>

          <p>Start organizing and tracking your job search.</p>
        </div>

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit}>
          {/* Username */}
          <div className="auth-field">
            <label htmlFor="signup-username">Username</label>

            <div className="auth-input-wrapper">
              <FiUser className="auth-input-icon" />

              <input
                id="signup-username"
                type="text"
                name="username"
                value={username}
                placeholder="Choose a username"
                onChange={handleOnChange}
                autoComplete="username"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="auth-field">
            <label htmlFor="signup-email">Email address</label>

            <div className="auth-input-wrapper">
              <FiMail className="auth-input-icon" />

              <input
                id="signup-email"
                type="email"
                name="email"
                value={email}
                placeholder="you@example.com"
                onChange={handleOnChange}
                autoComplete="email"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="auth-field">
            <label htmlFor="signup-password">Password</label>

            <div className="auth-input-wrapper">
              <FiLock className="auth-input-icon" />

              <input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                placeholder="Create a password"
                onChange={handleOnChange}
                autoComplete="new-password"
                required
              />

              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button type="submit" className="auth-submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="auth-spinner" />
                Creating account...
              </>
            ) : (
              <>
                Create account
                <FiArrowRight />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="auth-footer">
          <span>Already have an account?</span>

          <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
