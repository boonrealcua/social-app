import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from 'src/model/entities/post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
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

  async getAllPost(user_id: number): Promise<PostEntity[]> {
    const currentUserPost = await this.getCurrentUserPost(user_id);
    const allPublicPost = await this.postRepository.find({
      where: { private: false },
      order: { createAt: 'DESC' },
    });

    const data = [].concat(currentUserPost, allPublicPost);
    return data;
  }

  async getCurrentUserPost(user_id: number): Promise<PostEntity[]> {
    return await this.postRepository.find({
      where: { user_id: user_id },
      order: { createAt: 'DESC' },
    });
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
