import { Router } from "express";
import { Message } from "../constants/message";
import authRoutes from './auth.routes'
import productRoutes from './product.routes'

export type Route = {
    path: string;
    route: Router;
};

const router = Router();
const routes: Route[] = [
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/product',
    route: productRoutes
  }
];

routes.forEach((route) => {
    router.use(route.path, route.route);
}
);

// *Route to ensure that server is currently running
router.get('/', (req, res) => {
    res.send({
      success: true,
      message: Message['welcomeMessage'],
      data: [],
    })
  })
  
  export default router