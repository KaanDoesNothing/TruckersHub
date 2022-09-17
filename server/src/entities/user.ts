import {BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import { Event } from "./event";

@Entity("user")
export class User extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    token: string;

    @Column()
    username: string;

    @Column()
    password: string;
    
    @OneToMany(() => Event, (event) => event.author)
    events: Event[]

    @Column()
    administrator: boolean;

    @CreateDateColumn()
    createdAt: number;
}