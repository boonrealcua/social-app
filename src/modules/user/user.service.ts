import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable, from, map, switchMap, throwError, catchError } from 'rxjs';
import { UserEntity } from 'src/model/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { loginDto } from './dto/login.dto';
import { User } from './user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly authService: AuthService,
  ) {}

  createUser(user: CreateUserDto): Observable<User> {
    return from(this.findOneByEmail(user.email)).pipe(
      switchMap(() => {
        return this.authService.hashPassword(user.password).pipe(
          switchMap((passwordHash: string) => {
            const newUser = new UserEntity();
            newUser.email = user.email;
            newUser.password = passwordHash;

            return from(this.userRepository.save(newUser)).pipe(
              map((user: User) => {
                const { password, ...result } = user;
                return result;
              }),
              catchError((err) => throwError(err)),
            );
          }),
        );
      }),
    );
  }

  findByEmail(email: string): Observable<User> {
    return from(this.userRepository.findOneBy({ email })).pipe(
      map((username: User) => {
        if (!username) {
          throw new NotFoundException('This username not exist');
        }
        return username;
      }),
    );
  }

  async findOneByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (user) {
      throw new NotFoundException('This email already exists');
    }
    return user;
  }

  findById(id: number): Observable<User> {
    return from(this.userRepository.findOneBy({ id })).pipe(
      map((user: User) => {
        if (!user) {
          throw new NotFoundException('This user not exist');
        }
        const { password, ...rs } = user;
        return rs;
      }),
    );
  }

  login(user: loginDto): Observable<string> {
    return this.validateUser(user.email, user.password).pipe(
      switchMap((user: User) => {
        if (user) {
          return this.authService
            .generateJWT(user)
            .pipe(map((jwt: string) => jwt));
        } else {
          return 'Username or Password Wrong!!!';
        }
      }),
    );
  }

  validateUser(username: string, password: string): Observable<User> {
    return this.findByEmail(username).pipe(
      // tap(() => console.log(password)),
      switchMap((user: User) =>
        this.authService.comparePassword(password, user.password).pipe(
          map((match: boolean) => {
            if (match) {
              const { password, ...rs } = user;
              return rs;
            } else {
              throw new NotFoundException('Password Wrong!!!');
            }
          }),
        ),
      ),
    );
  }
}
