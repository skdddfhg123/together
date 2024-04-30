import { IsNotEmpty, IsString } from "class-validator";
import { User } from "src/db/user/entities/user.entity";
import { UserCalendar } from "src/db/user_calendar/entities/userCalendar.entity";
import { Column, Entity, JoinColumn, ManyToMany, OneToMany, PrimaryColumn } from "typeorm";


@Entity()
export class Calendar{
    @PrimaryColumn('uuid')
    calendarId: string;

    // @Column({ nullable: false })
    // author: User;

    @Column()
    @IsNotEmpty()
    @IsString()
    title: string;

    @Column({ nullable: true })
    @IsString()
    coverImage: string;

    @Column({ nullable: true })
    @IsString()
    bannerImage: string;

    @Column({ nullable: true })
    @IsString()
    type: string;

    @ManyToMany(() => UserCalendar, (userCalendar) => userCalendar.calendars)
    @JoinColumn()
    userCalendars: UserCalendar[];

    // @OneToMany(() => ) // 그룹 이벤트
}