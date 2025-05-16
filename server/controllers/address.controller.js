import AddressModel from '../models/address.models.js';
import UserModel from '../models/user.models.js';

export const addAddressController = async (req, res) => {
    try {
        const userId = req.userId
        const { address_line, city, state, pincode, country, mobile } = req.body

        const createAddress = new AddressModel({
            address_line,
            city,
            state,
            pincode,
            country,
            mobile,
            userId: userId
        })

        const saveAddress = await createAddress.save()

        const addUserAddressId = await UserModel.findByIdAndUpdate(userId, {
            $push: {
                address_details: saveAddress._id
            }
        })

        return res.status(200).json({
            message: "Address added successfully",
            data: saveAddress,
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

export const getAddressController = async (req, res) => {
    try {
        const userId = req.userId

        const getAddress = await AddressModel.find({ userId: userId }).sort({ createdAt: -1 })

        if (!getAddress) {
            return res.status(404).json({
                message: "No address found",
                success: false,
                error: true
            })
        }

        return res.status(200).json({
            message: "Address fetched successfully",
            data: getAddress,
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

export const updateAddressController = async (req, res) => {
    try {
        const userId = req.userId
        const {_id, address_line, city, state, pincode, country, mobile } = req.body

        const updateAddress = await AddressModel.updateOne({_id: _id, userId: userId}, {
            address_line,
            city,
            state,
            pincode,
            country,
            mobile
        }, { new: true })
        if (!updateAddress) {
            return res.status(404).json({
                message: "Address not found",
                success: false,
                error: true
            })
        }
        return res.status(200).json({
            message: "Address updated successfully",
            data: updateAddress,
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

export const deleteAddressController = async (req, res) => {
    try {
        const userId = req.userId
        const { _id } = req.body

        const deleteAddress = await AddressModel.findByIdAndDelete({ _id: _id, userId: userId },{
            state: false
        })

        if (!deleteAddress) {
            return res.status(404).json({
                message: "Address not found",
                success: false,
                error: true
            })
        }

        return res.status(200).json({
            message: "Address deleted successfully",
            data: deleteAddress,
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