import { IsEmail } from 'class-validator';
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'user',
})
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  profileImg: string;

  @Column()
  location: string;

  @Column()
  bio: string;

  @Column()
  instagramUrl: string;

  @Column()
  linkedinUrl: string;

  @Column()
  facebookUrl: string;

  @Column()
  birthDate: Date;

  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }
}
