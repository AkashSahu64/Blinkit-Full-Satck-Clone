import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/Axios.utils";
import AxiosTostError from "../utils/AxiosTostError.utils";
import { toast } from "react-hot-toast";
import { FaRegUserCircle } from "react-icons/fa";
import { updatedAvatar } from "../store/userSlice";
import {IoClose} from "react-icons/io5"

const UserProfileAvatarEdit = ({close}) => {
  const user = useSelector((state) => state?.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleUploadAvatarImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if file size is larger than 2MB
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      toast.error("File size should be less than 2MB");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.uploadAvatar,
        data: formData,
      });
      const { data: responseData } = response;
      dispatch(updatedAvatar(responseData.data.avatar));
      if (response.data.success) {
        toast.success(response.data.message);
        setLoading(false);
      }
    } catch (error) {
      AxiosTostError(error);
      setLoading(false);
    }
  };

  return (
    <section className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 max-w-sm w-full rounded-lg flex flex-col items-center gap-4">
        <button onClick={close} className=" text-neutral-800 w-fit block ml-auto">
          <IoClose size={20}/>
        </button>
        <div className="w-20 h-20 bg-red-400 rounded-full flex items-center justify-center overflow-hidden">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <FaRegUserCircle size={65} />
          )}
        </div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="uploadProfile">
            <div className="text-sm min-w-20 border border-primary-100 hover:border-primary-200 hover:bg-primary-200 px-3 py-1 rounded-full items-center cursor-pointer">
              {
                loading ? "Loading..." : "Upload"
              }
            </div>
          </label>
          <input
            onChange={handleUploadAvatarImage}
            type="file"
            id="uploadProfile"
            className="hidden"
          />
        </form>
      </div>
    </section>
  );
};

export default UserProfileAvatarEdit;
