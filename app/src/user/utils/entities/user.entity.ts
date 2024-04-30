import { Exclude } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";
import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserCalendarEntity } from "./user.calendar.entity";

@Entity({name: 'user'})
export class UserEntity {
    
    // ======================================================================================================================
    // Required Column
    // ======================================================================================================================

    @PrimaryColumn()
    user_id: string;

    @Column()
    @IsNotEmpty()
    @IsString()
    email: string;
    
    @CreateDateColumn()
    registered_at: Date;

    @UpdateDateColumn()
    changed_at: Date;
    
    @Column()
    @IsNotEmpty()
    @IsString()
    @Exclude()
    pwd: string;
    
    @Column()
    @IsNotEmpty()
    @IsString()
    settings: object;

    @OneToMany(() => UserCalendarEntity, (calendar) => calendar.user)
    @IsNotEmpty()
    user_calenders: UserCalendarEntity[];

    // @OneToOne()
    // @IsNotEmpty()
    // settings: 

    // @OneToOne()
    // @IsNotEmpty()
    // platform_connection: 

    // @OneToMany()
    // @IsNotEmpty()
    // feed_reply: 

    // @OneToMany()
    // @IsNotEmpty()
    // feed: 

    // ======================================================================================================================
    // Optional Column
    // ======================================================================================================================

    @Column()
    @IsString()
    pre_pwd: string;

    @Column()
    @IsString()
    phone: string;

    @Column()
    @IsString()
    nickname: string;

    @Column()
    @IsString()
    thumbnail: string;

    @Column()
    birth_day: Date;

    @Column()
    birth_day_flag: boolean;
}