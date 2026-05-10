import { Router } from 'express';
import authRouter from '../app/modules/auth/auth.route';
import userRouter from '../app/modules/user/user.route';
import taskRoute from '../app/modules/task/task.route';
import vehicleRoute from '../app/modules/vehicle/vehicle.route';
import documentsRoute from '../app/modules/documents/documents.route';



const router = Router();

const moduleRoutes = [
    {
    path: '/auth',
    route: authRouter,
    },
    {
      path: '/user',
      route: userRouter,
    },
    {
      path: '/task',
      route: taskRoute,
    },
    {
      path: '/vehicle',
      route: vehicleRoute,
    },
    {
      path: '/documents',
      route: documentsRoute,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;