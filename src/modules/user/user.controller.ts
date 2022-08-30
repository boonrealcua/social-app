import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserEntity } from 'src/model/entities/user.entity';
import { UserService } from 'src/modules/user/user.service';
import { RefreshAccessTokenDto } from '../auth/dto/refresh-access-token.dto';
import { ResponseLogin } from '../auth/dto/response-login.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { loginDto } from './dto/login.dto';

@Controller('auth')
@ApiTags('User manage')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  @ApiOkResponse({ description: 'Signup' })
  async signup(@Body() user: CreateUserDto): Promise<UserEntity> {
    return this.userService.createUser(user);
  }

  @Post('login')
  async login(@Body() loginDTO: loginDto): Promise<ResponseLogin> {
    return this.userService.login(loginDTO);
  }

  @Post('refresh-access-token')
  @ApiBody({
    type: RefreshAccessTokenDto,
  })
  async refreshAccessToken(
    @Body() refreshAccessTokenDto: RefreshAccessTokenDto,
  ): Promise<ResponseLogin> {
    return await this.userService.refreshAccessToken(refreshAccessTokenDto);
  }

  @Get('find')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  findEmail(@Param('email') email: string): any {
    return this.userService.findUserByEmail(email);
  }
}
