import { User } from '../user/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
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

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => User, (user) => user.cart)
  @JoinColumn({ name: 'userId' })
  user: User;

  @RelationId((cart: Cart) => cart.user)
  userId: string;

  @OneToMany(() => CartItem, (item) => item.cart, {
    cascade: ['insert', 'update', 'remove'],
    eager: true,
    orphanedRowAction: 'delete',
  })
  items: CartItem[];
}
