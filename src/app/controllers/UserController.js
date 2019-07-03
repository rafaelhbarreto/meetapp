import User from '../models/user';

class UserController {
  async index(req, res) {
    res.send('a');
  }

  async store(req, res) {
    const user = await User.create(req.body);
    res.send(user);
  }
}

export default new UserController();
