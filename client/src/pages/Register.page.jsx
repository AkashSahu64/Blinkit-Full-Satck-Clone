import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import toast from "react-hot-toast";
import Axios from "../utils/Axios.utils";
import SummaryApi from "../common/SummaryApi";
import AxiosTostError from "../utils/AxiosTostError.utils";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // Handle Input Change
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Validate Form Fields
  const isFormValid = Object.values(formData).every((field) => field.trim() !== "");

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await Axios({
        ...SummaryApi.register,
        data: formData,
      });

      if (response.data.error) {
        toast.error(response.data.message);
        return;
      }

      if (response.data.success) {
        toast.success(response.data.message);
        setFormData({ name: "", email: "", password: "", confirmPassword: "" });
        navigate("/login");
      }
    } catch (error) {
      AxiosTostError(error);
    }
  };

  return (
    <section className="w-full container mx-auto px-2">
      <div className="bg-white my-4 w-full max-w-lg mx-auto rounded p-7 shadow-lg">
        <h2 className="text-2xl font-semibold text-center">Welcome to Blinkit</h2>
        <form className="grid gap-4 mt-6" onSubmit={handleSubmit}>
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block font-medium mb-1">
              Name:
            </label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Enter your name"
              className="w-full p-2 bg-gray-100 border border-gray-300 rounded outline-none focus:border-blue-400"
              value={formData.name}
              onChange={handleChange}
              autoFocus
            />
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block font-medium mb-1">
              Email:
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              className="w-full p-2 bg-gray-100 border border-gray-300 rounded outline-none focus:border-blue-400"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block font-medium mb-1">
              Password:
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="Enter your password"
                className="w-full p-2 bg-gray-100 border border-gray-300 rounded outline-none focus:border-blue-400 pr-10"
                value={formData.password}
                onChange={handleChange}
              />
              <div
                onClick={() => setShowPassword((prev) => !prev)}
                className="cursor-pointer absolute right-2 top-3"
              >
                {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </div>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="block font-medium mb-1">
              Confirm Password:
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Confirm your password"
                className="w-full p-2 bg-gray-100 border border-gray-300 rounded outline-none focus:border-blue-400 pr-10"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <div
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="cursor-pointer absolute right-2 top-3"
              >
                {showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-full text-white p-2 rounded font-semibold my-3 transition ${
                isFormValid
                  ? "bg-green-700 hover:bg-green-600"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Register
            </button>
          </div>
        </form>

        {/* Navigation to Login */}
        <p className="text-center">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")} className="text-blue-500 cursor-pointer">
            Login
          </span>
        </p>
      </div>
    </section>
  );
};

export default Register;
