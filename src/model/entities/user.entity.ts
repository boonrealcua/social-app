import { IsEmail } from 'class-validator';
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'user',
})
export class UserEntity {
  @PrimaryGeneratedColumn()
  id_user: number;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  profileImg: string;

  @Column()
  createdAt: Date;

  @Column()
  gender: string;

  @Column()
  birthDate: Date;

  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }
}
