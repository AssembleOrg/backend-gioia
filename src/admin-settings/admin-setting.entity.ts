// setting.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('admin_settings')
export class AdminSetting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'numeric',
    precision: 30,
    scale: 2,
    nullable: false,
    default: 400_000,
  })
  minimumOrderAmount: number;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
    length: 120,
    default: 'ventas@kansaco.com',
  })
  sellerEmail: string;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
    length: 120,
    default: 'info@kansaco.com',
  })
  infoEmail: string;
}
