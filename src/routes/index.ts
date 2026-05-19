import { Router } from 'express';
import authRouter from '../app/modules/auth/auth.route';
import oauthRouter from '../app/modules/auth/oauth.route';
import userRouter from '../app/modules/user/user.route';
import taskRoute from '../app/modules/task/task.route';
import vehicleRoute from '../app/modules/vehicle/vehicle.route';
import documentsRoute from '../app/modules/documents/documents.route';
import costRoute from '../app/modules/cost/cost.route';
import reportRoute from '../app/modules/report/report.route';
import contactRoute from '../app/modules/contact/contact.route';



const router = Router();

const moduleRoutes = [
    {
    path: '/auth',
    route: authRouter,
    },
    {
      path: '/oauth',
      route: oauthRouter,
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
    {
      path: '/cost',
      route: costRoute,
    },
    {
      path: '/report',
      route: reportRoute,
    },
    {
      path: '/contact',
      route: contactRoute,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;