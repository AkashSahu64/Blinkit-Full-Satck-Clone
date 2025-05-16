import React, { useEffect, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";
import Axios from "../utils/Axios.utils";
import SummaryApi from "../common/SummaryApi";
import AxiosTostError from "../utils/AxiosTostError.utils";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    newpassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmShowPassword] = useState(false);

  // Check if Form is Valid
  const isFormValid = Object.values(data).every((el) => el);

  useEffect(() => {
    if (!location?.state?.data?.success) {
      navigate("/");
    }

    if (location?.state?.email) {
      setData((prev) => {
        return {
          ...prev,
          email: location?.state?.email,
        };
      });
    }
  }, []);

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
 
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (data.newpassword !== data.confirmPassword) {
      toast.error("Password does not match");
      return;
    }

    try {
      const response = await Axios({
        ...SummaryApi.resetPassword,
        data: data,
      });

      if (response.data.error) {
        toast.error(response.data.message);
        return;
      }

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/login"); // Redirect to login page
        setData({
          email: "",
          newpassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      AxiosTostError(error);
    }
  };

  return (
    <section className="w-full container mx-auto px-2">
      <div className="bg-white my-10 w-full max-w-md mx-auto rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-semibold text-center">
          Reset Your New Password
        </h2>

        <form className="grid gap-4 mt-6" onSubmit={handleSubmit}>
          {/* Email Field */}
          <div>
            <div>
              <label htmlFor="newpassword" className="block font-medium mb-1">
                New Password:
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="newpassword"
                  id="password"
                  placeholder="Enter your new password"
                  className="w-full p-2 bg-gray-100 border border-gray-300 rounded outline-none focus:border-blue-400 pr-10"
                  value={data.newpassword}
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

            <div>
              <label
                htmlFor="confirmPassword" className="block font-medium mb-1"
              >
                Confirm Password:
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder="Enter your confirm password"
                  className="w-full p-2 bg-gray-100 border border-gray-300 rounded outline-none focus:border-blue-400 pr-10"
                  value={data.confirmPassword}
                  onChange={handleChange}
                />
                <div
                  onClick={() => setConfirmShowPassword((prev) => !prev)}
                  className="cursor-pointer absolute right-2 top-3"
                >
                  {showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                </div>
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
              Reset Password
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

export default ResetPassword;
