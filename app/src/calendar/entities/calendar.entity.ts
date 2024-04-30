import { IsNotEmpty, IsString } from "class-validator";
import { UserCalendarEntity } from "src/user/utils/entities/user.calendar.entity";
import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn } from "typeorm";


@Entity()
export class CalendarEntity{

    // ======================================================================================================================
    // Require Column
    // ======================================================================================================================

    @PrimaryColumn()
    calendar_id: string;

    @Column()
    @IsNotEmpty()
    @IsString()
    title: string;

    // ======================================================================================================================
    // Optional Column
    // ======================================================================================================================
    
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