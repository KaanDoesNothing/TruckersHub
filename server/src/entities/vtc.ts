import {BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import { User } from "./user";

@Entity("vtc")
export class VTC extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column()
    author: string;
    
    @CreateDateColumn()
    createdAt: number;
}