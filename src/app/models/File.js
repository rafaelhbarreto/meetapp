import Sequelize, { Model } from 'sequelize';

class File extends Model {
  static init(sequelize) {
    super.init(
      {
        path: Sequelize.STRING,
        name: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `${process.env.APP_URL}/files/${this.path}`;
          },
        },
      },
      { sequelize }
    );
  }

  static associate(models) {
    this.hasOne(models.Meetup, { foreignKey: 'file_id' });
  }
}

export default File;
