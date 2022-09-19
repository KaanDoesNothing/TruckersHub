import {BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import { User } from "./user";

@Entity("truckersmp_profile")
export class mpProfile extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("simple-json", {default: null})
    data: any;

    @CreateDateColumn()
    createdAt: number;
}