import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Category name is required"],
            trim: true,
            unique: true, // Ensures no duplicate category names
            maxlength: [50, "Category name cannot exceed 50 characters"],
        },
        image: {
            type: String,
            default: "",
            validate: {
                validator: function (v) {
                    return /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))$/.test(v); // Validates URL format for image
                },
                message: "Please provide a valid image URL",
            },
        },
    },
    { timestamps: true }
);

const CategoryModel = mongoose.model("category", categorySchema);

export default CategoryModel;
