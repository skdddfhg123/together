import { IsNotEmpty, IsString } from "class-validator";
import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn } from "typeorm";


@Entity()
export class CalendarEntity{
    @PrimaryColumn('uuid')
    calendar_id: string;

    @Column()
    @IsNotEmpty()
    @IsString()
    title: string;

    @Column()
    @IsString()
    cover_image: string;

    @Column()
    @IsString()
    banner_image: string;

    @Column()
    @IsString()
    type: string;

    // @ManyToMany(() => UserCalendarEntity, (userCalendar) => userCalendar.calendar)
    // @JoinColumn()
    // user_calendar: UserCalendarEntity[];

    // @OneToMany(() => ) // 그룹 이벤트
}