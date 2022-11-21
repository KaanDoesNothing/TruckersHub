import {BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";

@Entity("avatar")
export class Avatar extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("blob", {default: null})
    data: any;

    @CreateDateColumn()
    createdAt: number;
}