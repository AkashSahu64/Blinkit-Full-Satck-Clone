import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import connectDB from './config/connectDB.js';
import userRouter from './routes/user.routes.js';
import categoryRouter from './routes/category.routes.js';
import uploadRouter from './routes/upload.routes.js';
import subCategoryRouter from './routes/subCategory.routes.js';
import productRouter from './routes/product.routes.js';
import cartRouter from './routes/cart.routes.js';
import addressRouter from './routes/address.routes.js';
import orderRouter from './routes/order.routes.js';

dotenv.config();

const app = express();

app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}));

app.use(express.json());
app.use(cookieParser());
app.use(morgan());
app.use(helmet({
    contentSecurityPolicy: false
}));

const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => {    
    res.json({ message: 'Server is running...' });
});

app.use('/api/user', userRouter);
app.use('/api/category', categoryRouter)
app.use('/api/file', uploadRouter)
app.use('/api/subcategory', subCategoryRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/address', addressRouter)
app.use('/api/order', orderRouter)

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});