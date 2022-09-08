import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PostEntity } from 'src/model/entities/post.entity';
import { UserModule } from '../user/user.module';
import { UserEntity } from 'src/model/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity, UserEntity]), UserModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
