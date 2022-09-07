import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserID } from 'shares/decorators/get-user-id.decorator';
import { DecoratorUploadPostMedia } from 'shares/decorators/post-media.decorator';
import { PageOptionsDto } from 'shares/dto/page-option.dto';
import { PageDto } from 'shares/dto/page.dto';
import { PostEntity } from 'src/model/entities/post.entity';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { PostService } from './post.service';

@Controller()
@ApiTags('Post Manager')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('post')
  @DecoratorUploadPostMedia()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async createPost(
    @Body() post: CreatePostDto,
    @UserID() user_id: number,
    @UploadedFile() postImg: Express.Multer.File,
  ): Promise<PostEntity> {
    return await this.postService.createPost(postImg.path, post, user_id);
  }

  @Get('post')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getAllPost(
    @Query() pageOptionsDto: PageOptionsDto,
    @UserID() user_id: number,
  ): Promise<PageDto<PostEntity>> {
    return await this.postService.getAllPost(user_id, pageOptionsDto);
  }

  @Get('current-user-post')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getCurrentUserPost(
    @Query() pageOptionsDto: PageOptionsDto,
    @UserID() user_id: number,
  ): Promise<PageDto<PostEntity>> {
    return await this.postService.getCurrentUserPost(user_id, pageOptionsDto);
  }

  @Delete('post/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async deletePost(
    @Param('id', ParseIntPipe) id: number,
    @UserID() user_id: number,
  ): Promise<any> {
    return await this.postService.deletePost(id, user_id);
  }

  @Put('post/:id')
  @DecoratorUploadPostMedia()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body() post: UpdatePostDto,
    @UserID() user_id: number,
    @UploadedFile() postImg: Express.Multer.File,
  ): Promise<PostEntity> {
    return await this.postService.updatePost(id, post, postImg.path, user_id);
  }
}
