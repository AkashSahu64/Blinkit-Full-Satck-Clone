import React, { useState } from "react";
import { useSelector } from "react-redux";
import AddAddress from "../components/AddAddress";
import { MdDelete, MdEdit } from "react-icons/md";
import EditAddressDetail from "../components/EditAddressDetail";
import Axios from "../utils/Axios.utils";
import SummaryApi from "../common/SummaryApi";
import AxiosTostError from "../utils/AxiosTostError.utils";
import toast from "react-hot-toast";
import { useGlobalContext } from "../provider/GlobalProvider";

const Address = () => {
  const addressList = useSelector((state) => state.addresses.addressList);
  const [openAddress, setOpenAddress] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({});
  const {fetchAddress} = useGlobalContext()

  const handleDeleteAddress = async (id) => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteAddress,
        data: {
          _id: id
        }
      })
      if(response.data.success){
        toast.success("Address deleted successfully");
        if(fetchAddress){
          fetchAddress()
        }
      }
    } catch (error) {
      AxiosTostError(error)
    }
  }

  return (
    <div>
      <div className="bg-white shadow-lg px-2 py-2 flex items-center justify-between gap-4">
        <h2 className="font-semibold text-ellipsis line-clamp-1">Address</h2>
        <button
          className="border border-primary-200 text-primary-200 px-2 py-1 rounded hover:bg-primary-200 hover:text-white transition-all duration-300"
          onClick={() => setOpenAddress(true)}
        >
          Add Address
        </button>
      </div>
      <div className="bg-blue-50 p-2 grid gap-4">
        {addressList.map((address, index) => {
          return (
            <div key={index} className={`border rounded p-3 flex gap-4 bg-white ${!address.state ? "hidden" : ""}`}>
              <div className="w-full">
                <h3 className="font-semibold">{address.address_line}</h3>
                <p>
                  {address.city}, {address.state}
                </p>
                <p>
                  {address.country} - {address.pincode}
                </p>
                <p>{address.mobile}</p>
              </div>
              <div className="grid gap-10">
                <button
                  onClick={() => {
                    setOpenEdit(true);
                    setEditData(address);
                  }}
                  className="bg-green-200 p-1 rounded hover:text-white hover:bg-green-600"
                >
                  <MdEdit size={20} />
                </button>
                <button onClick={() => handleDeleteAddress(address._id)} className="bg-red-200 p-1 rounded hover:text-white hover:bg-red-600">
                  <MdDelete size={20} />
                </button>
              </div>
            </div>
          );
        })}
        <div
          onClick={() => setOpenAddress(true)}
          className="h-16 bg-blue-50 border-2 border-dashed flex items-center justify-center cursor-pointer"
        >
          Add address
        </div>
      </div>
      {openAddress && <AddAddress close={() => setOpenAddress(false)} />}

      {openEdit && <EditAddressDetail data={editData} close={() => setOpenEdit(false)} />}
    </div>
  );
};

export default Address;
