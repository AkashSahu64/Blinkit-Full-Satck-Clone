import CartProductModel from "../models/cartProduct.models.js";
import UserModel from "../models/user.models.js";

export const addToCartItemController = async (req, res) => {
    try {
        const userId = req.userId
        const { productId } = req.body

        if (!productId) {
            return res.status(402).json({
                message: 'Provide product id',
                error: true,
                success: false
            })
        }

        const checkItemCart = await CartProductModel.findOne({
            userId: userId,
            productId: productId
        })

        if (checkItemCart) {
            return res.status(400).json({
                message: 'Item already added in cart'
            })
        }

        const cartItem = new CartProductModel({
            quantity: 1,
            userId: userId,
            productId: productId
        })
        const save = await cartItem.save()

        const updateCartUser = await UserModel.updateOne({ _id: userId }, {
            $push: {
                shopping_cart: productId
            }
        })

        return res.status(200).json({
            data: save,
            message: 'Item added successfully',
            error: false,
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || message,
            error: true,
            success: false
        })
    }
}

export const getCartItemController = async (req, res) => {
    try {
        const userId = req.userId

        const cartItem = await CartProductModel.find({
            userId: userId
        }).populate('productId')

        return res.status(200).json({
            data: cartItem,
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

export const updateCartItemQtycontroller = async (req, res) => {
    try {
        const userId = req.userId
        const { _id, qty } = req.body

        if (!_id || !qty) {
            return res.status(400).json({
                message: 'id or quantity not define'
            })
        }

        const updateCartItem = await CartProductModel.updateOne({
            _id: _id,
            userId: userId
        }, {
            quantity: qty
        })

        return res.status(200).json({
            message: 'Item updated',
            success: true,
            error: false,
            data: updateCartItem
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const deleteCartItemQtyController = async (req, res) => {
    try {
        const userId = req.userId
        const { _id } = req.body

        if (!_id) {
            return res.status(400).json({
                message: 'Product id not found',
                error: true,
                success: false
            })
        }

        const deleteCartItem = await CartProductModel.deleteOne({
            _id: _id,
            userId: userId
        })

        return res.status(200).json({
            message: 'Item removed',
            error: false,
            success: true,
            data: deleteCartItem
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}