import {createBrowserRouter} from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';
import Search from '../pages/Search.page';
import Login from '../pages/Login.page';
import Register from '../pages/Register.page';
import ForgotPassword from '../pages/ForgotPassword.page';
import OtpVerification from '../pages/OtpVerification.page';
import ResetPassword from '../pages/ResetPassword.page';
import UserMenuMobile from '../pages/UserMenuMobile.page';
import Dashboard from '../layouts/Dashboard';
import Profile from '../pages/Profile.page';
import MyOrder from '../pages/MyOrder.page';
import Address from '../pages/Address.page';
import UploadProduct from '../pages/UploadProduct.page';
import Category from '../pages/Category.page';
import SubCategory from '../pages/SubCategory.page';
import ProductAdmin from '../pages/ProductAdmin.page';
import AdminPermission from '../layouts/AdminPermission';
import ProductList from '../pages/ProductList.page';
import ProductDisplay from '../pages/ProductDisplay.page';
import CartMobile from '../pages/CartMobile';
import Checkout from '../pages/Checkout.page';
import Success from '../pages/Success.page';
import Cancel from '../pages/Cancel.page';


const router = createBrowserRouter([
    {
        path: '/',
        element: <App/>,
        children: [
            {
                path: "",
                element: <Home/>
            },
            {
                path: 'search',
                element: <Search/>
            },
            {
                path: 'login',
                element: <Login/>
            },
            {
                path: 'register',
                element: <Register/>
            },
            {
                path: 'forgot-password',
                element: <ForgotPassword/>
            },
            {
                path: 'otp-verification',
                element: <OtpVerification/>
            },
            {
                path: 'reset-password',
                element: <ResetPassword/>
            },
            {
                path: 'user-menu',
                element: <UserMenuMobile/>
            },
            {
              path: 'dashboard',
                element: <Dashboard />,  
                children: [
                    {
                        path: 'profile',
                        element: <Profile/>
                    },
                    {
                        path: 'my-order',
                        element: <MyOrder/>
                    },
                    {
                        path: 'address',
                        element: <Address/>
                    },
                    {
                        path: 'product',
                        element: <AdminPermission><ProductAdmin/></AdminPermission>
                    },
                    {
                        path: 'upload-product',
                        element: <AdminPermission><UploadProduct/></AdminPermission>
                    },
                    {
                        path: 'category',
                        element: <AdminPermission><Category/></AdminPermission>
                    },
                    {
                        path: 'sub-category',
                        element: <AdminPermission><SubCategory/></AdminPermission>
                    }
                ]
            },
            {
                path: ':category',
                children: [
                    {
                        path: ':subCategory',
                        element: <ProductList/>
                    }
                ]
            },
            {
                path: 'product/:product',
                element: <ProductDisplay/>
            },
            {
                path: 'cart',
                element: <CartMobile/>
            },
            {
                path: 'checkout',
                element: <Checkout/>
            },
            {
                path: 'success',
                element: <Success/>
            },
            {
                path: '/cancel',
                element: <Cancel/>
            }
        ]
    }
])

export default router