import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './model/entities/user.entity';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';

export const Modules = [
  TypeOrmModule.forRootAsync({
    useFactory: () => ({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'socialapp',
      entities: [UserEntity],
      synchronize: true,
    }),
  }),
  UserModule,
  AuthModule,
];
