import hbs from 'nodemailer-express-handlebars';
import exphbs from 'express-handlebars';
import Subscription from '../models/Subscription';
import Meetup from '../models/Meetup';
import User from '../models/User';
import Mail from '../../lib/Mail';

class SubscriptionController {
  /**
   * Stores a subscription
   * @param {*} req
   * @param {*} res
   */
  async store(req, res) {
    const { meetup_id } = req.body;
    const user = await User.findByPk(req.userId);
    const meetup = await Meetup.findByPk(meetup_id);
    const checkDate = await Subscription.findOne({
      where: {
        user_id: user.id,
      },
      include: [
        {
          model: Meetup,
          required: true,
          where: {
            date: meetup.date,
          },
        },
      ],
    });

    if (checkDate) {
      return res
        .status(400)
        .json({ error: "Can't subscribe to two meetups at the same time" });
    }

    if (meetup.user_id === req.userId) {
      return res
        .status(400)
        .json({ error: "You can't subscribe on you own meetup!" });
    }

    if (meetup.past) {
      return res
        .status(400)
        .json({ error: "You can't subscribe on past meetups!" });
    }

    const subscription = await Subscription.create({
      user_id: req.userId,
      meetup_id,
    });

    const organizer = await User.findByPk(meetup.user_id);

    await Mail.sendMail({
      to: `${organizer.email} <${organizer.email}>`,
      subject: 'New subscribe',
      template: 'subscription',
      context: {
        organizer: organizer.name,
        meetup: meetup.title,
        user: user.name,
        email: user.email,
      },
    });

    return res.status(201).json(subscription);
  }
}

export default new SubscriptionController();
