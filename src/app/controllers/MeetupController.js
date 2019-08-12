import * as Yup from 'yup';
import { isBefore, parse } from 'date-fns';
import Meetup from '../models/Meetup';
import User from '../models/User';
import File from '../models/File';

class MeetupController {
  async index(req, res) {
    const meetups = await Meetup.findAll({
      where: { user_id: req.userId },
      include: [User],
    });

    return res.json(meetups);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      user_id: req.body.userId,
      title: Yup.string().required(),
      file_id: Yup.number().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // não é possível adicionar meetups que já passaram
    if (isBefore(parse(req.body.date), new Date())) {
      res.status(401).json({ error: "Past dates aren't permmited!" });
    }

    const user_id = req.userId;
    const meetup = await Meetup.create({
      ...req.body,
      user_id,
    });

    return res.json(meetup);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      file_id: Yup.number().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // verifica se é o organizador do meetup
    const meetup = await Meetup.findByPk(req.params.id);

    if (meetup.user_id !== req.userId) {
      return res.status(401).json({ error: 'Not authorized.' });
    }

    if (isBefore(parse(req.body.date), new Date())) {
      return res.status(401).json({ error: 'Invalida date' });
    }

    // verifica se o evento pode ser editado (se ainda não foi realizado)
    if (meetup.past) {
      return res.status(400).json({ error: "Can't update past meetups." });
    }

    await meetup.update(req.body);
    return res.json(meetup);
  }

  /**
   * Cancela / deleta um meetup
   *
   * @param {*} req
   * @param {*} res
   */
  async delete(req, res) {
    const meetup = await Meetup.findByPk(req.params.id);

    if (meetup.user_id !== req.userId) {
      return res.status(401).json({ error: 'unauthorized!' });
    }

    if (meetup.past) {
      return res
        .status(401)
        .json({ error: "This meetup is finished. You can't remove" });
    }

    const aux = meetup;
    await meetup.destroy();
    return res.json(aux);
  }
}

export default new MeetupController();
