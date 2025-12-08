import { DataSource } from 'typeorm';
import * as entities from '../entities';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL, // Neon já dá SSL
  ssl: true, // Neon exige SSL
  
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  entities: Object.values(entities),
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'typeorm_migrations',
  extra: {
    connectionTimeoutMillis: 10000,
    max: 20,
  }
});