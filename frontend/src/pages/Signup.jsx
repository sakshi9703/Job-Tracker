import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiBriefcase,
} from "react-icons/fi";

import "./Auth.css";

import { toast } from "react-toastify";
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

    setIsLoading(true);

    try {
      const { data } = await axios.post(
        "http://localhost:3000/signup",
        inputValue,
        { withCredentials: true }
      );

      if (data.success) {
        notifySuccess(data.message || "Account created successfully");

        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        notifyError(data.message || "Something went wrong");
      }
    } catch (error) {
      notifyError(
        error.response?.data?.message || "Failed to create account"
      );
    } finally {
      setIsLoading(false);
    }

    setInputValue({
      email: "",
      password: "",
      username: "",
    });
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <h2 className="app-name">JobTracker</h2>

        <h1>Create Account</h1>

        <p className="auth-subtitle">
          Start tracking your applications in one place.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <FiUser className="input-icon" />

            <input
              type="text"
              name="username"
              value={username}
              placeholder="Choose a username"
              onChange={handleOnChange}
              required
              className="form-input"
            />
          </div>

          <div className="input-wrapper">
            <FiMail className="input-icon" />

            <input
              type="email"
              name="email"
              value={email}
              placeholder="Enter your email"
              onChange={handleOnChange}
              required
            />
          </div>

          <div className="input-wrapper">
            <FiLock className="input-icon" />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              placeholder="Create a password"
              onChange={handleOnChange}
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          <button
            type="submit"
            className="auth-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?
          <Link to="/login"> Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;