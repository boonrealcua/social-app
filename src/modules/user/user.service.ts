import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable, from, map, switchMap } from 'rxjs';
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
    private authService: AuthService,
  ) {}
  async createUser(user: CreateUserDto) {
    return this.userRepository.save(user);
  }

  async findOneByEmail(email: string) {
    return await this.userRepository.findBy({ email });
  }

  findOne(id: number): Observable<User> {
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

  validateUser(email: string, password: string): Observable<User> {
    return this.findByEmail(email).pipe(
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
  findByEmail(email: string): Observable<User> {
    return from(this.userRepository.findOneBy({ email })).pipe(
      map((email: User) => {
        if (!email) {
          throw new NotFoundException('This username not exist');
        }
        return email;
      }),
    );
  }
}
