import authRoutes from "./auth/auth.routes";
import userRoutes from "./User/user.routes";

export default [...authRoutes, ...userRoutes];
