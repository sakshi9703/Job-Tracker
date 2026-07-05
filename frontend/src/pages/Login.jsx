import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiBriefcase,
} from "react-icons/fi";

import "./Auth.css";

import { toast } from "react-toastify";
import { notifyError, notifySuccess } from "../utils/toast";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);

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

    setIsLoading(true);

    try {
      const { data } = await axios.post(
        "http://localhost:3000/login",
        inputValue,
        { withCredentials: true }
      );

      if (data.success) {
        notifySuccess("Logged in successfully");

        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        notifyError("Something went wrong");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }

    setInputValue({
      email: "",
      password: "",
    });
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="app-name">JobTracker</h2>

        <h1>Welcome Back</h1>

        <p className="auth-subtitle">
          Sign in to continue tracking your applications.
        </p>

        <form onSubmit={handleSubmit}>
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
              placeholder="Enter your password"
              onChange={handleOnChange}
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() =>
                setShowPassword((prev) => !prev)
              }
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
                />

                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account?

          <Link to="/signup"> Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;