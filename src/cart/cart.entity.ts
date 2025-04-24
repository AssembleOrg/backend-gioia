import { User } from '../user/user.entity';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CartItem } from './cartItem.entity';

@Entity('cart')
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'timestamp',
    nullable: false,
  })
  createdAt: Date;

  @OneToOne(() => User, (user) => user.cart)
  user: User;

  @OneToMany(() => CartItem, (item) => item.cart, {
    cascade: ['insert', 'update', 'remove'],
    eager: true,
  })
  items: CartItem[];
}
