import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Axios from "../utils/Axios.utils";
import SummaryApi from "../common/SummaryApi";
import AxiosTostError from "../utils/AxiosTostError.utils";

const ForgotPassword = () => {
  const [data, setData] = useState({ email: "" });
  const navigate = useNavigate();

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  // Check if Form is Valid
  const isFormValid = Object.values(data).every(el => el)

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await Axios({
        ...SummaryApi.forgotPassword,
        data: data,
      });

      if (response.data.error) {
        toast.error(response.data.message);
        return;
      }

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/otp-verification",{
          state: data
        }); // Redirect to otp-verification page
        setData({ email: "" });
      }
    } catch (error) {
      AxiosTostError(error);
    }
  };

  return (
    <section className="w-full container mx-auto px-2">
      <div className="bg-white my-10 w-full max-w-md mx-auto rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-semibold text-center">
          Reset Your Password
        </h2>
        <p className="text-gray-600 text-center mt-2">
          Enter your registered email to receive a reset link.
        </p>

        <form className="grid gap-4 mt-6" onSubmit={handleSubmit}>
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
              value={data.email}
              onChange={handleChange}
            />
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
              Send Reset Link
            </button>
          </div>
        </form>

        {/* Navigation to Login */}
        <p className="text-center">
          Remembered your password?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-500 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </section>
  );
};

export default ForgotPassword;
