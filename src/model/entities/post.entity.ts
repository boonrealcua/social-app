import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'post',
})
export class PostEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  media: string;

  @Column({ nullable: true })
  content: string;

  @Column()
  private: boolean;

  @Column()
  createAt: Date;

  @Column({ nullable: true })
  updateAt: Date;

  @Column()
  user_id: number;
}
