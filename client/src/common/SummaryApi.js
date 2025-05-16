export const baseUrl = import.meta.env.VITE_API_URL

const SummaryApi = {
    register: {
        url : 'api/user/register',
        method: 'POST'
    },
    login: {
        url : 'api/user/login',
        method: 'POST'
    }, 
    forgotPassword: {
        url : 'api/user/forgot-password',
        method: 'PUT'
    },
    otpVerify: {
        url : 'api/user/verify-otp',
        method: 'PUT'
    },
    resetPassword: {
        url : 'api/user/reset-password',
        method: 'PUT'
    },
    refreshToken: {
        url : 'api/user/refresh-token',
        method: 'POST'
    },
    userDetail: {
        url: 'api/user/user-details',
        method: 'GET'
    },
    logout: {
        url: '/api/user/logout',
        method: 'GET'
    },
    uploadAvatar : {
        url: '/api/user/upload-avatar',
        method: 'PUT'
    },
    updateUser: {
        url: '/api/user/update-user',
        method: 'PUT'
    },
    addCategory: {
        url: '/api/category/add-category',
        method: 'POST'
    },
    uploadImage: {
        url: '/api/file/upload',
        method: "POST"
    },
    getCategory: {
        url: '/api/category/get',
        method: 'GET'
    },
    updateCategory: {
        url: '/api/category/update',
        method: 'PUT'
    },
    deleteCategory: {
        url: '/api/category/delete',
        method: 'DELETE'
    },
    createSubCategory: {
        url: '/api/subcategory/create',
        method: 'POST'
    },
    getSubCategory: {
        url: '/api/subcategory/get',
        method: 'POST'
    },
    updateSubCategory: {
        url: '/api/subcategory/update',
        method: 'PUT'
    },
    deleteSubCategory: {
        url: '/api/subcategory/delete',
        method: 'DELETE'
    },
    createProduct: {
        url: '/api/product/create',
        method: 'POST'
    },
    getProduct: {
        url: '/api/product/get',
        method: 'POST'
    },
    getProductByCategory: {
        url: '/api/product/get-product-by-category',
        method: 'POST'
    },
    getProductByCategoryAndSubCategory: {
        url: '/api/product/get-product-by-category-and-subcategory',
        method: 'POST'
    },
    getProductDetail: {
        url: '/api/product/get-product-details',
        method: 'POST'
    },
    updateProductDetails: {
        url: '/api/product/update-product-details',
        method: 'PUT'
    },
    deleteProduct: {
        url: '/api/product/delete-product',
        method: 'DELETE'
    },
    searchProduct: {
        url: '/api/product/search-product',
        method: 'POST'
    },
    addToCart: {
        url: '/api/cart/create',
        method: 'POST'
    }, 
    getCartItem: {
        url: '/api/cart/get',
        method: 'GET'
    },
    updateCartItemQty: {
        url: '/api/cart/update-qty',
        method: 'PUT'
    },
    deleteCartItem: {
        url: '/api/cart/delete-cart-qty',
        method: 'DELETE'
    },
    createAddress: {
        url: '/api/address/create',
        method: 'POST'
    },
    getAddress: {
        url: '/api/address/get',
        method: 'GET'
    },
    updateAddress: {
        url: '/api/address/update',
        method: 'PUT'
    },
    deleteAddress: {
        url: '/api/address/delete',
        method: 'DELETE'
    },
    cashOnDeliveryOrder: {
        url: '/api/order/cash-on-delivery',
        method: 'POST'
    },
    onlinePayment: {
        url: '/api/order/checkout',
        method: 'POST'
    },
    getOrderList: {
        url: '/api/order/order-list',
        method: 'GET'
    },
}

export default SummaryApi