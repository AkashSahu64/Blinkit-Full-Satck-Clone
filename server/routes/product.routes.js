import { Router } from "express";
import auth from "../middleware/auth.middleware.js";
import {
  createProductController,
  deleteProductDetails,
  getProductBycategory,
  getProductBycategoryAndSubCategory,
  getProductController,
  getProductDetails,
  searchProduct,
  updateProductDetails,
} from "../controllers/product.controller.js";
import { admin } from "../middleware/admin.middleware.js";

const productRouter = Router();

productRouter.post("/create", auth, admin, createProductController);
productRouter.post("/get", getProductController);
productRouter.post("/get-product-by-category", getProductBycategory);
productRouter.post(
  "/get-product-by-category-and-subcategory",
  getProductBycategoryAndSubCategory
);
productRouter.post('/get-product-details', getProductDetails)
productRouter.put('/update-product-details', auth, admin, updateProductDetails)
productRouter.delete('/delete-product', auth, admin, deleteProductDetails)
productRouter.post('/search-product', searchProduct)

export default productRouter;
