import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageMetaDto } from 'shares/dto/page-meta.dto';
import { PageOptionsDto } from 'shares/dto/page-option.dto';
import { PageDto } from 'shares/dto/page.dto';
import { PostEntity } from 'src/model/entities/post.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    private readonly userService: UserService,
  ) {}

  async createPost(
    postImg: string,
    post: CreatePostDto,
    user_id: number,
  ): Promise<PostEntity> {
    const newPost = new PostEntity();
    newPost.media = postImg;
    newPost.content = post.content;
    newPost.private = post.private.toString() === 'true' ? true : false;
    newPost.user_id = user_id;
    newPost.createAt = new Date();

    // console.log('data: ', newPost);
    return await this.postRepository.save(newPost);
  }

  async getAllPost(
    user_id: number,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<PostEntity>> {
    const queryBuilder = await this.postRepository
      .createQueryBuilder()
      .where('private = false')
      .orWhere('user_id = :user_id', { user_id });

    queryBuilder
      .orderBy('createAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const data = [];

    for (let i = 0; i < entities.length; i++) {
      data.push(
        await [].concat(
          entities[i],
          await this.userService.findUserById(entities[i].user_id),
        ),
      );
    }

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(data, pageMetaDto);
  }

  async getCurrentUserPost(
    user_id: number,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<PostEntity>> {
    const queryBuilder = this.postRepository
      .createQueryBuilder()
      .where('user_id = :user_id', { user_id });

    queryBuilder
      .orderBy('createAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const data = [];

    for (let i = 0; i < entities.length; i++) {
      data.push(
        await [].concat(
          entities[i],
          await this.userService.findUserById(entities[i].user_id),
        ),
      );
    }

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(data, pageMetaDto);
  }

  async deletePost(id: number, user_id: number): Promise<any> {
    await this.checkPost(id, user_id);
    await this.postRepository.delete(id);
    throw new HttpException('OK', HttpStatus.OK);
  }

  async updatePost(
    id: number,
    post: UpdatePostDto,
    postImg: string,
    user_id: number,
  ): Promise<any> {
    await this.checkPost(id, user_id);
    const newPost = new PostEntity();
    newPost.media = postImg;
    newPost.content = post.content;
    newPost.private = post.private.toString() === 'true' ? true : false;
    newPost.user_id = user_id;
    newPost.updateAt = new Date();

    return this.postRepository.update(id, newPost);
  }

  async checkPost(id: number, user_id: number): Promise<any> {
    const post = await this.findPostById(id);
    if (post.user_id === user_id) {
    } else {
      throw new HttpException('NOT_ACCEPTABLE', HttpStatus.NOT_ACCEPTABLE);
    }
  }

  async findPostById(id: number): Promise<PostEntity> {
    const post = await this.postRepository.findOneBy({ id: id });
    if (post === null) {
      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    }
    return post;
  }
}
