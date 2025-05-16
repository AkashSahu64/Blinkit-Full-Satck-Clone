import React, { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from "../utils/UploadImage.utils";
import Loader from "../components/Loader";
import ViewImage from "../components/ViewImage";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { FaDeleteLeft } from "react-icons/fa6";
import AddFields from "../components/AddFields";
import Axios from "../utils/Axios.utils";
import SummaryApi from "../common/SummaryApi";
import AxiosTostError from "../utils/AxiosTostError.utils";
import successAlert from "../utils/SuccessAlert";
import { IoClose } from "react-icons/io5";

const EditProductAdmin = ({close, data: propsData, fetchProductData}) => {
  const [data, setData] = useState({
    _id: propsData._id,
    name: propsData.name,
    image: propsData.image,
    category: propsData.category,
    subCategory: propsData.subCategory,
    unit: propsData.unit,
    stock: propsData.stock,
    price: propsData.price,
    discount: propsData.discount,
    description: propsData.description,
    more_details: propsData.more_details || {},
  });
  const [loading, setLoading] = useState(false);
  const [viewImage, setViewImage] = useState("");
  const allCategory = useSelector((state) => state.product.allCategory);
  const [selectCategory, setSelectCategory] = useState("");
  const [selectSubCategory, setSelectSubCategory] = useState("");
  const allSubCategory = useSelector((state) => state.product.allSubCategory);
  const [openAddField, setOpenAddField] = useState(false);
  const [fieldName, setFieldName] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleOnUploadImage = async (e) => {
    const files = e.target.files[0];
    if (!files) return;
    setLoading(true);

    const response = await uploadImage(files);
    const { data: responseData } = response;
    const imageUrl = responseData.data.url;

    setData((prev) => {
      return {
        ...prev,
        image: [...prev.image, imageUrl],
      };
    });
    setLoading(false);
  };

  const handleDeleteImage = async (index) => {
    data.image.splice(index, 1);
    setData((prev) => {
      return {
        ...prev,
        image: [...data.image],
      };
    });
  };

  const handleRemoveCategory = (index) => {
    data.category.splice(index, 1);
    setData((prev) => {
      return {
        ...prev,
        category: [...data.category],
      };
    });
  };

  const handleRemoveSubCategory = (index) => {
    data.subCategory.splice(index, 1);
    setData((prev) => {
      return {
        ...prev,
        subCategory: [...data.subCategory],
      };
    });
  };

  const handleAddField = () => {
    if (!fieldName) return;
    setData((prev) => {
      return {
        ...prev,
        more_details: {
          ...prev.more_details,
          [fieldName]: "",
        },
      };
    });
    setFieldName("");
    setOpenAddField(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios({
        ...SummaryApi.updateProductDetails,
        data: data,
      });
      const { data: responseData } = response;
      if (responseData.success) {
        successAlert(responseData.message);
        if(close){
          close()
        }
        fetchProductData()
        setData({
          name: "",
          image: [],
          category: [],
          subCategory: [],
          unit: "",
          stock: "",
          price: "",
          discount: "",
          description: "",
          more_details: {},
        });
      }
    } catch (error) {
      AxiosTostError(error, "Failed to create product");
    }
  };

  return (
    <section className="fixed top-0 right-0 left-0 bottom-0 bg-black z-50 bg-opacity-70 p-4">
      <div className="bg-white w-full p-4 max-w-2xl mx-auto rounded overflow-y-auto h-full max-h-[95vh">
        <section>
          <div className=" p-2 bg-white shadow-md flex items-center justify-between">
            <h2 className=" font-semibold">Upload Product</h2>
            <button onClick={close}>
                <IoClose size={20} />
            </button>
          </div>
          <div className="grid p-3">
            <form className="grid gap-3" onSubmit={handleSubmit}>
              <div className="grid gap-1">
                <label htmlFor="name">Product Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter product name"
                  value={data.name}
                  onChange={handleChange}
                  required
                  className="bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded"
                />
              </div>
              <div className="grid gap-1">
                <label htmlFor="description">Product Description</label>
                <textarea
                  type="text"
                  id="description"
                  name="description"
                  placeholder="Enter product description"
                  value={data.description}
                  onChange={handleChange}
                  required
                  aria-multiline
                  rows={3}
                  className="bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded resize-none"
                />
              </div>
              <div>
                <p>Upload Image</p>
                <div>
                  <label
                    htmlFor="uploadImage"
                    className="bg-blue-50 h-24 border rounded flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-blue-100"
                  >
                    <div className="flex flex-col items-center justify-center cursor-pointer">
                      {loading ? (
                        <Loader />
                      ) : (
                        <>
                          <FaCloudUploadAlt size={35} title="Upload Image" />
                          <p>Upload Image</p>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      id="uploadImage"
                      name="image"
                      accept="image/*"
                      className="hidden"
                      onChange={handleOnUploadImage} // Function to handle image upload
                    />
                  </label>
                  {/* display image */}
                  <div className="flex flex-wrap gap-3">
                    {data.image.map((img, index) => {
                      return (
                        <div
                          key={index}
                          className="w-20 h-20 mt-1 min-w-20 bg-blue-50 border relative group"
                        >
                          <img
                            src={img}
                            alt={`Product Image ${index + 1}`}
                            className="w-full h-full object-scale-down cursor-pointer"
                            onClick={() => setViewImage(img)}
                          />
                          <div
                            className="absolute top-0 right-0 bg-red-100 p-1 rounded-full cursor-pointer hover:bg-red-200 hover:text-red-500 hidden group-hover:block"
                            onClick={() => handleDeleteImage(index)}
                          >
                            <MdDelete />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="grid gap-1">
                <label htmlFor="">Category</label>
                <div>
                  <select
                    className="bg-blue-50 border w-full p-2 rounded"
                    value={selectCategory}
                    onChange={(e) => {
                      const value = e.target.value;
                      const category = allCategory.find(
                        (el) => el._id === value
                      );

                      setData((prev) => {
                        return {
                          ...prev,
                          category: [...prev.category, category],
                        };
                      });
                      setSelectCategory("");
                    }}
                  >
                    <option value="">Select Category</option>
                    {allCategory.map((cat, index) => {
                      return (
                        <option key={index} value={cat?._id}>
                          {cat.name}
                        </option>
                      );
                    })}
                  </select>
                  <div className="flex flex-wrap gap-3">
                    {data.category.map((cat, index) => {
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-1 bg-blue-50 mt-2"
                        >
                          <p>{cat.name}</p>
                          <div
                            className="hover:text-red-400 cursor-pointer"
                            onClick={() => handleRemoveCategory(index)}
                          >
                            <FaDeleteLeft size={18} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="grid gap-1">
                <label htmlFor="">Sub Category</label>
                <div>
                  <select
                    className="bg-blue-50 border w-full p-2 rounded"
                    value={selectSubCategory}
                    onChange={(e) => {
                      const value = e.target.value;
                      const subCategory = allSubCategory.find(
                        (el) => el._id === value
                      );

                      setData((prev) => {
                        return {
                          ...prev,
                          subCategory: [...prev.subCategory, subCategory],
                        };
                      });
                      setSelectSubCategory("");
                    }}
                  >
                    <option value="">Select Sub Category</option>
                    {allSubCategory.map((cat, index) => {
                      return (
                        <option key={index} value={cat?._id}>
                          {cat.name}
                        </option>
                      );
                    })}
                  </select>
                  <div className="flex flex-wrap gap-3">
                    {data.subCategory.map((cat, index) => {
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-1 bg-blue-50 mt-2"
                        >
                          <p>{cat.name}</p>
                          <div
                            className="hover:text-red-400 cursor-pointer"
                            onClick={() => handleRemoveSubCategory(index)}
                          >
                            <FaDeleteLeft size={18} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="grid gap-1">
                <label htmlFor="unit">Unit</label>
                <input
                  type="text"
                  id="unit"
                  name="unit"
                  placeholder="Enter product unit"
                  value={data.unit}
                  onChange={handleChange}
                  required
                  className="bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded"
                />
              </div>
              <div className="grid gap-1">
                <label htmlFor="stock">Number of Stocks</label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  placeholder="Enter product stock"
                  value={data.stock}
                  onChange={handleChange}
                  required
                  className="bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded"
                />
              </div>
              <div className="grid gap-1">
                <label htmlFor="price">Product Price</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  placeholder="Enter product price"
                  value={data.price}
                  onChange={handleChange}
                  required
                  className="bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded"
                />
              </div>
              <div className="grid gap-1">
                <label htmlFor="discount">Product Discount</label>
                <input
                  type="number"
                  id="discount"
                  name="discount"
                  placeholder="Enter product discount"
                  value={data.discount}
                  onChange={handleChange}
                  required
                  className="bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded"
                />
              </div>
              {/* add more fiels */}
              <div>
                {Object?.keys(data?.more_details)?.map((key, index) => {
                  return (
                    <div key={index} className="grid gap-1">
                      <label htmlFor={key}>{key}</label>
                      <input
                        type="text"
                        id={key}
                        name={key}
                        placeholder={`Enter ${key}`}
                        value={data.more_details[key]}
                        onChange={(e) => {
                          setData((prev) => {
                            return {
                              ...prev,
                              more_details: {
                                ...prev.more_details,
                                [key]: e.target.value,
                              },
                            };
                          });
                        }}
                        required
                        className="bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded"
                      />
                    </div>
                  );
                })}
              </div>
              <div
                className="bg-white hover:bg-primary-200 py-1 px-3 w-32 text-center font-semibold border border-primary-200 rounded cursor-pointer transition-all duration-200 text-primary-200 hover:text-white"
                onClick={() => setOpenAddField(true)}
              >
                Add Fields
              </div>

              <button className="bg-primary-200 py-2 px-3 w-full text-center font-semibold border border-primary-200 rounded cursor-pointer transition-all duration-200 text-white hover:text-primary-200 hover:bg-white">
                Update Product
              </button>
            </form>
          </div>
          {viewImage && (
            <ViewImage url={viewImage} close={() => setViewImage("")} />
          )}
          {openAddField && (
            <AddFields
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
              submit={handleAddField}
              close={() => setOpenAddField(false)}
            />
          )}
        </section>
      </div>
    </section>
  );
};

export default EditProductAdmin;
