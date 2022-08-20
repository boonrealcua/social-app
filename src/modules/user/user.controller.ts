import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Observable, map } from 'rxjs';
import { UserService } from 'src/modules/user/user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { loginDto } from './dto/login.dto';

@Controller('auth')
@ApiTags('User manage')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  signup(@Body() user: CreateUserDto): any {
    return this.userService.createUser(user);
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
  findemail(@Body() email: string): any {
    return this.userService.findOneByEmail(email);
  }
}
