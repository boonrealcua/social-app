import {
  CanActivate,
  ExecutionContext,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class UserIsUserGuard implements CanActivate {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const params = request.params;
    const data = request.user;

    const user = this.userService.findUserById(data.user.user_id);
    return true;
    //   if (Number(user.user_id) === Number(params.user_id)) return true;
    // }
  }
}
