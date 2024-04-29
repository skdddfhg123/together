import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(['email', 'nickname'])
export class User extends BaseEntity{

    @PrimaryGeneratedColumn()
    userId : number;

    @Column({ nullable: false })
    email: string;

    @Column({ nullable: true })
    prePwd: string | null;

    @Column({ nullable: false })
    pwd: string;

    @Column({ nullable: true })
    phone: string | null;

    @Column({ nullable: true })
    nickname: string | null;

    @Column({ nullable: true })
    thumbnail: string | null;

    @Column({ nullable: false })
    registerdAt: Date;

    @Column({ nullable: true })
    changedAt: Date | null;

    //@Column({ nullable: false })
    //settings: string;

    @Column({ nullable: true })
    birthDay: Date | null;

    @Column({ nullable: false })
    birthDayFlag: boolean;
   
    // Relation
    //@OneToMany(type => Board, board => board.user, {eager : true})
    //boards: Board[]
}