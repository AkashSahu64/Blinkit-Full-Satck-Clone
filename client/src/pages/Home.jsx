import React from "react";
import banner from "../assets/banner.jpg";
import bannerMobile from "../assets/banner-mobile.jpg";
import { useSelector } from "react-redux";
// import { validUrlConvert } from "../utils/validUrlConvert.";
import { useNavigate } from "react-router-dom";
import CategoryWiseProduct from "../components/CategoryWiseProduct";
import { validUrlConvert } from "../utils/ValidUrlConvert";

const Home = () => {
  const loadingCategory = useSelector(state => state.product.loadingCategory);
  const categoryData = useSelector(state => state.product.allCategory);
  const subCategoryData = useSelector(state => state.product.allSubCategory);
  const navigate = useNavigate();

  const handleProductList = (id, cat) => {
    const subCategory = subCategoryData.find(sub => {
      const filterData = sub.category.some(c => {
        return c._id == id;
      });
      return filterData ? true : null;
    });
    
    const url = `/${validUrlConvert(cat)}-${id}/${validUrlConvert(
      subCategory.name
    )}-${subCategory._id}`;
    navigate(url);
  };

  return (
    <section className="bg-white">
      <div className="container mx-auto">
        <div
          className={`w-full h-full min-h-48 bg-blue-100 rounded ${
            !banner && "animate-pulse"
          } my-2`}
        >
          <img
            src={banner}
            alt="Banner"
            className="w-full h-full hidden lg:block"
          />
          <img
            src={bannerMobile}
            alt="Banner"
            className="w-full h-full lg:hidden"
          />
        </div>
      </div>

      <div className="container mx-auto my-2 px-4 grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2">
        {loadingCategory
          ? new Array(12).fill(null).map((c, index) => {
              return (
                <div
                  key={index}
                  className="bg-white rounded p-4 h-48 grid gap-2 shadow animate-pulse"
                >
                  <div className="bg-blue-100 h-24 rounded"></div>
                  <div className="bg-blue-100 h-8 rounded"></div>
                </div>
              );
            })
          : categoryData.map((cat, index) => {
              return (
                <div
                  key={index + "category"}
                  className="w-full h-48"
                  onClick={() => handleProductList(cat._id, cat.name)}
                >
                  <div>
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-scale-down"
                    />
                  </div>
                </div>
              );
            })}
      </div>

      {/* category products */}
      {categoryData.map((c, index) => {
        return <CategoryWiseProduct key={index} id={c?._id} name={c?.name} />;
      })}
    </section>
  );
};

export default Home;
