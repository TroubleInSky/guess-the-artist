import { DataSource, DataSourceOptions } from 'typeorm';
import * as path from 'path';
import { appConfigInstance } from './common/infrastructure/app.config';

export const dataSourceOptions: DataSourceOptions = {
  type: 'sqlite',
  database: appConfigInstance.DB_PATH,
  synchronize: false,
  cache: true,
  migrations: [path.join(__dirname, '/', 'migrations', '*.{js,ts}')],
  entities: [path.join(__dirname, '/', 'entities', '*.entity.{js,ts}')],
};
export const appDataSource = new DataSource(dataSourceOptions);
