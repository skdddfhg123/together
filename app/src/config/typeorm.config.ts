import { TypeOrmModuleOptions } from '@nestjs/typeorm';
// import * as config from 'config';

// const dbConfig = config.get('db');
// console.log('db :', dbConfig);

// export const typeORMConfig : TypeOrmModuleOptions = {
//     type: 'postgres',
//     host: process.env.DB_HOSTNAME || dbConfig.host,
//     port: process.env.DB_PORT || dbConfig.port,
//     username: process.env.DB_USERNAME || dbConfig.username,
//     password: process.env.DB_PASSWORD || dbConfig.password,
//     database: process.env.DB_DATABASE || dbConfig.database,
//     entities: [__dirname + '/../**/*.entity.{js,ts}'],
//     synchronize: dbConfig.synchronize
// }
export const typeORMConfig : TypeOrmModuleOptions = {
    type: 'postgres',
    host: process.env.DB_HOSTNAME,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: true,
}

// console.log(typeORMConfig);
