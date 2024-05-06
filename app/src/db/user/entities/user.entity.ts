import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { FeedComment } from "src/db/comment/entities/comment.entity";
import { UserCalendar } from "src/db/user_calendar/entities/userCalendar.entity";
import { Feed } from "src/feed/entities/feed.entity";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";

@Entity()
@Unique(['useremail', 'nickname'])
export class User extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    userId : string;

    @Column({ nullable: false })
    useremail: string;

    @Column({ nullable: false })
    @Exclude()
    password: string;
    
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
    registeredAt: Date;

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
   
    @OneToOne(() => UserCalendar, userCalendar => userCalendar.user)
    @JoinColumn({ name: 'userCalendarId' })
    userCalendarId: UserCalendar

    @OneToMany(()=> Feed, feed => feed.user)
    feeds: Feed[];

    @OneToMany(() => FeedComment, FeedComment => FeedComment.user)
    feedComments: FeedComment[];
}