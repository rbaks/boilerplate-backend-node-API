import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from "typeorm";

@Entity()
export class User extends BaseEntity {
   @PrimaryGeneratedColumn() id: number;

   @Column() email: string;

   @Column() hashPassword: string;

   @Column() refreshToken: string;
}
