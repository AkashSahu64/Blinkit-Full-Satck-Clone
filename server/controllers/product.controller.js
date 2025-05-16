import ProductModel from "../models/product.models.js";

export const createProductController = async (req, res) => {
    try {
        const { name, image, category, subCategory, unit, stock, price, discount, description, more_details } = req.body;
        
        // Validate required fields
        if (!name || !image[0] || !subCategory[0] || !category[0] || !unit || !stock || !price || !description) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields",
                error: true
            });
        }

        // Create new product
        const newProduct = new ProductModel({
            name,
            image,
            category,
            subCategory,
            unit,
            stock,
            price,
            discount,
            description,
            more_details
        });
        const savedProduct = await newProduct.save();
        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: savedProduct,
            error: false
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message:error.message || error || "Failed to create product",
            error: true
        });
    }
}


export const getProductController = async (req, res) => {
    try {
        let { page, limit, search } = req.body;

        if(!page){
            page = 1;
        }
        if(!limit){
            limit = 12;
        }

        const query = search ? {
            $text: {
                $search: search,
                $caseSensitive: false,
                $diacriticSensitive: false
            }
        } : {}

        const skip = (page - 1) * limit;

        const [data, totalCount] = await Promise.all([
            ProductModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('category subCategory'),
            ProductModel.countDocuments(query)
        ]);

        return res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            totalCount: totalCount,
            totalNoPage: Math.ceil(totalCount / limit),
            data: data,
            error: false
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message:error.message || error || "Failed to fetch product",
            error: true
        });
    }
}

export const getProductBycategory = async(req, res) => {
    try {
        const {id} = req.body;

        if(!id){
            return res.status(400).json({
                success: false,
                message: "Please provide category id",
                error: true
            });
        }
        
        const product = await ProductModel.find({
            category: {$in : id}
        }).limit(15).sort({createdAt: -1});

        return res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            data: product,
            error: false
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message:error.message || error || "Failed to fetch product",
            error: true
        });
    }
}

export const getProductBycategoryAndSubCategory = async(req, res) => {
    try {
        const {categoryId, subCategoryId, page, limit} = req.body;

        if(!categoryId || !subCategoryId){
            return res.status(400).json({
                message: "Please provide category and subcategory id",
                error: true,
                success: false,
            });
        }

        if(!page){
            page = 1;
        }

        if(!limit){
            limit = 10;
        }
        
        const query = {
            category: {$in : categoryId},
            subCategory: {$in : subCategoryId}
        }

        const skip = (page - 1) * limit;

        const [data, dataCount] = await Promise.all([
            ProductModel.find(query).sort({createdAt: -1}).skip(skip).limit(limit),
            ProductModel.countDocuments(query)
        ]);
        
        return res.status(200).json({
            message: "Products fetched successfully",
            data: data,
            totalCount: dataCount,
            page: page,
            limit: limit,
            success: true,
            error: false
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message:error.message || error || "Failed to fetch product",
            error: true
        });
    }
}

export const getProductDetails = async (req, res) => {
    try {
        const {productId} = req.body

        const product = await ProductModel.findOne({_id: productId})

        return res.status(200).json({
            message: "Product details fetched successfully",
            data: product,
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

export const updateProductDetails = async(req, res) => {
    try {
        const {_id} = req.body

        if(!_id){
            return res.status(400).json({
                message: 'Provide product id',
                error: true,
                success: false
            })
        }

        const updateProduct = await ProductModel.updateOne({_id: _id},{
            ...req.body
        })

        return res.status(200).json({
            message: 'Updated Successfully',
            data: updateProduct,
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

export const deleteProductDetails = async(req, res)=> {
    try {
        const {_id} = req.body

        if(!_id){
            return res.status(400).json({
                message: 'Provide product id',
                error: true,
                success: false
            })
        }

        const deleteProduct = await ProductModel.deleteOne({_id: _id})

        return res.status(200).json({
            message: 'Product Deleted Successfully',
            data: deleteProduct,
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

export const searchProduct = async(req, res) => {
    try {
        let {search, page, limit} = req.body

        if(!page) page = 1

        if(!limit) limit = 10

        const query = search ? {
            $text: {
                $search: search
            }
        } : {}

        const skip = (page - 1) * limit

        const [data, dataCount] = await Promise.all([
            ProductModel.find(query).sort({createdAt: -1}).skip(skip).limit(limit).populate('category subCategory'),
            ProductModel.countDocuments(query)
        ])

        return res.status(200).json({
            message: 'Product search data',
            error: false,
            success: true,
            data: data,
            totalCount: dataCount,
            totalPage: Math.ceil(dataCount/limit),
            page: page,
            limit: limit
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}