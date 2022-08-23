import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Observable, map } from 'rxjs';
import { UserService } from 'src/modules/user/user.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { loginDto } from './dto/login.dto';
import { User } from './user.interface';

@Controller('auth')
@ApiTags('User manage')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  // eslint-disable-next-line @typescript-eslint/ban-types
  signup(@Body() user: CreateUserDto): Observable<User | Object> {
    return this.userService.createUser(user).pipe(
      map((user: User) => user),
      // catchError((err) => of({ error: err })),
    );
  }

  @Post('login')
  @ApiOkResponse({ description: 'Login' })
  // eslint-disable-next-line @typescript-eslint/ban-types
  login(@Body() user: loginDto): Observable<Object> {
    return this.userService.login(user).pipe(
      map((jwt: string) => {
        return { access_token: jwt };
      }),
    );
  }

  @Get('find')
  // @UseGuards(JwtAuthGuard)
  findEmail(@Param('email') email: string): any {
    return this.userService.findOneByEmail(email);
  }
}
