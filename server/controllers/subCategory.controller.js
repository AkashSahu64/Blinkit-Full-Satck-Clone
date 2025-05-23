import SubCategoryModel from '../models/subCategory.models.js'

export const AddSubCategoryController = async (req, res) => {
    try {
        const { name, image, category } = req.body;

        if (!name && !image && !category[0]) {
            return res.status(400).json({
                message: "Please provide all fields",
                error: true,
                success: false
            });
        }

        const payload = {
            name,
            image,
            category,
        };
        const createSubCategory =  new SubCategoryModel(payload);
        const save = await createSubCategory.save();
        return res.status(201).json({
            message: "Sub Category created successfully",
            data: save,
            error: false,
            success: true
        });
    } catch (error) {
        res.status(500).json({ 
            message: error.message || error,
            error: true,
            success: false
        });
    }
}


export const GetSubCategoryController = async (req, res) => {
    try {
        const data = await SubCategoryModel.find().sort({ createdAt: -1 }).populate('category');
        return res.status(200).json({
            message: "Sub Category fetched successfully",
            data: data,
            error: false,
            success: true
        });
    } catch (error) {
        res.status(500).json({ 
            message: error.message || error,
            error: true,
            success: false
        });
    }
}


export const updateSubCategoryController = async (req, res) => {
    try {
        const {_id, name, image, category} = req.body

        const checksub = await SubCategoryModel.findById(_id)
        if (!checksub) {
            return res.status(404).json({
                message: "Sub Category not found",
                error: true,
                success: false
            });
        }

        const updateSubCategory = await SubCategoryModel.findByIdAndUpdate(_id, {
            name,
            image,
            category
        });
        return res.status(200).json({
            message: "Sub Category updated successfully",
            data: updateSubCategory,
            error: false,
            success: true
        })
    } catch (error) {
        res.status(500).json({ 
            message: error.message || error,
            error: true,
            success: false
        });
    }
}


export const deleteSubCategoryController = async (req, res) => {
    try {
        const { _id } = req.body;

        const checksub = await SubCategoryModel.findByIdAndDelete(_id)
        if (!checksub) {
            return res.status(404).json({
                message: "Sub Category not found",
                error: true,
                success: false
            });
        }

        return res.status(200).json({
            message: "Sub Category deleted successfully",
            data: checksub,
            error: false,
            success: true
        })
    } catch (error) {
        res.status(500).json({ 
            message: error.message || error,
            error: true,
            success: false
        });
    }
}