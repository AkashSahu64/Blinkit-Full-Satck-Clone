import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Product name is required"],
            trim: true,
            maxlength: [100, "Product name cannot exceed 100 characters"],
        },
        image: {
            type: [String], // Updated to an array of strings for multiple images
            validate: {
                validator: (images) => Array.isArray(images) && images.every(img => typeof img === "string"),
                message: "Image URLs must be an array of strings",
            },
            default: [],
        },
        category: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "category",
                required: [true, "At least one category is required"],
            },
        ],
        subCategory: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "subCategory",
            },
        ],
        unit: {
            type: String,
            required: [true, "Unit is required"],
            default: "pieces"
        },
        stock: {
            type: Number,
            required: [true, "Stock quantity is required"],
            min: [0, "Stock cannot be negative"],
            default: 0,
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
            min: [0, "Price cannot be negative"],
        },
        discount: {
            type: Number,
            min: [0, "Discount cannot be negative"],
            max: [100, "Discount cannot exceed 100%"],
            default: 0,
        },
        description: {
            type: String,
            trim: true,
            maxlength: [1000, "Description cannot exceed 1000 characters"],
        },
        more_details: {
            type : Object,
            default: {},
        },
        publish: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

//create index for product name and description

productSchema.index({
    name: "text", 
    description: "text" 
},{
    weights: {
        name: 5, // Higher weight for name
        description: 1, // Lower weight for description
    },
});

const ProductModel = mongoose.model("Product", productSchema);
export default ProductModel;
