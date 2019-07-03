import { Router } from 'express';
import User from './app/models/user';

const routes = new Router();

routes.get('/', async (req, res) => {
  const user = await User.create({
    name: 'Rafael Barreto',
    email: 'rafaelhbarreto@gmail.com',
    password_hash: '123456',
  });

  res.send(user);
});

export default routes;
