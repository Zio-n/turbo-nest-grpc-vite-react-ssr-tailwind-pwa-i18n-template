// typeorm.config.js
import { User } from './user.entity';
module.exports = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'test',
  entities: [User],
  synchronize: true,
};
