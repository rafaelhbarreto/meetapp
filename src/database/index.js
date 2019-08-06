import Sequelize from 'sequelize';
import databaseConfig from '../config/database';

import User from '../app/models/User';
import File from '../app/models/File';
import Meetup from '../app/models/Meetup';

const models = [User, File, Meetup];

class Database {
  constructor() {
    this.init();
  }

  // inicializa todos os models.
  init() {
    this.connection = new Sequelize(databaseConfig);
    models.map(model => {
      return model.init(this.connection);
    });
  }
}

export default new Database();
