import { Router } from "express";
import { Message } from "../constants/message";
import authRoutes from './auth.routes'
import userRoutes from './user.routes'
import storeRoutes from './store.routes'
import productRoutes from './product.routes'
import categoryRoutes from './category.routes'
import chatRoutes from './chat.routes'
import messageRoutes from './message.routes'
import notificationRoutes from './notification.routes'

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
    path: '/user',
    route: userRoutes,
  },
  {
    path: '/store',
    route: storeRoutes,
  },
  {
    path: '/product',
    route: productRoutes
  },
  {
    path: '/category',
    route: categoryRoutes
  },
  {
    path: '/chat',
    route: chatRoutes
  },
  {
    path: '/message',
    route: messageRoutes
  },
  {
    path: '/notifications',
    route: notificationRoutes
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