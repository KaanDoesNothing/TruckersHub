import {BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import { Avatar } from "./avatar";
import { User } from "./user";

@Entity("vtc")
export class VTC extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @OneToOne(() => User, (user) => user)
    @JoinColumn()
    author: User;

    @OneToOne(() => Avatar)
    avatar: Avatar;

    @OneToMany(() => User, (user) => user.vtc)
    members: User[]
    
    @CreateDateColumn()
    createdAt: number;
}