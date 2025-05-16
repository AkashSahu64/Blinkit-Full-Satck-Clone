import CategoryModel from '../models/category.models.js'
import SubCategoryModel from '../models/subCategory.models.js'
import ProductModel from '../models/product.models.js'

export const AddCategoryController = async (req, res) => {
    try {
        const { name, image } = req.body

        if (!name || !image) {
            return res.status(400).json({
                message: "Enter required fields",
                error: true,
                success: false
            })
        }

        const addCategory = new CategoryModel({
            name,
            image
        })

        const saveCategory = await addCategory.save()

        if (!saveCategory) {
            return res.status(500).json({
                message: 'Category not created',
                error: true,
                success: false
            })
        }

        return res.status(200).json({
            message: "Added Category",
            data: saveCategory,
            success: true,
            error: false
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const getCategoryController = async (req, res) => {
    try {
        const data = await CategoryModel.find()
        return res.status(200).json({
            data: data,
            error: false,
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const updateCategoryController = async (req, res) => {
    try {
        const { _id, name, image } = req.body

        const update = await CategoryModel.updateOne({
            _id: _id
        }, {
            name,
            image
        })

        return res.status(200).json({
            message: "Category Updated Successfull",
            success: true,
            error: false,
            data: update
        })
    } catch (error) {
        return res.message(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const deleteCategoryController = async (req, res) => {
    try {
        const { _id } = req.body

        const checkSubCategory = await SubCategoryModel.find({
            category: {
                "$in": [_id]
            }
        }).countDocuments()

        const checkProduct = await ProductModel.find({
            category: {
                "$in": [_id]
            }
        }).countDocuments()

        if(checkSubCategory > 0 || checkProduct > 0){
            return res.status(400).json({
                message: "Category has SubCategory or Product can't delete",
                error: true,
                success: false
            })
        }

        const deleteCategory = await CategoryModel.deleteOne({
            _id: _id
        })

        return res.status(200).json({
            message: "Category Deleted Successfull",
            success: true,
            error: false,
            data: deleteCategory
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}