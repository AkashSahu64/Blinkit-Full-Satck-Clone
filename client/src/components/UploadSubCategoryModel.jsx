import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import uploadImage from "../utils/UploadImage.utils";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { MdDeleteForever } from "react-icons/md";
import Axios from "../utils/Axios.utils";
import SummaryApi from "../common/SummaryApi";
import AxiosTostError from "../utils/AxiosTostError.utils";

const UploadSubCategoryModel = ({ close, fetchData }) => {
  const [subCategoryData, setSubCategoryData] = useState({
    name: "",
    image: "",
    category: [],
  });

  const allCategory = useSelector(state => state.product.allCategory);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubCategoryData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleUploadSubCategoryImage = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }

    const respose = await uploadImage(file);
    const { data: imageRespose } = respose;
    setSubCategoryData((pre) => {
      return {
        ...pre,
        image: imageRespose.data.url
      };
    });
  };

  const handleSubmitSubCategory = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios({
        ...SummaryApi.createSubCategory,
        data: subCategoryData,
      })

      const {data: responseData} = response;
      
      if(responseData.success) {
        toast.success(responseData.message);
        if(close){
          close();
        }
        if(fetchData) {
          fetchData();
        }
      }
    } catch (error) {
      AxiosTostError(error);
    }
  }

  return (
    <section className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
      <div className="w-full max-w-5xl bg-white p-4 rounded shadow-md">
        <div className="flex items-center justify-between gap-3">
          <h1 className="font-semibold">Add Sub Category</h1>
          <button onClick={close} className="w-fit block ml-auto">
            <IoClose size={25} />
          </button>
        </div>
        <form className="my-3 grid gap-3" onSubmit={handleSubmitSubCategory}>
          <div className="grid gap-1">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              value={subCategoryData.name}
              onChange={handleChange}
              className="p-2 bg-blue-50 border outline-none focus-within:border-primary-200 rounded"
              type="text"
              placeholder="Enter Sub Category Name"
            />
          </div>

          <div className="grid gap-1">
            <p>Image</p>
            <div className="flex flex-col gap-3 lg:flex-row items-center">
              <div className="border h-36 w-full lg:w-36 bg-blue-50 flex   items-center justify-center rounded">
                {!subCategoryData.image ? (
                  <p className="text-sm text-neutral-400">No Image Selected</p>
                ) : (
                  <img
                    src={subCategoryData.image}
                    alt="Sub Category"
                    className="h-full w-full object-scale-down"
                  />
                )}
              </div>
              <label htmlFor="uploadSubCategoryImage">
                <div className="px-4 py-1 border rounded border-primary-100 text-primary-200 hover:bg-primary-200 hover:text-neutral-900 transition-all cursor-pointer">
                  Upload Image
                </div>
              </label>
              <input
                id="uploadSubCategoryImage"
                name="image"
                onChange={handleUploadSubCategoryImage}
                type="file"
                className="hidden"
              />
            </div>
          </div>

          <div className="grid gap-1">
            <label>Select Category</label>
            <div className="border focus-within:border-primary-200 rounded">
                {
                    subCategoryData.category.map((cat, index) => {
                        return (
                            <div key={cat._id + "selected"} className="flex items-center justify-between p-2 border-b">
                                <p>{cat.name}</p>
                                <button
                                    onClick={() => {
                                        setSubCategoryData((prev) => {
                                            return {
                                                ...prev,
                                                category: prev.category.filter((el) => el._id !== cat._id),
                                            };
                                        });
                                    }}
                                    className="text-red-500"
                                >
                                    <MdDeleteForever size={25} />
                                </button>
                            </div>
                        );
                    })
                }
              <select
                onChange={(e) => {
                    const value = e.target.value;
                    const categoryDetails = allCategory.find(el => el._id == value);
                    setSubCategoryData((prev) => {
                      return {
                        ...prev,
                        category: [...prev.category, categoryDetails],
                      };
                    });
                }}
                className="p-2 w-full bg-transparent outline-none"
              >
                <option value="">Select Category</option>
                {allCategory.map((category, index) => (
                  <option
                    key={category._id + "subcategory"}
                    value={category?._id}
                  >
                    {category?.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button>
            <div className={`px-4 py-2 border
              ${subCategoryData?.name && subCategoryData?.image && subCategoryData?.category.length > 0 ? "bg-primary-200 hover:bg-primary-100 text-neutral-900" : "bg-neutral-200 text-neutral-400"}
              rounded border-primary-200 text-center font-semibold`
            }>
              Add Sub Category
            </div>
          </button>
        </form>
      </div>
    </section>
  );
};

export default UploadSubCategoryModel;
