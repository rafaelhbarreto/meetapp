import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import User from '../models/user';
import auth from '../../config/auth';

class SessionController {
  async store(req, res) {
    // validate schema
    const schema = Yup.object().shape({
      email: Yup.string().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation fails' });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'user not found' });

    if (!(await user.checkPassword(password)))
      return res.status(401).json({ error: "Password doesen't  match" });

    // return the authorized user
    const { id, name } = user;
    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, auth.secret, {
        expiresIn: auth.expiresIn,
      }),
    });
  }
}

export default new SessionController();
