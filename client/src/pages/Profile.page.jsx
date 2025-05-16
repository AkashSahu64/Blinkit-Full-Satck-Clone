import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaRegUserCircle } from "react-icons/fa";
import UserProfileAvatarEdit from "../components/UserProfileAvatarEdit";
import { FaEdit } from "react-icons/fa";
import Axios from "../utils/Axios.utils";
import SummaryApi from "../common/SummaryApi";
import AxiosTostError from "../utils/AxiosTostError.utils";
import toast from "react-hot-toast";
import { setUserDetails } from "../store/userSlice";
import fetchUserDetials from "../utils/FetchUserDetails.utils";

const Profile = () => {
  const user = useSelector((state) => state?.user);
  const [openEdit, setOpenEdit] = useState(false);
  const [userData, setUserData] = useState({
    name: user.name,
    email: user.email,
    mobile: user.mobile,
  });

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()

  useEffect(() => {
    setUserData({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
    });
  }, [user]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.updateUser,
        data: userData,
      });

      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        const UserData = await fetchUserDetials();
        if (UserData) {
          dispatch(setUserDetails(UserData.data));
        } else {
          toast.error("Error fetching user details");
        }
      }
    } catch (error) {
      AxiosTostError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      {/* profile upload and display image */}
      <div className="w-20 h-20 bg-green-400 rounded-full flex items-center justify-center overflow-hidden">
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
      <button
        onClick={() => setOpenEdit(true)}
        className="text-sm min-w-20 border border-primary-100 hover:border-primary-200 hover:bg-primary-200 px-3 py-1 mt-1 rounded-full"
      >
        Edit
      </button>
      {openEdit && <UserProfileAvatarEdit close={() => setOpenEdit(false)} />}

      {/*Edit--> name, email, contact, password */}
      <form className=" my-4 grid gap-4" onSubmit={handleSubmit}>
        <div className="grid">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            placeholder="Enter your name"
            className=" p-2 bg-blue-50 outline-none border focus-within:border-primary-200 rounded-md"
            value={userData.name}
            name="name"
            onChange={handleOnChange}
            required
          />
        </div>

        <div className="grid">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            className=" p-2 bg-blue-50 outline-none border focus-within:border-primary-200 rounded-md"
            value={userData.email}
            name="email"
            onChange={handleOnChange}
            required
          />
        </div>

        <div className="grid">
          <label htmlFor="mobile">Mobile</label>
          <input
            type="text"
            id="mobile"
            placeholder="Enter your mobile number"
            className=" p-2 bg-blue-50 outline-none border focus-within:border-primary-200 rounded-md"
            value={userData.mobile}
            name="mobile"
            onChange={handleOnChange}
            required
          />
        </div>

        <button className=" border px-4 py-2 font-semibold hover:bg-primary-100 border-primary-100 text-primary-200 hover:text-neutral-800 rounded-md">
          {loading ? "Loading..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
