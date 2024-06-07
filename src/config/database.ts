import { DataSource } from 'typeorm';
import path from 'path'; 

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'anil',
    password: 'erias007',
    database: 'orders',
    synchronize: true,
    logging: false,
    entities: [path.join(__dirname, '../model/*.{js,ts}')],
    migrations: [],
    subscribers: [],
});
