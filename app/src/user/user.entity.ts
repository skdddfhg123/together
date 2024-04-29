import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";

@Entity()
@Unique(['email', 'nickname'])
export class User extends BaseEntity{
    @PrimaryGeneratedColumn()
    userId : number;

    @Column({ nullable: false })
    email: string;

    @Column({ nullable: false })
    @Exclude()
    pwd: string;
    
    @Column({ nullable: true, default: null })
    @Exclude()
    prePwd: string | null;

    @Column({ nullable: true, default: null })
    phone: string | null;

    @Column({ nullable: false })
    nickname: string;

    @Column({ nullable: true, default: null })
    thumbnail: string | null;

    @CreateDateColumn()
    registerdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    @ApiProperty({ description: 'The date when the user was deleted', example: '2023-01-03T00:00:00.000Z' })
    deletedAt?: Date;

    //@Column({ nullable: false })
    //settings: string;

    @Column({ nullable: true })
    birthDay: Date | null;

    @Column({ nullable: false, default: false })
    birthDayFlag: boolean;
   
    // Relation
    //@OneToMany(type => Board, board => board.user, {eager : true})
    //boards: Board[]
}