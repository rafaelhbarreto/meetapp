import { Router } from 'express';

import multer from 'multer';
import multerConfig from './config/multer';

import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import authMiddleware from './app/middlewares/auth';
import FileController from './app/controllers/FileController';
import MeetupController from './app/controllers/MeetupController';
import SubscriptionController from './app/controllers/SubscriptionController';

const routes = new Router();

const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);
routes.post('/users', UserController.store);
routes.get('/users', UserController.index);

routes.use(authMiddleware);

routes.post('/files', upload.single('file'), FileController.store);
routes.put('/users', UserController.update);

// meetups
routes.post('/meetups', MeetupController.store);
routes.put('/meetups/:id', MeetupController.update);
routes.get('/meetups', MeetupController.index);
routes.delete('/meetups/:id', MeetupController.delete);

// subscriptions
routes.post('/subscriptions', SubscriptionController.store);

export default routes;
