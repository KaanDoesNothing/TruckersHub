import {BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import { User } from "./user";

@Entity("event")
export class Event extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => User, (user) => user.events)
    author: User;

    @Column()
    type: string;

    @Column("simple-json", {default: null})
    data: string;

    @CreateDateColumn()
    createdAt: number;
}