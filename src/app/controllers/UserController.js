import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  async index(req, res) {
    const users = await User.findAll();
    res.json(users);
  }

  /**
   * Stores a user on database
   */
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      provider: Yup.boolean().required(),
      password: Yup.string()
        .min(6)
        .required(),
    });

    if (!(await schema.isValid(req.body)))
      return res.json({ error: 'Validation fails' });

    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      const createdUser = await User.create(req.body);
      return res.status(201).json({
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
      });
    }

    return res.json({ error: 'User alredy exists!' });
  }

  /**
   * Update the user
   * 06591999124
   */
  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string()
        .email()
        .required(),
      provider: Yup.boolean(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) => {
          return oldPassword ? field.required() : field;
        }),
      confirmPassword: Yup.string()
        .min(6)
        .when('password', (password, field) => {
          return password ? field.required() : field;
        }),
    });

    schema.validate(req.body).catch(err => {
      res.send(err.errors);
    });

    const { email, oldPassword } = req.body;

    // 1 - get the user
    const user = await User.findOne({ where: { id: req.userId } });

    const userExists = await User.findOne({ where: { email } });
    if (email !== user.email && userExists) {
      return res.status(401).json({ error: 'Email alredy exists' });
    }

    if (!user) return res.json({ error: 'User not found' });

    // 2 - verify the password
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    // 3 - update the user
    const { id, name, provider } = await user.update(req.body);
    return res.status(200).json({
      id,
      name,
      email,
      provider,
    });
  }
}

export default new UserController();
