import React, { useEffect } from "react";
import { useState } from "react";
import UploadSubCategoryModel from "../components/UploadSubCategoryModel";
import Axios from "../utils/Axios.utils";
import SummaryApi from "../common/SummaryApi";
import AxiosTostError from "../utils/AxiosTostError.utils";
import DisplayTable from "../components/DisplayTable";
import { createColumnHelper } from "@tanstack/react-table";
import ViewImage from "../components/ViewImage";
import { RiImageEditFill } from "react-icons/ri";
import { MdDeleteForever } from "react-icons/md";
import EditSubCategory from "../components/EditSubCategory";
import ConfirmBox from "../components/ConfirmBox";
import toast from "react-hot-toast";

const SubCategory = () => {
  const [openAddSubCategory, setOpenAddSubCategory] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const columnHelper = createColumnHelper();
  const [imageUrl, setImageUrl] = useState("");
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({
    _id: "", 
  });
  const [deleteSubCategory, setDeleteSubCategory] = useState({
    _id: "",
  });
  const [openDeleteConfirmBox, setOpenDeleteConfirmBox] = useState(false);

  const fetchSubCategory = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getSubCategory,
      });
      const { data: responseData } = response;

      if (responseData.success) {
        setData(responseData.data);
      }
    } catch (error) {
      AxiosTostError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubCategory();
  }, []);

  const column = [
    columnHelper.accessor("name", {
      header: "Name",
    }),
    columnHelper.accessor("image", {
      header: "Image",
      cell: ({ row }) => {
        return (
          <div className="flex justify-center items-center">
            <img
              src={row.original.image}
              alt={row.original.name}
              className="w-8 h-8 cursor-pointer"
              onClick={() => {
                setImageUrl(row.original.image);
              }}
            />
          </div>
        );
      },
    }),
    columnHelper.accessor("category", {
      header: "Category",
      cell: ({ row }) => {
        return (
          <>
            {row.original.category.map((cat, index) => (
              <p key={cat._id+"table"+index} className='shadow-md px-1 inline-block'>{cat.name}</p>
            ))}
          </>
        );
      },
    }),
    columnHelper.accessor("_id", {
      header: "Action",
      cell: ({ row }) => {
        return (
          <div className="flex justify-center items-center gap-3">
            <button
              className="border bg-green-100 hover:bg-green-200 text-green-500 hover:text-green-600 px-2.5 py-1 rounded"
              onClick={() => {
                setOpenEdit(true);
                setEditData(row.original);
              }}
            >
              <RiImageEditFill size={20} />
            </button>
            <button
              className="border bg-red-100 hover:bg-red-200 text-red-500 hover:text-red-600 px-2.5 py-1 rounded"
              onClick={() => {
                setOpenDeleteConfirmBox(true);
                setDeleteSubCategory(row.original);
              }}
            >
              <MdDeleteForever size={20} />
            </button>
          </div>
        );
      },
    }),
  ];
  
  const handleDeleteSubCategory = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteSubCategory,
        data: {
          data: deleteSubCategory,
        },
      });
      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        fetchSubCategory();
        setOpenDeleteConfirmBox(false);
        setDeleteSubCategory({
          _id: "",
        });
      } 
    } catch (error) {
      AxiosTostError(error);
    }
  }
  return (
    <section>
      <div className=" p-2 bg-white shadow-md flex items-center justify-between">
        <h2 className=" font-semibold">Sub Category</h2>
        <button
          onClick={() => setOpenAddSubCategory(true)}
          className="text-sm border border-primary-200 hover:bg-primary-200 px-3 py-1 rounded"
        >
          Add Sub Category
        </button>
      </div>

      <div className="overflow-auto w-full max-w-[95vw]">
        <DisplayTable data={data} column={column} />
      </div>

      {openAddSubCategory && (
        <UploadSubCategoryModel close={() => setOpenAddSubCategory(false)} 
        fetchData= {fetchSubCategory}/>
      )}

      {imageUrl && <ViewImage url={imageUrl} close={() => setImageUrl("")} />}

      {openEdit && (
        <EditSubCategory data={editData} close={() => setOpenEdit(false)} fetchData={fetchSubCategory}/>
      )}

      {
        openDeleteConfirmBox && (
          <ConfirmBox
            cancel={() => setOpenDeleteConfirmBox(false)}
            close={() => setOpenDeleteConfirmBox(false)}
            confirm={handleDeleteSubCategory}
          />
        )
      }
    </section>
  );
};

export default SubCategory;
