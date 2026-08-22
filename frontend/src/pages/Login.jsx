import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
} from "react-icons/fi";

import "./Auth.css";

import { notifyError, notifySuccess } from "../utils/toast";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
  });

  const { email, password } = inputValue;

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
        `${import.meta.env.VITE_API_URL}/login`,
        inputValue,
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        notifySuccess("Logged in successfully");

        setTimeout(() => {
          navigate("/");
        }, 700);
      } else {
        notifyError(data.message || "Something went wrong");
      }
    } catch (error) {
      notifyError(
        error.response?.data?.message || "Unable to login. Please try again."
      );
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

          <span className="auth-brand-name">
            Job Tracker
          </span>
        </div>

        {/* Heading */}
        <div className="auth-heading">
          <h1>Welcome back</h1>

          <p>
            Sign in to continue managing your job applications.
          </p>
        </div>

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit}>

          {/* Email */}
          <div className="auth-field">
            <label htmlFor="login-email">
              Email address
            </label>

            <div className="auth-input-wrapper">
              <FiMail className="auth-input-icon" />

              <input
                id="login-email"
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
            <label htmlFor="login-password">
              Password
            </label>

            <div className="auth-input-wrapper">
              <FiLock className="auth-input-icon" />

              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                placeholder="Enter your password"
                onChange={handleOnChange}
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="auth-password-toggle"
                onClick={() =>
                  setShowPassword((prev) => !prev)
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="auth-submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="auth-spinner" />
                Signing in...
              </>
            ) : (
              <>
                Sign in
                <FiArrowRight />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="auth-footer">
          <span>Don't have an account?</span>

          <Link to="/signup">
            Create an account
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;