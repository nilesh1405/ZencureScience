import React from "react";
import Button from "../components/common/Button.jsx";
import Loader from "../components/common/Loader.jsx";
import coverPhoto from "../assets/images/coverPhoto.jpg";
import companyLogo from "../assets/images/companyLogo.jpeg";
import { useState } from "react";
import { api } from "../lib/axios.js";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
} from "../store/authSlice.js";
import { showError, showSuccess } from "../lib/toast.js";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector((state) => state.auth.isLoading);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(loginStart());

      const response = await api.post("/auth/login", {
        username,
        password,
      });
      showSuccess("Login Successfull");
      dispatch(loginSuccess(response.data));
      navigate("/DashBoard");
    } catch (error) {
      dispatch(loginFailure(error.response?.data?.message || error.message));
      showError(error.response?.data?.message);
    }
  };

  const handleShowPassword = () => {
    const passwordInput = document.getElementById("password");
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
    } else {
      passwordInput.type = "password";
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gray-100 p-4">
      <div className="w-full max-w-5xl bg-gray-200 flex flex-col md:flex-row rounded-lg shadow-md overflow-hidden">
        <img
          src={coverPhoto}
          alt="coverPhoto"
          className="hidden md:block md:w-1/2 h-64 md:h-auto object-cover"
        />

        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 sm:p-8">
          <img
            src={companyLogo}
            alt="logo"
            className="mb-4 h-14 w-14 sm:h-16 sm:w-16"
          />

          <form
            onSubmit={handleSubmit}
            className="flex flex-col w-full max-w-md"
          >
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                User Name
              </label>

              <input
                type="text"
                className="mt-1 w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>

              <div className="flex items-center gap-3">
                <input
                  type="password"
                  id="password"
                  className="mt-1 w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  onChange={(e) => setPassword(e.target.value)}
                />

                <input
                  type="checkbox"
                  id="showPassword"
                  className="mt-1 h-5 w-5"
                  onChange={handleShowPassword}
                />
              </div>
            </div>

            <div className="flex justify-center mt-4">
              {isLoading ? (
                <Loader />
              ) : (
                <Button text="Login" onClick={handleSubmit} />
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
