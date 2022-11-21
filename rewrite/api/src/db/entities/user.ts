import {BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import { Event } from "./event";
import { mpProfile } from "./mpProfile";
import { VTC } from "./vtc";

@Entity("user")
export class User extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({nullable: true})
    steam_id: string;

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

    @OneToOne(() => mpProfile)
    @JoinColumn()
    truckersmp: mpProfile;

    @Column()
    administrator: boolean;

    @CreateDateColumn()
    createdAt: number;
}