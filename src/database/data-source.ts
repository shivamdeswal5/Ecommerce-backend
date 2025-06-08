import { DataSource } from 'typeorm';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME, 
  synchronize: false,
  logging: true,
  entities: [path.resolve(__dirname, '../**/entities/*.entity.{ts,js}')],
  migrations: [path.resolve(__dirname, '../database/migrations/*-migration.ts')],
  migrationsRun: false, 
});