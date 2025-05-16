import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/.+@.+\..+/, "Please enter a valid email address"], // Email validation
        index: true, // Optimize email queries
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"],
        select: false, // Exclude password from queries by default
    },
    avatar: {
        type: String,
        default: "https://via.placeholder.com/150",
    },
    mobile: {
        type: String,
        trim: true,
        match: [/^\d{10}$/, "Mobile number must be a valid 10-digit number"], // Example for 10-digit validation
        default: null,
    },
    refresh_token: {
        type: String,
        default: null,
        select: false, // Exclude token from queries by default
    },
    verify_email: {
        type: Boolean,
        default: false,
    },
    last_login_date: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ["Active", "Inactive", "Suspended"],
        default: "Active",
    },
    address_details: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Address",
        },
    ],
    shopping_cart: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CartProduct",
        },
    ],
    order_history: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
        },
    ],
    forgot_password_otp: {
        type: String,
        default: null,
       // select: false, // Exclude OTP from queries by default
    },
    forgot_password_expiry: {
        type: Date,
        default: "",
    },
    role: {
        type: String,
        enum: ["ADMIN", "USER"],
        default: "USER",
    },
}, { timestamps: true });


// Model creation
const UserModel = mongoose.model("User", userSchema);

export default UserModel;
