import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './model/entities/user.entity';
import { UserModule } from './modules/user/user.module';

export const Modules = [
  UserModule,
  TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: String(process.env.TYPEORM_PORT || '3306'),
    username: 'root',
    password: '123',
    database: 'socialapp',
    entities: [UserEntity],
    synchronize: true,
  }),
];
