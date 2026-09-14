import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import ordersRoutes from "./routes/orders.routes.js"
import adminRoutes from "./routes/admin.routes.js";
import { errorHandler } from './middleware/error.middleware.js';

const app = express();

const AllowedOrigins = ["http://localhost:5173", "https://ecommerce-project-neon-theta.vercel.app"];

app.use(cors({
    origin: AllowedOrigins ,
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api",productRoutes);
app.use("/api",categoryRoutes);
app.use("/api",cartRoutes);
app.use("/api",ordersRoutes);
app.use("/api/admin", adminRoutes);

app.use(errorHandler);  //error function always has 4 parameter and express use it to mark as errorHandler
                        //if there are more than 1 errorHandler it gonna work in order
app.get("/",(req, res) => {
    res.json({message: "API is working"});
})

export default app;