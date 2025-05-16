import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Axios from "../utils/Axios.utils";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosTostError.utils";
import { useLocation, useNavigate } from "react-router-dom";

const OtpVerification = () => {
  const [data, setData] = useState(["", "", "", "", "", ""]);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [timer, setTimer] = useState(30);
  const navigate = useNavigate();
  const inputRef = useRef([]);
  const location = useLocation();
  const email = location?.state?.email;

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  const isOtpComplete = data.every((el) => el);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios({
        ...SummaryApi.otpVerify,
        data: {
          otp: data.join(""),
          email,
        },
      });

      if (response.data.error) {
        toast.error(response.data.message);
        return;
      }

      toast.success(response.data.message);
      setData(["", "", "", "", "", ""]);
      navigate("/reset-password", {
        state: { data: response.data, email },
      });
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const handleResendOtp = async () => {
    try {
      setIsResendDisabled(true);
      setTimer(30); // Reset timer
      const response = await Axios({
        ...SummaryApi.resendOtp,
        data: { email },
      });

      if (response.data.success) {
        toast.success("OTP sent successfully!");
      } else {
        toast.error(response.data.message);
      }

      // Countdown timer
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            setIsResendDisabled(false);
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      AxiosToastError(error);
      setIsResendDisabled(false);
    }
  };

  return (
    <section className="w-full container mx-auto px-2">
      <div className="bg-white my-4 w-full max-w-lg mx-auto rounded p-7">
        <p className="font-semibold text-lg text-center">Enter OTP</p>
        <p className="text-gray-600 text-center mt-2">
          A 6-digit OTP has been sent to your email.
        </p>

        <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
          <div className="flex justify-center gap-2">
            {data.map((element, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={data[index]}
                onChange={(e) => {
                  const value = e.target.value;
                  if (!/^\d?$/.test(value)) return;

                  const newData = [...data];
                  newData[index] = value;
                  setData(newData);

                  if (value && index < 5) {
                    inputRef.current[index + 1]?.focus();
                  }
                }}
                ref={(el) => (inputRef.current[index] = el)}
                className="bg-blue-50 w-12 h-12 p-2 border rounded text-center text-lg font-semibold focus:border-green-500 outline-none"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={!isOtpComplete}
            className={`w-full text-white py-2 rounded font-semibold tracking-wide transition ${
              isOtpComplete
                ? "bg-green-700 hover:bg-green-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Verify OTP
          </button>
        </form>

        <p className="text-center text-sm">
          Didn't receive the code?{" "}
          <button
            onClick={handleResendOtp}
            disabled={isResendDisabled}
            className={`font-semibold ${
              isResendDisabled ? "text-gray-500 cursor-not-allowed" : "text-green-700 hover:underline"
            }`}
          >
            Resend OTP {isResendDisabled && `(${timer}s)`}
          </button>
        </p>
      </div>
    </section>
  );
};

export default OtpVerification;
