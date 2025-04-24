import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { UserRole } from './user.enum';
import { Cart } from '../cart/cart.entity';

@Entity('user')
export class User {
  @PrimaryColumn()
  id: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 120,
  })
  email: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 120,
  })
  fullName: string;

  @Column({
    type: 'enum',
    nullable: false,
    default: UserRole.USER,
    enum: UserRole,
    enumName: 'user_role',
  })
  role: UserRole;

  @OneToOne(() => Cart, (cart) => cart.user, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  cart: Cart;
}
