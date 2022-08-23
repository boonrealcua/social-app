import {
  CanActivate,
  ExecutionContext,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { map, Observable, tap } from 'rxjs';
import { User } from '../../user/user.interface';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class UserIsUserGuard implements CanActivate {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const params = request.params;
    const data = request.user;

    return this.userService.findById(data.user.id).pipe(
      map((user: User) => {
        let hasPermission = false;

        if (Number(user.id) === Number(params.id)) {
          hasPermission = true;
        }

        return user && hasPermission;
      }),
    );
  }
}
