import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { AppDataSource } from '../data-source';

export enum UserRole {
  EMPLOYEE = 'employee',
  ADMIN = 'admin',
  MANAGER = 'manager',
}

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', unique: true })
  name!: string;

  @OneToMany(() => User, (user) => user.role)
  users!: User[];
}


