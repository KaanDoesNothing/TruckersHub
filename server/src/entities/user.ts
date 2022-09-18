import {BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import { Event } from "./event";
import { VTC } from "./vtc";

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

    @ManyToOne(() => VTC, (vtc) => vtc.members, {onDelete: "SET NULL"})
    vtc: VTC;

    @Column()
    administrator: boolean;

    @CreateDateColumn()
    createdAt: number;
}