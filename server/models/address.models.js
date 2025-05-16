import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    address_line: {
        type: String,
        required: [true, "Address line is required"],
        trim: true,
        maxlength: [100, "Address line cannot exceed 100 characters"],
    },
    city: {
        type: String,
        required: [true, "City is required"],
        trim: true,
        maxlength: [50, "City name cannot exceed 50 characters"],
    },
    state: {
        type: String,
        required: [true, "State is required"],
        trim: true,
        maxlength: [50, "State name cannot exceed 50 characters"],
    },
    pincode: {
        type: String,
        required: [true, "Pincode is required"],
        trim: true,
        match: [/^\d{5,6}$/, "Pincode must be a valid 5-6 digit number"], // Customize regex as per country
    },
    country: {
        type: String,
        required: [true, "Country is required"],
        trim: true,
        maxlength: [50, "Country name cannot exceed 50 characters"],
        default: "India", // Set default if most users are from one country
    },
    mobile: {
        type: String, // Changed to String to accommodate international numbers
        required: [true, "Mobile number is required"],
        trim: true,
        match: [/^\d{10,15}$/, "Mobile number must be valid (10-15 digits)"], // Regex for international format
    },
    status: {
        type: Boolean,
        default: true,
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        default: ""
    }
}, { timestamps: true });

const AddressModel = mongoose.model("Address", addressSchema);

export default AddressModel;
