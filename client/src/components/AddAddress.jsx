import React from "react";
import { useForm } from "react-hook-form";
import Axios from "../utils/Axios.utils";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import AxiosTostError from "../utils/AxiosTostError.utils";
import { IoClose } from "react-icons/io5";
import { useGlobalContext } from "../provider/GlobalProvider";

const AddAddress = ({close}) => {
  const { register, handleSubmit, reset } = useForm();
  const {fetchAddress} = useGlobalContext()

  const onSubmit = async (data) => {

    try {
      const response = await Axios({
        ...SummaryApi.createAddress,
        data: {
          address_line: data.addressLine,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
          country: data.country,
          mobile: data.mobile,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        if (close) {
          close();
          reset();
          fetchAddress()
        }
      }
    } catch (error) {
      AxiosTostError(error);
    }
  };

  return (
    <section className="bg-black fixed top-0 bottom-0 right-0 left-0 z-50 bg-opacity-70 h-screen overflow-auto">
      <div className="bg-white p-4 w-full max-w-lg mt-8 mx-auto rounded">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-semibold">Add Address</h2>
          <button onClick={close} className='hover:text-red-500'>
            <IoClose size={25}/>
          </button>
        </div>
        <form
          action=""
          className="mt-4 grid gap-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className=" grid gap-1">
            <label htmlFor="addressLine">Address Line: </label>
            <input
              type="text"
              id="addressLine"
              className="border bg-blue-50 p-2 rounded outline-primary-100"
              {...register("addressLine", { required: true })}
            />
          </div>
          <div className=" grid gap-1">
            <label htmlFor="city">City: </label>
            <input
              type="text"
              id="city"
              className="border bg-blue-50 p-2 rounded outline-primary-100"
              {...register("city", { required: true })}
            />
          </div>
          <div className=" grid gap-1">
            <label htmlFor="state">State: </label>
            <input
              type="text"
              id="state"
              className="border bg-blue-50 p-2 rounded outline-primary-100"
              {...register("state", { required: true })}
            />
          </div>
          <div className=" grid gap-1">
            <label htmlFor="pincode">Pin code: </label>
            <input
              type="text"
              id="pincode"
              className="border bg-blue-50 p-2 rounded outline-primary-100"
              {...register("pincode", { required: true })}
            />
          </div>
          <div className=" grid gap-1">
            <label htmlFor="country">Country: </label>
            <input
              type="text"
              id="country"
              className="border bg-blue-50 p-2 rounded outline-primary-100"
              {...register("country", { required: true })}
            />
          </div>
          <div className=" grid gap-1">
            <label htmlFor="mobile">Contact No.: </label>
            <input
              type="text"
              id="mobile"
              className="border bg-blue-50 p-2 rounded outline-primary-100"
              {...register("mobile", { required: true })}
            />
          </div>
          <button
            type="submit"
            className="bg-primary-200 w-full py-2 mt-4 font-semibold hover:bg-primary-100 rounded"
          >
            Submit
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddAddress;
