import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'post',
})
export class PhotoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  postImg: string;

  @Column({ nullable: true })
  content: string;

  @Column()
  private: boolean;

  @Column()
  id_user: number;
}
